---
title: Output of CodeSnippetTunerNerd against 107-as-const-can-make-strings-infer-as-their-literals-in-objects.md
description: Generating proposed edits against a source text file using the CodeSnippetTunerNerd nerd. The source text is included, followed by edits generated by the same nerd against three different LLMs.
---

There's another interesting feature of `as const`, which we'll see in this example.

The `modifyButton` function accepts an `attributes` object typed as `ButtonAttributes`, which has `type` values of "button," "submit," or "reset".


```typescript
type ButtonAttributes = {
  type: "button" | "submit" | "reset";
};

const modifyButton = (attributes: ButtonAttributes) => {};
```

In this example, the `buttonAttributes` object only defines `type` as "button," which causes an error when passing it into the `modifyButton` function:

```tsx
const buttonAttributes = {
  type: "button";
};

modifyButton(buttonAttributes); // red squiggly line under buttonAttributes
```

As we've seen, we can fix this by adding `as const` to the `buttonAttributes` object, which makes the entire object read-only:

```typescript
const buttonAttributes = {
  type: "button";
} as const;

// Hovering over buttonAttributes shows:
const buttonAttributes: {
  readonly type: "button";
}
```

We can also apply `as const` to just `type` property:

```typescript
const buttonAttributes = {
  type: "button" as const;
};
```

However, this time the `type` property here is not read-only, but it's inferred as its literal type:

```typescript
// Hovering over buttonAttributes shows:
const buttonAttributes: {
  type: "button";
}
```

Building on this, we could also ensure the literal type inference for various properties in an array of objects by adding `as const` after each `type` property:

```typescript
const modifyButtons = (attributes: ButtonAttributes[]) => {};

const buttonsToChange = [
  {
    type: "button" as const,
  },
  {
    type: "submit" as const,
  },
];
```

Even with `as const` applied, we're still able to modify the `type` property but only to be one of the allowed literal types:

```typescript
buttonAttributes.type = "button";
```

This property makes `as const` a handy tool to be used whenever you want to ensure a specific literal is inferred for an object you're working with.


### Operation Results:
This operation generated results by running the CodeSnippetTunerNerd nerd against the source text using three different LLMs. The results are as follows:

#### GPT:
```typescript
{
  proposed_edits: [
    {
      existing_text: 'type: "button";',
      proposed_replacement: 'type: "button",',
      reasoning: 'In TypeScript object literals, properties should be separated by commas, not semicolons. This change corrects the syntax error.',
      confidence: 1
    },
    {
      existing_text: 'buttonAttributes.type = "button";',
      proposed_replacement: '',
      reasoning: 'This line of code is incorrect because it attempts to modify a property that has been declared as read-only due to the use of `as const`. Removing it avoids confusion and maintains the integrity of the example.',
      confidence: 1
    }
  ]
}
```

#### Anthropic:
```typescript
{
  proposed_edits: [
    {
      existing_text: 'const buttonAttributes = {\n  type: "button";\n};',
      proposed_replacement: 'const buttonAttributes = {\n  type: "button"\n};',
      reasoning: "The semicolon after the 'type' property is incorrect syntax in an object literal. It should be removed.",
      confidence: 1
    },
    {
      existing_text: 'const buttonAttributes = {\n  type: "button";\n} as const;',
      proposed_replacement: 'const buttonAttributes = {\n  type: "button"\n} as const;',
      reasoning: "The semicolon after the 'type' property is incorrect syntax in an object literal. It should be removed.",
      confidence: 1
    },
    {
      existing_text: 'const buttonAttributes = {\n  type: "button" as const;\n};',
      proposed_replacement: 'const buttonAttributes = {\n  type: "button" as const\n};',
      reasoning: "The semicolon after the 'as const' is incorrect syntax in an object literal. It should be removed.",
      confidence: 1
    },
    {
      existing_text: 'const buttonsToChange = [\n' +
        '  {\n' +
        '    type: "button" as const,\n' +
        '  },\n' +
        '  {\n' +
        '    type: "submit" as const,\n' +
        '  },\n' +
        '];',
      proposed_replacement: 'const buttonsToChange = [\n' +
        '  {\n' +
        '    type: "button" as const\n' +
        '  },\n' +
        '  {\n' +
        '    type: "submit" as const\n' +
        '  }\n' +
        '];',
      reasoning: "The commas after the 'as const' in each object literal are incorrect syntax. They should be removed.",
      confidence: 1
    }
  ]
}
```

#### Gemini:
```typescript
{
  proposed_edits: [
    {
      existing_text: 'const modifyButtons = (attributes: ButtonAttributes[]) => {};',
      proposed_replacement: 'const modifyButtons = (attributes: readonly ButtonAttributes[]) => {};',
      reasoning: 'Since the purpose of `as const` is to ensure the literal types of the objects in the array, it would be more appropriate to make the `attributes` parameter in `modifyButtons` a readonly array to prevent unintended modifications within the function.',
      confidence: 0.8
    }
  ]
}
```