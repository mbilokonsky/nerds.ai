import { AnthropicInput, ChatAnthropic } from "@langchain/anthropic"
import { BaseMessagePromptTemplateLike } from "@langchain/core/prompts"
import { ChatGoogleGenerativeAI, GoogleGenerativeAIChatInput } from "@langchain/google-genai"
import { AgentExecutor } from "langchain/agents"
import { BaseLanguageModelParams } from "langchain/base_language"
import { BaseChatModel, BaseChatModelParams } from "langchain/chat_models/base"
import { AzureOpenAIInput, ChatOpenAI, OpenAIChatInput } from "langchain/chat_models/openai"
import { ChatPromptTemplate } from "langchain/prompts"
import { RunnableSequence } from "langchain/runnables"
import { InputValues } from "langchain/schema"
import { StructuredTool } from "langchain/tools"
import { OutputSpecifier } from "./output_formatter.js"

export type NerdOptions<O extends OutputSpecifier> = {
  name: string
  purpose: string
  do_list: string[]
  do_not_list: string[]
  output_specifier: O,
  as_tool_description: string
  tools: StructuredTool[]
  additional_notes?: string
}

export type UnboundNerd<O extends OutputSpecifier> = {
  name: string,
  system_message: string,
  prompt_messages: (ChatPromptTemplate<InputValues, string> | BaseMessagePromptTemplateLike)[]
  tools: StructuredTool[]
  is_agent: boolean
  as_tool_description: string
  output_specifier: O
  config: NerdOptions<O>
}

export type OpenAIParams = Partial<OpenAIChatInput> & Partial<AzureOpenAIInput> & BaseLanguageModelParams
export type AnthropicParams = Partial<AnthropicInput> & BaseChatModelParams

export type OpenAIBinder<O extends OutputSpecifier> = (gpt_opts?: OpenAIParams) => Promise<BoundNerd<O>>
export type AnthropicBinder<O extends OutputSpecifier> = (anthropic_opts?: AnthropicParams) => Promise<BoundNerd<O>>
export type GeminiBinder<O extends OutputSpecifier> = (gemini_opts?: GoogleGenerativeAIChatInput) => Promise<BoundNerd<O>>

export type BindableNerd<O extends OutputSpecifier> = UnboundNerd<O> & {
  bind: (llm: BaseChatModel) => Promise<BoundNerd<O>>
  with_openai: OpenAIBinder<O>
  with_anthropic: AnthropicBinder<O>
  with_gemini: GeminiBinder<O>
}

export type BoundNerd<O extends OutputSpecifier> = {
  invoke: (invocation_input: NerdInvocationInput) => Promise<UnboundNerd<O>>
  as_tool: StructuredTool,
  as_agent: RunnableSequence,
  as_executor: AgentExecutor,
}

export type NerdInvocationInput = {
  input: string
  additional_instructions?: string
}

export type SupportedChatModel = ChatOpenAI | ChatAnthropic | ChatGoogleGenerativeAI

export type ChatTemplateInput = (ChatPromptTemplate<InputValues, string> | BaseMessagePromptTemplateLike)[]