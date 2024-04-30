import { AnthropicInput, ChatAnthropic } from "@langchain/anthropic"
import { BaseMessagePromptTemplateLike } from "@langchain/core/prompts"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { AgentExecutor } from "langchain/agents"
import { BaseLanguageModelParams } from "langchain/base_language"
import { BaseChatModelParams } from "langchain/chat_models/base"
import { AzureOpenAIInput, ChatOpenAI, OpenAIChatInput } from "langchain/chat_models/openai"
import { ChatPromptTemplate } from "langchain/prompts"
import { RunnableSequence } from "langchain/runnables"
import { InputValues } from "langchain/schema"
import { StructuredTool } from "langchain/tools"
import { NerdWithOutput, OutputSpecifier } from "./output_specifiers/index.js"
import { AgentType, NerdWithAgent } from "./agent_specifiers/index.js"

export type Options<O extends OutputSpecifier> = SimpleNerdOptions<O> | ToolUsingNerdOptions<O> | ReActToolUsingNerdOptions<O>
export type Nerd<O extends OutputSpecifier> = UnboundSimpleNerd<O> | UnboundToolUsingNerd<O> | UnboundReActToolUsingNerd<O>

export type PreConfiguredNerd = NerdWithAgent & NerdWithOutput

export type BaseNerd = {
  name: string
  purpose: string
  do_list: string[]
  do_not_list: string[]
  as_tool_description: string
  additional_notes?: string
}

export type BaseNerdOptions<O extends OutputSpecifier, A extends AgentType> = {
  name: string
  purpose: string
  do_list: string[]
  do_not_list: string[]
  output_specifier: O,
  as_tool_description: string
  additional_notes?: string
  agent_type: A
}

export type SimpleNerdOptions<O extends OutputSpecifier> = BaseNerdOptions<O, AgentType.SimpleAgent>

export type ToolUsingNerdOptions<O extends OutputSpecifier> = BaseNerdOptions<O, AgentType.ToolUsingAgent> & {
  tools: StructuredTool[]
}

export type ReActToolUsingNerdOptions<O extends OutputSpecifier> = BaseNerdOptions<O, AgentType.ReActToolUsingAgent> & {
  tools: StructuredTool[]
}

export type BaseUnboundNerd<O extends OutputSpecifier, A extends AgentType> = {
  name: string,
  system_message: string,
  prompt_messages: (ChatPromptTemplate<InputValues, string> | BaseMessagePromptTemplateLike)[]
  as_tool_description: string
  output_specifier: O
  agent_type: A
}

export type UnboundSimpleNerd<O extends OutputSpecifier> = BaseUnboundNerd<O, AgentType.SimpleAgent> & {
  config: SimpleNerdOptions<O>
}

export type UnboundToolUsingNerd<O extends OutputSpecifier> = BaseUnboundNerd<O, AgentType.ToolUsingAgent> & {
  tools: StructuredTool[]
  config: ToolUsingNerdOptions<O>
}

export type UnboundReActToolUsingNerd<O extends OutputSpecifier> = BaseUnboundNerd<O, AgentType.ReActToolUsingAgent> & {
  tools: StructuredTool[]
  config: ReActToolUsingNerdOptions<O>
}



export type OpenAIParams = Partial<OpenAIChatInput> & Partial<AzureOpenAIInput> & BaseLanguageModelParams
export type AnthropicParams = Partial<AnthropicInput> & BaseChatModelParams

export type BoundNerd<O extends OutputSpecifier, A extends AgentType> = {
  invoke: (invocation_input: NerdInvocationInput) => Promise<BaseUnboundNerd<O, A>>
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