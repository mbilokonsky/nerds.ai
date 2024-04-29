# Nerd Demos
This directory holds sample output from a few test Nerds. Currently CitationFinder isn't here because I'm still working on tweaking the ability for nerds to use Tools - it adds a layer of complication because not every model I'm using has the ability to use tools, and because different models have slightly different configuration needs. That's in-flight in an uncommitted branch, it'll be ready soon I just need to harden it.

For these demos I've taken Egghead documents and executed four different nerds against each document. The nerds run against all three LLMs I'm working with (OpenAI's gpt-4-turbo, Anthropic's opus and Google's gemini-1.5. Each nerd is run, and the output of the various nerds are appended at the end of the document. I'm finding that certain nerds perform better against certain models, so when this is final and ready for 1.0 each nerd is going to specify a `preferredModel` and we'll go from there.

## Work History
Initially I wanted to spin up a web server to render a markdown file and have edits superimposed via some nice UI. However, building out my prototypes in .mjs files meant I didn't have a clean way to package this up. I initially attempted to simply add an express server, and because I'm not using a build system in the `lfg` repo yet I figured I'd just use native express and pug. This was a mistake, because that's no way to build a front-end.

So I started over and set up a new local repo that's configured to build a typescript library for this stuff. In my first pass adding types I leaned too heavily on inheritance over composition and while I got things working it was a nightmare to work with.

The current iteration that I'm working on is in the middle of a refactor to address that problem, but is not quite done and is still a bit finicky so bear with me, I'll have that code ready soon. Ideally when it's time to pull this into CourseBuilder you'll be able to simply `npm install nerds-ai` and then you'll be able to build and use these things with minimal fuss. The documentation below includes nerd definitions in the format that I'm currently using, it still needs work but should showcase just how easy and flexible this is to play with.

## The Demos
For these demos I've run the nerds against 11 documents that I received from Taylor. Most of these documents originally came in the form of "problem.md" and "solution.md", but I took the liberty of merging each lesson into a single document for what I hope will be better output.

### Typo Nerd
This nerd has two different runs to compare/contrast. The [first run](./TypoNerd/1714342765671) was generated using the original language of the nerd that you've seen before. The [second](./TypoNerd/1714346968250) has been slightly tuned to be respectful of technical documentation, and hopefully the output is improved. Note that each model has slightly different opinions, but they often converge on the same typos, so I think this is promising.

The nerd definition is as follows. Note I accidentally lost my changes via a frustrating git mistake that made it more technical-document capable, but it was just a careful sentence or two of additional instructions and I'll add it again soon.
```
import { AgentType, NerdBuilder, revision_output_specifier } from "../nerd_builder/index.js"

const typo_nerd_builder: NerdBuilder<typeof revision_output_specifier, AgentType.SimpleAgent> = new NerdBuilder({
  name: "TypoNerd",
  purpose: "You are a document editing assistant who proposes corrections to typos and similar small mechanical errors in a given text.",
  do_list: [
    "seek to identify mispellings",
    "flag missing words",
    "evaluate individual characters in context. for instance, a '#' character may be a markdown header on its own, or it may be part of a subheader like '###' - respect the difference, please.",
    "ensure consistency across acronyms and domain specific vocabulary",
    "ensure that punctuation is correct, but note guidance on confidence below.",
    "double check the entire text of the document from top to bottom - we are counting on you not to skip any part of it",
    "return an empty array if no edits are propsed."
  ],
  do_not_list: [
    `enforce any sort of "proper english" or other "standard" - the author may be intentionally using informal slang, for instance, and your job is to support them in their choice to do so.`,
    `propose semantic changes, unless there's obviously a missing "not" something in that vein where the author clearly intends something else.`,
    `duplicate any proposed edits. Once an objection has been found, note it once and move on.`,
    `return empty objects in the output array. If you have found no typos, return an empty array.`,
    `repeat the same proposed edit more than once, or repeat any edits that have already been rejected.`
  ],
  output_specifier: revision_output_specifier,
  as_tool_description: "This tool proposes corrections to typos and similar small mechanical errors in a given text.",
  agent_type: AgentType.SimpleAgent
})

export const TypoNerd = {
  name: 'TypoNerd',
  with_openai: await typo_nerd_builder.bind_to_gpt(),
  with_anthropic: await typo_nerd_builder.bind_to_anthropic(),
  with_gemini: await typo_nerd_builder.bind_to_gemini()
}
```

### AccessibleLanguageNerd
This nerd replaces the EditStyle nerd I had before, which was `delving` a bit too much for my tastes. Rather than asking it to "improve" the style and flow I've instead got it focused on streamlining language for accessibility specifically. You can find the [output here](./AccessibleLanguageNerd/1714343725113) and judge for yourself how it did.

The nerd definition is as follows:
```
import { AgentType, NerdBuilder, revision_output_specifier } from "../nerd_builder/index.js"

