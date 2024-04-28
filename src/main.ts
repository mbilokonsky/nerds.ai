import 'dotenv/config'
import { typo_nerds } from './prebuilt/index.js'
import { source_text } from './sample_input_one.js'
import { inspect } from 'util'


console.log("Now fixing typos against the same source text using three different models.")

console.log("Running against OpenAI:")
const openai_output = await typo_nerds.with_openai.invoke({ input: source_text })
console.log("OpenAI output:")
console.log(inspect(openai_output, false, 5, true))

console.log("Running against Anthropic:")
const anthropic_output = await typo_nerds.with_anthropic.invoke({ input: source_text })
console.log("Anthropic output:")
console.log(inspect(anthropic_output, false, 5, true))

console.log("Running against Gemini:")
const gemini_output = await typo_nerds.with_gemini.invoke({ input: source_text })
console.log("Gemini output:")
console.log(inspect(gemini_output, false, 5, true))


