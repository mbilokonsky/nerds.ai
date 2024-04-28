import * as RevisionJsonFormat from './output_formats/revisions.js'
import * as SummaryFormat from './output_formats/summary.js'
import * as CodeFormat from './output_formats/code_snippets.js'

export type OutputSpecifier<T = any> = {
  format: "json" | "markdown"
  asString: string,
  parse: (string) => T
}

export type MarkdownSpecifier = OutputSpecifier<string> & {
  format: "markdown"
}

export type JsonSpecifier<T> = OutputSpecifier<T> & {
  format: "json"
}

export class MarkdownSchemaBuilder {
  constructor(public string_representation: string) { }
  build(): MarkdownSpecifier {
    return {
      format: "markdown",
      asString: `Please return your output as a Markdown document according to the instructions below.
    
${this.string_representation}`,
      parse: (string) => string
    }
  }
}

export class JsonSchemaBuilder<T> {
  constructor(public string_representation: string) { }
  build(): JsonSpecifier<T> {
    return {
      format: "json",
      asString: `Please return your output in compliance with the JSON schema below. 
DO NOT wrap the output in any kind of text or even any kind of code fence, it is essential that you return valid JSON that is machine parsable.
The first character of your output MUST be '{{' and the last character MUST be '}}'.

Output Schema:
${this.string_representation}`,
      parse: (json) => {
        try {
          return JSON.parse(json) as T
        } catch (e) {
          console.log("Unable to parse JSON!")
          console.error(e)
          throw e
        }
      }
    }
  }
}

export const revision_output_specifier: JsonSpecifier<RevisionJsonFormat.AsType> = new JsonSchemaBuilder<RevisionJsonFormat.AsType>(RevisionJsonFormat.as_string).build()
export const summary_output_specifier: MarkdownSpecifier = new MarkdownSchemaBuilder(SummaryFormat.as_string).build()
export const code_output_specifier: MarkdownSpecifier = new MarkdownSchemaBuilder(CodeFormat.as_string).build()