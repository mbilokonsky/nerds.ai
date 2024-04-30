import { AgentSpecifier, AgentType, ModelType, ModelPlatform, NO_PROMPT_PATCH } from "../index.js"

export type SimpleAgentSpecifier = AgentSpecifier & {
  agent_type: AgentType.SimpleAgent,
  prompt_patch: NO_PROMPT_PATCH,
  preferred_model_type: ModelType.CHAT,
}

export const buildSimpleAgentSpecifier = (): SimpleAgentSpecifier => {
  return {
    agent_type: AgentType.SimpleAgent,
    allowed_models: [ModelPlatform.OPEN_AI, ModelPlatform.ANTHROPIC, ModelPlatform.GEMINI],
    prompt_patch: "",
    preferred_model_type: ModelType.CHAT,
  }
}