import { build_system_message } from "./prompts.js"
import { BoundNerd, ChatTemplateInput, NerdInvocationInput, NerdOptions, SupportedChatModel, UnboundNerd } from "./types.js"
import { OutputSpecifier } from "./output_formatter.js"
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { AgentExecutor, createToolCallingAgent } from "langchain/agents"
import { DynamicStructuredTool, StructuredTool } from "langchain/tools"
import { z } from "zod"
import { ChatOpenAI } from "@langchain/openai"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatAnthropic } from "@langchain/anthropic"

export class NerdBuilder<O extends OutputSpecifier> {
  unbound_nerd: UnboundNerd<O>
  bound_nerds = {}
  nerd_options: NerdOptions<O>

  constructor(options: NerdOptions<O>) {
    this.nerd_options = options
    this.initialize(options)
  }

  initialize(nerd_options: NerdOptions<O>): NerdBuilder<O> {
    const do_block = nerd_options.do_list.length === 0 ? "" : `Do:
  ${nerd_options.do_list.map(str => "* " + str).join("\n\t")}
  
`
    const do_not_block = nerd_options.do_not_list.length === 0 ? "" : `Do Not:
  ${nerd_options.do_not_list.map(str => "* " + str).join("\n\t")}
`
    // we need to escape the curly braces in the output schema because otherwise the string will be interpreted as a template string
    const output_schema = nerd_options.output_specifier.asString.replaceAll("{", "{{").replaceAll("}", "}}")

    const system_message = build_system_message(nerd_options.purpose, do_block, do_not_block, nerd_options.additional_notes || "", output_schema)

    const invocation_input: ChatTemplateInput = [
      ["system", system_message]
    ]

    const tools = nerd_options.tools || []
    const is_agent = tools.length > 0

    this.unbound_nerd = {
      name: nerd_options.name,
      system_message,
      prompt_messages: invocation_input,
      is_agent,
      tools,
      as_tool_description: nerd_options.as_tool_description,
      output_specifier: nerd_options.output_specifier,
      config: nerd_options
    }

    return this;
  }

  async bind(llm: SupportedChatModel): Promise<BoundNerd<O>> {
    const invocation_input = this.unbound_nerd.prompt_messages
    invocation_input.push(["human", "Additional instructions to be followed in addition to everything in the system message: {additional_instructions}"])
    invocation_input.push(["human", `Please perform your assigned duties against the following input:

{input}`])

    const prompt = ChatPromptTemplate.fromMessages(invocation_input)
    const agent = await createToolCallingAgent({ llm, tools: this.nerd_options.tools, prompt })
    const executor = new AgentExecutor({ agent, tools: this.nerd_options.tools })

    const invoke_as_tool = async (nerd_invocation_input: NerdInvocationInput): Promise<string> => {
      const is_gemini = llm._modelType() === "google-genai"
      const opts = {}
      if (is_gemini) {
        opts['generationConfig'] = { response_mime_type: "application/json" }
      }

      const response = await executor.invoke({
        input: nerd_invocation_input.input,
        additional_instructions: nerd_invocation_input.additional_instructions || ""
      },
        opts
      )

      return response.output
    }

    const invoke = async (nerd_invocation_input: NerdInvocationInput) => {
      const text = await invoke_as_tool(nerd_invocation_input)

      if (this.nerd_options.output_specifier.format === "json") {
        const json = text;
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
        return this.unbound_nerd.output_specifier.parse(trimmed)
      } else {
        return text
      }
    }

    const as_tool: StructuredTool = new DynamicStructuredTool({
      name: this.nerd_options.name,
      description: `This tool exposes the ${this.nerd_options.name} behavior. It takes an object with a required "input" string and an optional "additional instructions" string. Use "additional_instructions" to parameterize and constrain the default behavior on a case-by-case basis as necessary.
  The tool's description is as follows: ${this.nerd_options.as_tool_description}`,
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

  async bind_to_llm(llm) {
    this.bound_nerds[llm.name] = await this.bind(llm)
    return this.bound_nerds[llm.name]
  }

  get_gpt_nerd() {
    if (!this.bound_nerds["openai"]) {
      throw new Error(`You haven't bound a GPT nerd yet. Please call \`await bind_to_gpt(gpt_opts)\` first.`)
    }
    return this.bound_nerds["openai"]
  }

  async bind_to_gpt(gpt_opts = {
    model: "gpt-4-turbo",
    temperature: 0,
    response_format: {
      type: "json_object"
    }
  }) {
    const llm = new ChatOpenAI(gpt_opts)

    this.bound_nerds["openai"] = await this.bind(llm)
    return this.bound_nerds["openai"]
  }

  get_anthropic_nerd() {
    if (!this.bound_nerds["anthropic"]) {
      throw new Error(`You haven't bound an Anthropic nerd yet. Please call \`await bind_to_anthropic(anthropic_opts)\` first.`)
    }
    return this.bound_nerds["anthropic"]
  }

  async bind_to_anthropic(claude_opts = {
    model: "claude-3-opus-20240229",
    temperature: 0
  }) {
    const llm = new ChatAnthropic(claude_opts)
    this.bound_nerds["anthropic"] = await this.bind(llm)
    return this.bound_nerds["anthropic"]
  }

  get_gemini_nerd() {
    if (!this.bound_nerds["gemini"]) {
      throw new Error(`You haven't bound a Gemini nerd yet. Please call \`await bind_to_gemini(gemini_opts)\` first.`)
    }
    return this.bound_nerds["gemini"]
  }

  async bind_to_gemini(gemini_opts = {
    model: 'gemini-1.5-pro-latest',
    temperature: 0,
  }) {
    const llm = new ChatGoogleGenerativeAI(gemini_opts)
    this.bound_nerds["gemini"] = await this.bind(llm)
    return this.bound_nerds["gemini"]
  }

  get_nerds() {
    if (Object.keys(this.bound_nerds).length === 0) {
      throw new Error(`You haven't bound any nerds yet. Please call one of the following methods first:
- \`await bind_to_gpt(gpt_opts)\`
- \`await bind_to_anthropic(anthropic_opts)\`
- \`await bind_to_gemini(gemini_opts)\``)
    }

    return this.bound_nerds
  }
}
