import { StructuredToolInterface } from "@langchain/core/tools"
import { AgentSpecifier, AgentType, ModelType } from "../index.js"

export type ToolCallingAgentSpecifier = AgentSpecifier & {
  agent_type: AgentType.ToolCallingAgent,
  tools: StructuredToolInterface[],
  preferred_model_type: ModelType.CHAT
}

export const buildToolCallingAgentSpecifier = (
  tools: StructuredToolInterface[]
): ToolCallingAgentSpecifier => {

  console.log("WE HAVE A TOOL CALLING AGENT!")

  return {
    agent_type: AgentType.ToolCallingAgent,
    tools,
    allowed_platforms: ["OPEN_AI", "ANTHROPIC"],
    preferred_model_type: ModelType.CHAT
  }
}