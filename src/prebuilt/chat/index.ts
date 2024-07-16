import { Nerd } from "../../nerd.js"
import { BaseNerdOptions } from "../../internals/types.js"
import { NerdOutput } from "../../internals/parsers/index.js"
import { JsonNerdOutputParser } from "../../internals/parsers/json/index.js"

const schema = `{
  // the "thought_log" array is for tracking your own thoughts as you carry out your task.
  // Please log your process and observations here as you go, ensuring to keep your thoughts in order.
  // Use these thoughts as you complete your task to help you stay focused.
  // Note that the "thought_log" here is for out-of-character meta strategizing, and is distinct from your "thoughts" below which are in-character.
  "thought_log": string[],

  // your in-character reaction to user or environmental trigger may contain any combination (but at least one of) the following things:
  "reaction": {
    // what is your goal in response to the trigger? This should be informed by and congruent with your overall goals in this interaction.
    "goal": string,

    // what do you privately think about the trigger? This is in character, distinct from your thought log which is out of character.
    "thinks": string, 

    // how do you feel in response to the trigger? this is a qualitative response, you will optionally provide a quantitative component next.
    "feels": string | undefined,

    // only use this key if you have access to a simulated environment to "act" in. what do you do in response to the trigger?
    "does": string | undefined,

    // finally, what do you say in response to the trigger?
    "says": string,

    // given your input emotional state, how are each of these emotions affected by the trigger? 
    // Provide a delta, either positive or negative, for each emotion impacted by the trigger. Not all triggers will impact all (or any?) emotions.
    // Assume each emotion is normalized between 0-1, your delta may not raise the value above 1 or reduce it below 0.
    // leave this out if no emotional state was provided in your input.
    // The delta here should be considered the quantitative representation of the qualitative "feels" above.
    "emotional_delta": {
      "anger": number,
      "fear": number,
      "sadness": number,
      "disgust": number,
      "surprise": number,
      "trust": number,
      "anticipation": number,
      "joy": number,
      "positive": number,
      "negative": number
    } | undefined
  }
}`

export type EmotionalState = {
  anger: number,
  fear: number,
  sadness: number,
  disgust: number,
  surprise: number,
  trust: number,
  anticipation: number,
  joy: number,
  positive: number,
  negative: number
}

export type ChatResponse = NerdOutput & {
  reaction: {
    emotional_delta: EmotionalState,
    goal: string,
    thinks: string,
    feels?: string,
    does?: string,
    says: string,
  }
}

export type EnvironmentalTrigger = {
  your_emotional_state?: EmotionalState, // the bot's emotional state at the time of the trigger
  you_hear: string, // when a user "speaks" it is an environmental trigger where the bot "hears" what they say.

  // additional sensory inputs are for environmental simulation
  you_see?: string,
  you_smell?: string,
  you_taste?: string,
  you_touch?: string,

  // this will generally be reserved for RAG flows, the user won't manually provide this.
  you_remember?: string
}

export const chat_response_parser: JsonNerdOutputParser<ChatResponse> = new JsonNerdOutputParser<ChatResponse>(schema)
export class ChatNerd extends Nerd<EnvironmentalTrigger, ChatResponse> {
  constructor(nerd_opts: BaseNerdOptions, parser: JsonNerdOutputParser<ChatResponse> = chat_response_parser) {
    if (!nerd_opts.input_preprocessors) {
      nerd_opts.input_preprocessors = []
    }


    super(nerd_opts, parser)
  }

}