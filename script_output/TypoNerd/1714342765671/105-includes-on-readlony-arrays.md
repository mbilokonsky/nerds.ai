## Output of TypoNerd against 105-includes-on-readlony-arrays.md
  
  ### Source Text
  ---
title: Use the ts-reset Library to Improve Readonly Array Handling in TypeScript
description: Total TypeScript's ts-reset library features tools to improve the experience of working with readonly arrays and other common TypeScript types.
---

Working with read-only arrays in TypeScript can be slightly annoying, especially when you're working with the `includes` and `indexOf` methods.

Take a simple read-only users array declared with `as const`:

```typescript
const users = ["matt", "sofia", "waqas"] as const;
```

A common operation could be to check whether a certain string matches one of the known values in this array. However, trying to use `includes` or `indexOf` to validate a name against our array will result in an error:

```typescript
users.includes("bryan"); // red squiggly line under bryan
users.indexOf("bryan"); // red squiggly line under bryan
```

This is because TypeScript considers `"bryan"` as not a member of the array.

```typescript
// Hovering over bryan shows:
Argument of type '"bryan"' is not assignable to parameter of type '"matt" | "sofia" | "waqas"'
```

While this specific typing adds predictability for TypeScript, it can be limiting and annoying when compared to behavior you're used to in JavaScript.

## Introducing `ts-reset`

To address this, Total TypeScript's `ts-reset` library can help:

```typescript
import "@total-typescript/ts-reset";
```

This library globally adjusts some of TypeScript's types, including updating arrays to accept any string when using `includes` and `indexOf`:

```typescript
users.includes("bryan"); // No error when `ts-reset` is imported
```

Total TypeScript's `ts-reset` library offers a way of balancing between the strictness and flexibility that TypeScript provides.

While some developers might prefer TypeScript's stricter approach, if you ever find read-only arrays troublesome, this library is a useful addition to your toolkit to make the TypeScript experience smoother.
  
  ### Operation Results:
  This operation generated results by running the TypoNerd nerd against the source text using three different LLMs. The results are as follows:

  #### GPT:
  ```typescript
  {
  proposed_edits: [
    {
      existing_text: 'read-only arrays',
      proposed_replacement: 'readonly arrays',
      reasoning: "To maintain consistency with the term 'readonly' as used elsewhere in the document.",
      confidence: 0.9
    }
  ]
}
  ```

  #### Anthropic:
  ```typescript
  {
  proposed_edits: [
    {
      existing_text: 'read-only',
      proposed_replacement: 'readonly',
      reasoning: "In TypeScript, the correct term is 'readonly' without a hyphen.",
      confidence: 0.9
    },
    {
      existing_text: "Total TypeScript's `ts-reset` library offers a way of balancing between the strictness and flexibility that TypeScript provides.",
      proposed_replacement: "Total TypeScript's `ts-reset` library offers a way of balancing the strictness and flexibility that TypeScript provides.",
      reasoning: "The phrase 'balancing between' is slightly awkward. Removing 'between' improves the sentence flow.",
      confidence: 0.8
    }
  ]
}
  ```

  #### Gemini:
  ```typescript
  {
  proposed_edits: [
    {
      existing_text: 'read-only',
      proposed_replacement: 'readonly',
      reasoning: 'While both "read-only" and "readonly" are acceptable spellings, "readonly" is the preferred and more common usage in technical contexts, especially within the TypeScript ecosystem.',
      confidence: 0.8
    }
  ]
}
  ```