import { BaseNerd } from "../types.js"

export enum AgentType {
  SimpleAgent = "SimpleAgent",
  ToolUsingAgent = "ToolUsingAgent",
  ReActToolUsingAgent = "ReActToolUsingAgent",
}

export enum ModelPlatform {
  OPEN_AI,
  ANTHROPIC,
  GEMINI
}

export enum ModelType {
  LLM,
  CHAT
}

export type NO_PROMPT_PATCH = ""

export type AgentSpecifier = {
  agent_type: AgentType,
  agent_specific_instructions?: string,
  preferred_model_type: ModelType,
  allowed_models: ModelPlatform[]
}

export type NerdWithAgent = BaseNerd & AgentSpecifier

export class AgentDecorator {
  constructor(public agent_specifier: AgentSpecifier) { }
  decorate(nerd: BaseNerd): NerdWithAgent {
    return {
      ...nerd,
      ...this.agent_specifier
    }
  }
}