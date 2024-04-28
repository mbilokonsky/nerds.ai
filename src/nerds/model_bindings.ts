import { DynamicStructuredTool, StructuredTool } from "langchain/tools"
import { BoundNerd, NerdInvocationInput, BaseUnboundNerd, UnboundNerd, NerdOutput } from "./types.js"
import { BaseChatModel } from "langchain/chat_models/base"
import { ChatOpenAI } from "@langchain/openai"
import { ChatAnthropic } from "@langchain/anthropic"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { AgentExecutor, createToolCallingAgent } from "langchain/agents"
import { ChatPromptTemplate } from "langchain/prompts"
import { z } from "zod"
import { RevisionSchema } from "./JSONNerds/output_schemas.js"

export const bind_nerd = async (nerd: UnboundNerd, llm: BaseChatModel): Promise<BoundNerd<NerdOutput>> => {
  let agent, executor
  const invocation_input = nerd.prompt_template_input

  invocation_input.push(["human", "Additional instructions to be followed in addition to everything in the system message: {additional_instructions}"])
  invocation_input.push(["human", `Please perform your assigned duties against the following input:

{input}`])

  if (nerd.is_agent) {
    invocation_input.push(["placeholder", "{agent_scratchpad}"])
  }

  const prompt = ChatPromptTemplate.fromMessages(invocation_input)

  if (nerd.is_agent) {
    agent = await createToolCallingAgent({ llm, tools: nerd.tools, prompt })
    executor = new AgentExecutor({ agent, tools: nerd.tools })
  }

  // the output here is a JSON string
  const invoke_as_tool = async (nerd_invocation_input: NerdInvocationInput): Promise<string> => {

    // to ensure JSON output we need to do a bit of extra work if we're using gemini
    const is_gemini = llm._modelType() === "google-genai"
    const opts = {}
    if (is_gemini) {
      opts['generationConfig'] = { response_mime_type: "application/json" }
    }

    if (nerd.is_agent) {
      const agent_output = await executor.invoke({
        input: nerd_invocation_input.input,
        additional_instructions: nerd_invocation_input.additional_instructions || ""
      },
        opts
      )
      return agent_output.output
    } else {
      const final_prompt = await prompt.invoke({
        input: nerd_invocation_input.input,
        additional_instructions: nerd_invocation_input.additional_instructions || ""
      })
      const result = await llm.invoke(final_prompt, opts)
      return result.content as string
    }
  }

  // the output here is a JSON object, with a dynamic type based on the nerd's output schema
  const invoke = async (nerd_invocation_input: NerdInvocationInput): Promise<RevisionSchema> => {
    const json = await invoke_as_tool(nerd_invocation_input)

    // the output may wrap the JSON in a codefence or other formatting. Let's make sure we remove any characters from the front prior to "{" and any from the end after the final "}"
    const start = json.indexOf("{")
    const end = json.lastIndexOf("}")
    if (start === 0 && end === json.length - 1) {
      console.log("(Woohoo, we got a clean JSON object!)")
    }

    if (start === -1 || end === -1) {
      console.error("Error parsing nerd output for some reason. Here's what it spit out:")
      console.dir(json)
      throw new Error("Error parsing JSON output")
    }

    const trimmed = json.slice(start, end + 1)
    try {
      return JSON.parse(trimmed)
    } catch (e) {
      console.error("Error parsing nerd output for some reason. Here's what it spit out:")
      console.dir(json)
      throw (e)
    }
  }

  const as_tool: StructuredTool = new DynamicStructuredTool({
    name: nerd.name,
    description: `This tool exposes the ${nerd.name} behavior. It takes an object with a required "input" string and an optional "additional instructions" string. Use "additional_instructions" to parameterize and constrain the default behavior on a case-by-case basis as necessary.
  The tool's description is as follows: ${nerd.as_tool_description}`,
    func: invoke_as_tool,
    schema: z.object({
      input: z.string(),
      additional_instructions: z.string().optional()
    })
  })

  return {
    invoke,
    as_tool,
    as_agent: agent,
    as_executor: executor
  }
}

export const bind_to_llm = async (nerd: UnboundNerd, llm: BaseChatModel): Promise<BoundNerd<NerdOutput>> => bind_nerd(nerd, llm)

export const bind_to_openai = async (nerd: UnboundNerd, gpt_opts = {
  model: "gpt-4-turbo",
  temperature: 0,
  response_format: {
    type: "json_object"
  }
}): Promise<BoundNerd<NerdOutput>> => await bind_nerd(nerd, new ChatOpenAI(gpt_opts))

export const bind_to_anthropic = async (nerd: UnboundNerd, claud_opts = {
  model: "claude-3-opus-20240229",
  temperature: 0
}): Promise<BoundNerd<NerdOutput>> => await bind_nerd(nerd, new ChatAnthropic(claud_opts))

export const bind_to_gemini = async (nerd: UnboundNerd, gemini_opts = {
  model: 'gemini-1.5-pro-latest',
  temperature: 0,
}): Promise<BoundNerd<NerdOutput>> => await bind_nerd(nerd, new ChatGoogleGenerativeAI(gemini_opts))