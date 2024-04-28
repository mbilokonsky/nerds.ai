import { build_system_message } from "./prompts.js"
import { BindableNerd, ChatTemplateInput, NerdOptions, JSONNerdOptions, NerdOutput, OpenAIBinder, AnthropicBinder, GeminiBinder, ModelBinder, UnboundNerd, JSONUnboundNerd, MarkdownUnboundNerd, MarkdownNerdOptions } from "./types.js"
import { bind_nerd, bind_to_anthropic, bind_to_gemini, bind_to_openai } from "./model_bindings.js"
import { Schema, SchemaType } from "./JSONNerds/output_schemas.js"

type NerdCreator<T extends NerdOutput> = (nerd_options: NerdOptions) => BindableNerd<T>
export const create_nerd: NerdCreator<NerdOutput> = (nerd_options: NerdOptions): BindableNerd<NerdOutput> => {
  const do_block = nerd_options.do_list.length === 0 ? "" : `Do:
  ${nerd_options.do_list.map(str => "* " + str).join("\n\t")}
  
`
  const do_not_block = nerd_options.do_not_list.length === 0 ? "" : `Do Not:
  ${nerd_options.do_not_list.map(str => "* " + str).join("\n\t")}
`
  const IS_JSON_NERD = nerd_options.output_format === "json"
  const IS_MARKDOWN_NERD = nerd_options.output_format === "markdown"

  let output_format = ""
  if (IS_JSON_NERD) {
    // we need to escape the curly braces in the output schema because otherwise the string will be interpreted as a template string
    const json_nerd_options = nerd_options as JSONNerdOptions<typeof nerd_options.output_schema>
    const stringified_schema = json_nerd_options.output_schema.asString.replaceAll("{", "{{").replaceAll("}", "}}")
    output_format = `Please return your output in compliance with the following JSON schema. 
DO NOT wrap the output in any kind of text or even any kind of code fence, it is essential that you return valid JSON that is machine parsable.
The first character of your output MUST be '{{' and the last character MUST be '}}'.

Output Schema:
${stringified_schema}`
  } else {
    output_format = `Please return your output in markdown format.`
  }

  const system_message = build_system_message(nerd_options.purpose, do_block, do_not_block, nerd_options.additional_notes || "", output_format)

  const invocation_input: ChatTemplateInput = [
    ["system", system_message]
  ]

  const tools = nerd_options.tools || []
  const is_agent = tools.length > 0

  let nerd: UnboundNerd;
  if (IS_JSON_NERD) {
    const json_nerd_options = nerd_options as JSONNerdOptions<typeof nerd_options.output_schema>
    const built_nerd: JSONUnboundNerd<Schema<SchemaType>> = {
      name: json_nerd_options.name,
      system_message,
      prompt_template_input: invocation_input,
      is_agent,
      tools,
      as_tool_description: nerd_options.as_tool_description,
      config_options: json_nerd_options,
      output_details: json_nerd_options.output_schema
    }

    nerd = built_nerd
  } else {
    const markdown_nerd_options = nerd_options as MarkdownNerdOptions
    const built_nerd: MarkdownUnboundNerd = {
      name: nerd_options.name,
      system_message,
      prompt_template_input: invocation_input,
      is_agent,
      tools,
      as_tool_description: nerd_options.as_tool_description,
      config_options: markdown_nerd_options
    }

    nerd = built_nerd
  }




  const bind_to_llm: ModelBinder<NerdOutput> = bind_nerd.bind(null, nerd)
  const with_openai: OpenAIBinder<NerdOutput> = bind_to_openai.bind(null, nerd)
  const with_anthropic: AnthropicBinder<NerdOutput> = bind_to_anthropic.bind(null, nerd)
  const with_gemini: GeminiBinder<NerdOutput> = bind_to_gemini.bind(null, nerd)

  return {
    ...nerd,
    bind: bind_to_llm,
    with_openai,
    with_anthropic,
    with_gemini
  }
}

