import { Runnable } from "langchain/runnables"
import { ModelPlatform, ModelType } from "../agent_specifiers/index.js"
import { BindableNerd } from "../prompts/index.js"
import { ChatOpenAI, OpenAI } from "@langchain/openai"
import { ChatAnthropic } from "@langchain/anthropic"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"

export type InvocableNerd<T> = BindableNerd & {
  invoke: (input: string, runtime_instructions: string) => Promise<T>,
  invoke_raw: (input: string, runtime_instructions: string) => Promise<string>
}

const default_gpt_opts = {
  model: "gpt-4-turbo",
  temperature: 0,
  response_format: {
    type: "json_object"
  }
}

const default_claude_opts = {
  model: "claude-3-opus-20240229",
  temperature: 0
}

const default_gemini_opts = {
  model: 'gemini-1.5-pro-latest',
  temperature: 0,
}

export class NerdBinder<OutputType> {
  constructor(public nerd: BindableNerd) { }

  getChatModel(platform: ModelPlatform, opts = null): Runnable {
    if (this.nerd.allowed_models.indexOf(platform) === -1) {
      throw new Error(`Model platform ${platform} not allowed for this agent`)
    }

    if (platform === ModelPlatform.OPEN_AI) {
      return this.nerd.preferred_model_type === ModelType.LLM ? new OpenAI(opts) : new ChatOpenAI(opts || default_gpt_opts)
    }

    if (platform === ModelPlatform.ANTHROPIC) {
      if (this.nerd.preferred_model_type === ModelType.LLM) {
        console.warn("Anthropic does not support the LLM model type, defaulting to their Chat model.")
      }
      new ChatAnthropic(opts || default_claude_opts)
    }

    if (platform === ModelPlatform.GEMINI) {
      if (this.nerd.preferred_model_type === ModelType.LLM) {
        console.warn("Anthropic does not support the LLM model type, defaulting to their Chat model.")
      }

      return new ChatGoogleGenerativeAI(opts || default_gemini_opts)
    }

    throw new Error(`Model platform ${platform} not supported`)
  }

  bindToModel(platform: ModelPlatform): InvocableNerd<OutputType> {
    const llm = this.getChatModel(platform)

    const invoke = async (input: string, runtime_instructions: string): Promise<OutputType> => {
      return this.nerd.parse(invoke_raw(input, runtime_instructions)) as OutputType;
    }
    const invoke_raw = async (input: string, runtime_instructions: string) => {
      return await llm.invoke({ input, runtime_instructions })
    }
    return {
      ...this.nerd,
      invoke,
      invoke_raw
    }
  }
}