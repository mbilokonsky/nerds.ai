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
import { RevisionSchema } from "./output_schemas.js"

export type NerdOptions = {
  name: string
  purpose: string
  do_list: string[]
  do_not_list: string[]
  output_schema: string
  as_tool_description: string
  additional_notes?: string
  tools?: StructuredTool[]
}

export type UnboundNerd = {
  name: string,
  system_message: string,
  prompt_messages: (ChatPromptTemplate<InputValues, string> | BaseMessagePromptTemplateLike)[]
  tools: StructuredTool[]
  is_agent: boolean
  as_tool_description: string
}

export type OpenAIParams = Partial<OpenAIChatInput> & Partial<AzureOpenAIInput> & BaseLanguageModelParams
export type AnthropicParams = Partial<AnthropicInput> & BaseChatModelParams

export type OpenAIBinder = (gpt_opts?: OpenAIParams) => Promise<BoundNerd>
export type AnthropicBinder = (anthropic_opts?: AnthropicParams) => Promise<BoundNerd>
export type GeminiBinder = (gemini_opts?: GoogleGenerativeAIChatInput) => Promise<BoundNerd>

export type BindableNerd = UnboundNerd & {
  bind: (llm: BaseChatModel) => Promise<BoundNerd>
  with_openai: OpenAIBinder
  with_anthropic: AnthropicBinder
  with_gemini: GeminiBinder
}

export type BoundNerd = {
  invoke: (invocation_input: NerdInvocationInput) => Promise<RevisionSchema>
  as_tool: StructuredTool,
  as_agent: RunnableSequence,
  as_executor: AgentExecutor
}

export type NerdInvocationInput = {
  input: string
  additional_instructions?: string
}

export type ChatTemplateInput = (ChatPromptTemplate<InputValues, string> | BaseMessagePromptTemplateLike)[]