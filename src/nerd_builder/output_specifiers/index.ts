export { revision_output_specifier } from './json/revisions.js'
export { summary_output_specifier, code_snippet_output_specifier } from './markdown/index.js'
export { MarkdownSchemaBuilder } from './markdown/index.js'
export { JsonSchemaBuilder } from './json/index.js'
import { BaseNerd } from '../types.js'

export type SpecifiedNerd<T extends OutputSpecifier, N extends BaseNerd> = N & {
  output_specifier: T
}

export type OutputSpecifier<T = string> = {
  output_format: "json" | "markdown"
  prompt_output_string: string,
  parse: (string) => T
}

export type NerdWithOutput = BaseNerd & OutputSpecifier

export class OutputDecorator {
  constructor(public output_specifier: OutputSpecifier) {
    this.output_specifier = output_specifier
  }

  decorate(nerd: BaseNerd): NerdWithOutput {
    return {
      ...nerd,
      ...this.output_specifier
    }
  }
}