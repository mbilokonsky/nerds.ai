import { StructuredTool } from "langchain/tools"
import { AgentSpecifier, AgentType, ModelType, ModelPlatform } from "../index.js"

export type ToolCallingAgentSpecifier = AgentSpecifier & {
  agent_type: AgentType.ToolCallingAgent,
  tools: StructuredTool[],
  allowed_models: [ModelPlatform.OPEN_AI, ModelPlatform.ANTHROPIC],
  preferred_model_type: ModelType.CHAT
}

const prompt_patch = `Please feel free to use the agent scratchpad to keep track of your thoughts and actions.

{agent_scratchpad}`

export const buildToolCallingAgentSpecifier = (
  tools: StructuredTool[]
): ToolCallingAgentSpecifier => {
  return {
    agent_type: AgentType.ToolCallingAgent,
    tools,
    agent_specific_instructions: prompt_patch,
    allowed_models: [ModelPlatform.OPEN_AI, ModelPlatform.ANTHROPIC],
    preferred_model_type: ModelType.CHAT
  }
}