const accessible_language_nerd_builder: NerdBuilder<typeof revision_output_specifier, AgentType.SimpleAgent> = new NerdBuilder({
  name: "AccessibleLanguageNerd",
  purpose: "You are a document editing assistant who proposes revisions to a text that will make it more accessible.",
  do_list: [
    "seek to make the text more readable and understandable",
    "identify awkward wording",
    "flag overly complex sentences",
    "respect the complexity of the domain material while presenting in a more accessible way",
  ],
  do_not_list: [
    "change the meaning of the text",
    "propose edits that would make the text less accurate",
    "propose edits that would make the text less precise",
  ],
  additional_notes: "It's okay if your edit increases verbosity as long as the resulting language is clearer and more accessible.",
  output_specifier: revision_output_specifier,
  as_tool_description: "This tool proposes revisions that reduce the legibility and accessibility of a given text.",
  agent_type: AgentType.SimpleAgent
})

export const AccessibleLanguageNerd = {
  name: 'AccessibleLanguageNerd',
  with_openai: await accessible_language_nerd_builder.bind_to_gpt(),
  with_anthropic: await accessible_language_nerd_builder.bind_to_anthropic(),
  with_gemini: await accessible_language_nerd_builder.bind_to_gemini()
}
```

### CodeSnippetTunerNerd
This nerd is intended to tweak code snippets. It's walking a fine line because initially it was "fixing" snippets in the "Problem" part of the document, so I've tried to mitigate that. The real problem with it is not the things it's finding but the way code snippets are proving a bit harder to select snippets from via text matching. Many of the fixes it proposes are offering multiline strings that I'm not sure we'll be able to automatically find and merge - so I suspect when we invoke this we'll want to do so against one snippet at a time, and provide context in the invocation to guide it. So you might select a snippet, hit a keyboard shortcut and get a textbox asking you for additional context, where you might say "this snippet is SUPPOSED to be broken in X way, do not fix X, but please do provide an alternative snippet if you can find a way to improve it while leaving it 'broken'", etc.

```
import { AgentType, NerdBuilder, revision_output_specifier } from "../nerd_builder/index.js"

const code_snippet_tuner_nerd_builder: NerdBuilder<typeof revision_output_specifier, AgentType.SimpleAgent> = new NerdBuilder({
  name: "CodeSnippetTunerNerd",
  purpose: "You are a document editing assistant who edits technical documentation that has code snippets in it. Your job is to identify areas where those snippets could be improved for correctness, idiom and understanding.",
  do_list: [
    "focus exclusively on code snippets that are wrapped within a markdown codefence, like ```python ... ```",
    "ensure code snippets in the text are correct and idiomatic",
    "ensure variable names are consistent and meaningful",
    "ensure the code snippets demonstrates what the text is using it to demonstrate",
    "add comments to any code snippets whose clarity is in question",
    "respect the context!",
  ],
  do_not_list: [
    "change the fundamental behavior of the code",
    "make any assumptions beyond what is in the text of the technical documentation",
    "propose edits that target any text outside of a code fence",
  ],
  additional_notes: "**important** sometimes in technical documentation a code snippet is presented as intentionally incorrect to demonstrate a point. These may be resolved in subsequent snippets, or may simply be illustrative of a point addressed in the text. When you identify such a snippet, DO NOT propose 'corrections' - fixing an example of bad code is actually ruining the snippet and keeping it from serving its intended function.", output_specifier: revision_output_specifier,
  as_tool_description: "This tool proposes revisions that seek to improve the quality of codefenced code-snippets in markdown technical documentation.",
  agent_type: AgentType.SimpleAgent
})

export const CodeSnippetTunerNerd = {
  name: 'CodeSnippetTunerNerd',
  with_openai: await code_snippet_tuner_nerd_builder.bind_to_gpt(),
  with_anthropic: await code_snippet_tuner_nerd_builder.bind_to_anthropic(),
  with_gemini: await code_snippet_tuner_nerd_builder.bind_to_gemini()
}
```

### PersonalityNerd
This one is more for fun, and to see how far I can push this. It's tasked with taking a source text and a description, example or reference to some character or personality. Its role is to propose edits that make the document feel as if it had been written by that personality. I ran our sample docs against this using Spike from Buffy the Vampire Slayer as the personality model, and honestly the results were delightful.

Here's the configuration:
```
import { AgentType, NerdBuilder, revision_output_specifier } from "../nerd_builder/index.js"

