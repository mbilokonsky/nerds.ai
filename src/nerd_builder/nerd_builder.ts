import { build_system_message } from "./prompts/prompts.js"
import { BoundNerd, ChatTemplateInput, NerdInvocationInput, SupportedChatModel, AgentType, Nerd, Options, UnboundSimpleNerd, UnboundToolUsingNerd, UnboundReActToolUsingNerd } from "./types.js"
import { OutputSpecifier } from "./output_specifiers/index.js"
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { AgentExecutor, createReactAgent, createToolCallingAgent } from "langchain/agents"
import { DynamicStructuredTool, StructuredTool } from "langchain/tools"
import { z } from "zod"
import { ChatOpenAI } from "@langchain/openai"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatAnthropic } from "@langchain/anthropic"

export class NerdBuilder<O extends OutputSpecifier, A extends AgentType> {
  unbound_nerd: Nerd<O>
  bound_nerds = {}
  nerd_options: Options<O>

  constructor(options: Options<O>) {
    this.nerd_options = options
    this.initialize(options)
  }

  initialize(nerd_options: Options<O>): NerdBuilder<O, A> {
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

    const agent_type = nerd_options.agent_type
    const output_specifier = nerd_options.output_specifier

    if (agent_type === AgentType.SimpleAgent) {
      this.unbound_nerd = {
        name: nerd_options.name,
        system_message,
        prompt_messages: invocation_input,
        as_tool_description: nerd_options.as_tool_description,
        output_specifier: output_specifier,
        agent_type: agent_type,
        config: nerd_options
      } as UnboundSimpleNerd<O>
    } else if (agent_type === AgentType.ToolUsingAgent) {
      const tools = nerd_options.tools || []

      this.unbound_nerd = {
        name: nerd_options.name,
        system_message,
        prompt_messages: invocation_input,
        tools,
        as_tool_description: nerd_options.as_tool_description,
        output_specifier: output_specifier,
        agent_type: agent_type,
        config: nerd_options
      } as UnboundToolUsingNerd<O>
    } else if (agent_type === AgentType.ReActToolUsingAgent) {
      const tools = nerd_options.tools || []

      this.unbound_nerd = {
        name: nerd_options.name,
        system_message,
        prompt_messages: invocation_input,
        tools,
        as_tool_description: nerd_options.as_tool_description,
        output_specifier: output_specifier,
        agent_type: agent_type,
        config: nerd_options
      } as UnboundReActToolUsingNerd<O>
    }

    return this;
  }

  async bind(llm: SupportedChatModel): Promise<BoundNerd<O, A>> {
    const invocation_input = this.unbound_nerd.prompt_messages
    invocation_input.push(["human", "Additional instructions to be followed in addition to everything in the system message: {additional_instructions}"])


    let prompt: ChatPromptTemplate, agent, executor, invoke_as_tool;

    if (this.unbound_nerd.agent_type === AgentType.SimpleAgent) {
      invocation_input.push(["human", `Please perform your assigned duties against the following input:

{input}`])
      prompt = ChatPromptTemplate.fromMessages(invocation_input)
      invoke_as_tool = async (nerd_invocation_input: NerdInvocationInput): Promise<string> => {
        const is_gemini = llm._modelType() === "google-genai"
        const opts = {}
        if (is_gemini) {
          opts['generationConfig'] = { response_mime_type: "application/json" }
        }

        const formatted_prompt = await prompt.invoke({ input: nerd_invocation_input.input, additional_instructions: nerd_invocation_input.additional_instructions || "" })

        const response = await llm.invoke(formatted_prompt, opts)

        return response.content as string
      }
    } else if (this.unbound_nerd.agent_type === AgentType.ToolUsingAgent) {
      invocation_input.push(["human", `You have access to a scratchpad and I'd like you to use it to log your thoughts as you go. Take your time, work carefully, and feel free to take several iterations to go over and revise your own work. Log your thoughts and observations to the scratchpad, and return the final answer when you're ready.

{agent_scratchpad}

Please perform your assigned duties against the following input:

{input}`])
      const tools = this.unbound_nerd.tools
      const prompt = ChatPromptTemplate.fromMessages(invocation_input)
      agent = await createToolCallingAgent({ llm, tools, prompt })
      executor = new AgentExecutor({ agent, tools })
    } else if (this.unbound_nerd.agent_type === AgentType.ReActToolUsingAgent) {
      invocation_input.push(["human", `Below you will find the input against which you are to perform your duties. When performing your duties, please follow the following guidelines:

{input}`])
      const tools = this.unbound_nerd.tools
      const prompt = ChatPromptTemplate.fromMessages(invocation_input)
      agent = await createReactAgent({ llm, tools, prompt })
      executor = new AgentExecutor({ agent, tools })

      invoke_as_tool = async (nerd_invocation_input: NerdInvocationInput): Promise<string> => {
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
    }



    const invoke = async (nerd_invocation_input: NerdInvocationInput) => {
      const text = await invoke_as_tool(nerd_invocation_input)

      if (this.nerd_options.output_specifier.format === "json") {
        const json = text;
        // the output may wrap the JSON in a codefence or other formatting. Let's make sure we remove any characters from the front prior to "{" and any from the end after the final "}"
        let start = json.indexOf("{")
        let end = json.lastIndexOf("}")
        if (start === 0 && end === json.length - 1) {
          console.log("(Woohoo, we got a clean JSON object!)")
        }

        if (start === -1 || end === -1) {
          console.error("Error parsing nerd output for some reason. Here's what it spit out:")
          console.dir(json)
          throw new Error("Error parsing JSON output")
        }

        // sometimes, randomly, the JSON output will double up the curly braces around the JSON object. Let's check for that and trim it if necessary.
        if (json.indexOf("{{") === 0) {
          start++
          end--
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
