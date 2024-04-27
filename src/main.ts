import 'dotenv/config'
import { typo_nerd } from './nerds/index.js'
import { source_text } from './sample_input_one.js'
import { inspect } from 'util'


console.log("Now fixing typos against the same source text using three different models.")

const openai_typo_nerd = await typo_nerd.with_openai()
const anthropic_typo_nerd = await typo_nerd.with_anthropic()
const gemini_typo_nerd = await typo_nerd.with_gemini()

console.log("Running against OpenAI:")
const openai_output = await openai_typo_nerd.invoke({ input: source_text })
console.log("OpenAI output:")
console.log(inspect(openai_output, false, 5, true))

console.log("Running against Anthropic:")
const anthropic_output = await anthropic_typo_nerd.invoke({ input: source_text })
console.log("Anthropic output:")
console.log(inspect(anthropic_output, false, 5, true))

console.log("Running against Gemini:")
const gemini_output = await gemini_typo_nerd.invoke({ input: source_text })
console.log("Gemini output:")
console.log(inspect(gemini_output, false, 5, true))


