import { build_system_message } from "./prompts.js"
import { BindableNerd, ChatTemplateInput, NerdOptions } from "./types.js"
import { bind_nerd, bind_to_anthropic, bind_to_gemini, bind_to_openai } from "./model_bindings.js"

export const create_nerd = (nerd_options: NerdOptions): BindableNerd => {
  const do_block = nerd_options.do_list.length === 0 ? "" : `Do:
  ${nerd_options.do_list.map(str => "* " + str).join("\n\t")}
  
`
  const do_not_block = nerd_options.do_not_list.length === 0 ? "" : `Do Not:
  ${nerd_options.do_not_list.map(str => "* " + str).join("\n\t")}
`
  // we need to escape the curly braces in the output schema because otherwise the string will be interpreted as a template string
  const output_schema = nerd_options.output_schema.replaceAll("{", "{{").replaceAll("}", "}}")

  const system_message = build_system_message(nerd_options.purpose, do_block, do_not_block, nerd_options.additional_notes || "", output_schema)

  const invocation_input: ChatTemplateInput = [
    ["system", system_message]
  ]

  const tools = nerd_options.tools || []
  const is_agent = tools.length > 0

  const nerd = {
    name: nerd_options.name,
    system_message,
    prompt_messages: invocation_input,
    is_agent,
    tools,
    as_tool_description: nerd_options.as_tool_description,
  }

  const bind_to_llm = bind_nerd.bind(null, nerd)
  const with_openai = bind_to_openai.bind(null, nerd)
  const with_anthropic = bind_to_anthropic.bind(null, nerd)
  const with_gemini = bind_to_gemini.bind(null, nerd)

  return {
    ...nerd,
    bind: bind_to_llm,
    with_openai,
    with_anthropic,
    with_gemini
  }
}