const personality_nerd_builder: NerdBuilder<typeof revision_output_specifier, AgentType.SimpleAgent> = new NerdBuilder({
  name: "PersonalityNerd",
  purpose: "You are a document editing assistant, or nerd, who proposes stylistic edits to make the document express the personality presented.",
  do_list: [
    "focus on changes that make the document more consistent with the personality presented",
    "try to make sure the edits are subtle and in line with the existing tone. For instance, if you're presented with a technical document and a wacky character personality, try to generate output as if that character was tasked with writing technical documentation.",
    "focus on the highest-value edits that will have the most impact on the personality of the document",
  ],
  do_not_list: [
    "change the underlying semantics of the text",
    "make any assumptions beyond what is in the text of the technical documentation",
    "propose edits that target any text outside of a code fence",
  ],
  additional_notes: "If the user forgets to provide additional input specifying a personality, please take on the personality of Deadpool and use one of your edits to remind them to provide the necessary information via a trademark fourth-wall violation that addresses the user of this nerd.",
  output_specifier: revision_output_specifier,
  as_tool_description: "This tool proposes revisions that seek to add specified flavor and personality to the text. Use the optional `additional_instructions` to specify your personality with either a set of instructions, an example or a reference to a model character from a book or movie.",
  agent_type: AgentType.SimpleAgent
})

export const PersonalityNerd = {
  name: 'PersonalityNerd',
  with_openai: await personality_nerd_builder.bind_to_gpt(),
  with_anthropic: await personality_nerd_builder.bind_to_anthropic(),
  with_gemini: await personality_nerd_builder.bind_to_gemini()
}
```

## Next Steps

### Finish Refactor
I'm currently working on finishing my refactor to composition-over-inheritance, which is going to help me create optimized flows based on your specified output format (json, with a scehma and a type, or markdown, to start), your bound llm, and whether or not you're using tools. If you're interested, the matrix looks something like this:

#### Output Format
Right now this is either json or markdown. If you're providing json you need to provide a schema both as text (injected into the prompt) and as a type (used to cast the parsed output into that type), and they have to match. There _must_ be a way to do this by just providing a type, and having some runtime or precompile magic fire that extracts the text schema from the type - I looked a bit but didn't like anything I found, I'ma do a deeper dive as a part of this operation.

This way the `.invoke` method returns either a markdown string or a typed object that conforms to the schema.

#### Bound LLM
This is a sort of two-fold problem. The first is specifying which platform you're binding to - OpenAI, Anthropic, Google, etc - and which model you're using. The second is determining whether to ask LangChain to treat it as a chat model or an instruction model - there are various flavors here to consider. This gets tricky because the way LangChain works it exposes tool use via an abstraction over most models (but not all - gemini can't use tools yet!), but sometimes it's better to e.g. use a Chat model without tools but switch to the Instruction model with tools, or whatever, etc. You gotta look at the intersection of model and tool usage. I'm trying to get this fully captured via types.

#### Tool Use
Nerds can use tools! Sometimes, like with the CitationNerd, we may want to give a nerd the ability to search google, or to do math, or to write to a database. All of that's trivial by writing a function, wrapping it in a DynamicStructuredTool class and passing it in as an argument. However, if you do this it has implications on which models are safe to use and which interface to that model you should hit.

### Tune Nerds Based On Feedback
I'd like to ask y'all to take a look at this output and let me know what if anything feels useful. Are any of these just garbage, no value? Are any of them a mixed bag? What's it mixed with and how can we tune the prompt to address that?

### New Nerds (And Kinds Of Nerds)
Since we have access to Gemini we really are free to go wild with the context window. I want to write a Q&A nerd where we paste in an entire body of work (e.g. Total Typescript) and then let users chat with the nerd to get answers back that reference specific places in the source text. Move over RAG, we don't need to inject slices of context anymore we can use RAG to inject whole textbooks, etc.

We can also play around with Markdown nerds that, instead of proposing individual revisions as they're currently doing, simply rewrite a document and return a replacement. I suspect certain kinds of operations would benefit from that, but it's less fine-grained than giving a human editor a set of reivisions to +/-.

Finally, we might also consider exploring using Gemini to generate article text automagically and let Taylor just edit rather than write. We'd do this by giving it an example transcript followed by example final output from previously completed work. We'd tell it to use the same style and take the same liberties to convert the transcript text into article text.
