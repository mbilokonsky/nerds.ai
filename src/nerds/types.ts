import { AnthropicInput } from "@langchain/anthropic"
import { BaseMessagePromptTemplateLike } from "@langchain/core/prompts"
import { GoogleGenerativeAIChatInput } from "@langchain/google-genai"
import { AgentExecutor } from "langchain/agents"
import { BaseLanguageModelParams } from "langchain/base_language"
import { BaseChatModel, BaseChatModelParams } from "langchain/chat_models/base"
import { AzureOpenAIInput, OpenAIChatInput } from "langchain/chat_models/openai"
import { ChatPromptTemplate } from "langchain/prompts"
import { RunnableSequence } from "langchain/runnables"
import { InputValues } from "langchain/schema"
import { StructuredTool } from "langchain/tools"
import { Schema, SchemaType, SchemaWrapper } from "./JSONNerds/output_schemas.js"

/* 
  Options represent the input parameters used to create the nerd. Extensions of this type are used to shape the output format of the nerd. 
*/

export enum Models {
  OpenAI = "openai",
  Anthropic = "anthropic",
  Gemini = "gemini"
}

export enum OutputTypes {
  JSON = "json",
  Markdown = "markdown"
}


type NerdOutputType = OutputTypes
type NerdTools = StructuredTool[]
type NerdPreferredModels = Models[]


export type BaseNerdOptions<OutputType extends NerdOutputType, Tools extends NerdTools = [], PreferredModels extends NerdPreferredModels = []> = {
  name: string
  purpose: string
  do_list: string[]
  do_not_list: string[]
  as_tool_description: string
  output_format: OutputType
  additional_notes?: string
  tools?: Tools
  preferred_models?: PreferredModels
}

export type MarkdownNerdOptions = BaseNerdOptions<OutputTypes.Markdown>
export type JSONNerdOptions<T extends SchemaType> = BaseNerdOptions<OutputTypes.JSON> & {
  output_schema: T
}

export type NerdOptions = JSONNerdOptions<Schema<SchemaType>> | MarkdownNerdOptions

/* 
  UnboundNerd represents a nerd that has not yet been bound to a language model. 
  They are informed by the subtype of the BaseNerdOptions type that they are parameterized with. 
*/
export type BaseUnboundNerd<Options extends BaseNerdOptions<NerdOutputType, NerdTools, NerdPreferredModels>> = {
  name: Options["name"],
  system_message: string
  prompt_template_input: (ChatPromptTemplate<InputValues, string> | BaseMessagePromptTemplateLike)[]
  tools: StructuredTool[]
  is_agent: boolean
  as_tool_description: string
  config_options: Options
}

export type JSONUnboundNerd<T extends Schema<SchemaType>> = BaseUnboundNerd<JSONNerdOptions<T>> & {
  output_details: T
}
export type MarkdownUnboundNerd = BaseUnboundNerd<MarkdownNerdOptions>

export type UnboundNerd = JSONUnboundNerd<Schema<SchemaType>> | MarkdownUnboundNerd

export type OpenAIParams = Partial<OpenAIChatInput> & Partial<AzureOpenAIInput> & BaseLanguageModelParams
export type AnthropicParams = Partial<AnthropicInput> & BaseChatModelParams

export type ModelBinder<T extends NerdOutput> = (llm: BaseChatModel) => Promise<BoundNerd<T>>
export type OpenAIBinder<T extends NerdOutput> = (gpt_opts?: OpenAIParams) => Promise<BoundNerd<T>>
export type AnthropicBinder<T extends NerdOutput> = (anthropic_opts?: AnthropicParams) => Promise<BoundNerd<T>>
export type GeminiBinder<T extends NerdOutput> = (gemini_opts?: GoogleGenerativeAIChatInput) => Promise<BoundNerd<T>>

export type BindableNerd<T extends NerdOutput> = UnboundNerd & {
  bind: ModelBinder<T>
  with_openai: OpenAIBinder<T>
  with_anthropic: AnthropicBinder<T>
  with_gemini: GeminiBinder<T>
}

export type NerdOutput = SchemaType | string

export type BoundNerd<T extends NerdOutput> = {
  invoke: (invocation_input: NerdInvocationInput) => Promise<T>
  as_tool: StructuredTool,
  as_agent: RunnableSequence,
  as_executor: AgentExecutor
}

export type NerdInvocationInput = {
  input: string
  additional_instructions?: string
}

export type ChatTemplateInput = (ChatPromptTemplate<InputValues, string> | BaseMessagePromptTemplateLike)[]