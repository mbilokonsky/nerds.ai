import 'dotenv/config'
import { PersonalityNerd } from '../build/src/prebuilt/index.js'
import { run_against_egghead_files } from './_runner.mjs'

const main = async () => {
  await run_against_egghead_files(PersonalityNerd, "The personality I'd like you to use is that of Spike from Buffy the Vampire Slayer. Add a little bit of snark and a lot of wit. This will be a challenging task because this is technical documentation, but I think you can do it. Don't go overboard and focus on getting particularly 'spikey' in ways that'll delight the reader by catching them by surprise.")
}

main()

