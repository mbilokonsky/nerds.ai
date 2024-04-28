---
title: Output of CodeSnippetTunerNerd against 106-as-const-to-make-functions-infer-a-tuple.md
description: Generating proposed edits against a source text file using the CodeSnippetTunerNerd nerd. The source text is included, followed by edits generated by the same nerd against three different LLMs.
---

# Problem
In this exercise, we are dealing with an async function named `fetchData` that fetches data from a URL and returns a result.

If the fetch operation fails, this function returns a tuple. The first member of this tuple contains the error message and the second member is irrelevant in this case.

If the operation is successful, the function also returns a tuple. However, this time, the first member is `undefined` and the second member contains the fetched data.

Here's how the function is currently implemented:

```typescript
const fetchData = async () => {
  const result = await fetch("/");

  if (!result.ok) {
    return [new Error("Could not fetch data.")];
  }

  const data = await result.json();

  return [undefined, data];
};
```

Here's an async `example` function that uses `fetchData` and includes a couple of test cases:

```typescript
const example = async () => {
  const [error, data] = await fetchData();

  type Tests = [
    Expect<Equal<typeof error, Error | undefined>>, // red squiggly line under Equal<>
    Expect<Equal<typeof data, any>>,
  ];
};
```

Currently, both members of the tuple are inferred as `any`, which isn't ideal.


```typescript
const [error, data] = await fetchData();

// hovering over error and data shows:
const error: any
const data: any
```

## Challenge

Your challenge is to modify the `fetchData` function implementation so that TypeScript infers a Promise with a tuple for its return type.

Depending on whether or not the fetch operation is successful, the tuple should contain either an error message or a pair of `undefined` and the data fetched.

Hint: There are two possible approaches to solve this challenge. One way would be to define an explicit return type for the function. Alternatively, you could attempt to add or change type annotations for the `return` values within the function.

# Resolution
As mentioned, there are two different solutions to this challenge.

## Solution 1: Defining a Return Type

The first solution is to define a return type for the `fetchData` function.

Inside the `Promise` type, a tuple is defined with either `Error` or `undefined` as the first member, and an optional `any` as the second member:

```typescript
const fetchData = async (): Promise<[Error | undefined, any?]> => {
  ...
```

This technique works, but it's a little cumbersome.

## Solution 2: Using `as const`

Instead of specifying a return type, the second solution is to use `as const` on the return values:

```typescript
import { Equal, Expect } from "@total-typescript/helpers";

const fetchData = async () => {
  const result = await fetch("/");

  if (!result.ok) {
    return [new Error("Could not fetch data.")] as const; // added as const here
  }

  const data = await result.json();

  return [undefined, data] as const; // added as const here
};
```

With these changes in place, when we check the return type of `fetchData` in the `example` function, we can see that `error` is inferred as `Error | undefined`, and `data` is `any`:

```tsx
const example = async () => {
  const [error, data] = await fetchData();
  ...

// hovering over error shows:
const error: Error | undefined

// hovering over data shows:
const data: any
```

Using `as const` sets a variable is read-only, which assists TypeScript in accurately assigning the type of tuples.

In the case of this challenge, without `as const`, TypeScript could misinterpret the return value as `Promise<any[]>`. However, by using `as const`, TypeScript correctly observes the return value as a tuple (`Promise<[string | undefined, any]>`).

In summary, both techniques offer unique benefits. The first technique provides a straightforward approach to type definition, while the second leverages TypeScript's inference capabilities.

### Operation Results:
This operation generated results by running the CodeSnippetTunerNerd nerd against the source text using three different LLMs. The results are as follows:

#### GPT:
```typescript
{
  proposed_edits: [
    {
      existing_text: 'return [new Error("Could not fetch data.")];',
      proposed_replacement: 'return [new Error("Could not fetch data."), undefined];',
      reasoning: 'To maintain consistency in the structure of the returned tuple, both elements should be explicitly defined. This change ensures that the tuple always has two elements, aligning with the expected [Error | undefined, any?] structure.',
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
      existing_text: 'const fetchData = async () => {',
      proposed_replacement: 'const fetchData = async (): Promise<[Error | undefined, any]> => {',
      reasoning: 'Explicitly define the return type of the fetchData function as a Promise that resolves to a tuple. The tuple should have Error or undefined as the first element, and any as the second element. This makes the return type clear and avoids relying on type inference.',
      confidence: 0.9
    },
    {
      existing_text: 'return [new Error("Could not fetch data.")];',
      proposed_replacement: 'return [new Error("Could not fetch data."), undefined];',
      reasoning: 'When returning the error tuple, also include undefined as the second element. This keeps the tuple structure consistent with the success case and matches the defined return type.',
      confidence: 0.8
    },
    {
      existing_text: 'const example = async () => {',
      proposed_replacement: 'const example = async (): Promise<void> => {',
      reasoning: "Explicitly define the return type of the example function as Promise<void>, since it doesn't return a value. This improves type safety and clarity.",
      confidence: 0.7
    },
    {
      existing_text: '// red squiggly line under Equal<>',
      proposed_replacement: '',
      reasoning: "Remove this comment as it doesn't add value to the code. The red squiggly line should disappear after applying the suggested changes to fix the type errors.",
      confidence: 0.9
    }
  ]
}
```

#### Gemini:
```typescript
{
  proposed_edits: [
    {
      existing_text: 'type Tests = [\n' +
        '    Expect<Equal<typeof error, Error | undefined>>, // red squiggly line under Equal<>\n' +
        '    Expect<Equal<typeof data, any>>,\n' +
        '  ];',
      proposed_replacement: '// type Tests = [\n' +
        '//     Expect<Equal<typeof error, Error | undefined>>,\n' +
        '//     Expect<Equal<typeof data, any>>,\n' +
        '//   ];',
      reasoning: 'The code snippet is demonstrating the issue with type inference, but the test cases themselves are not relevant to the solution and could be confusing to the reader. Commenting them out would improve clarity.',
      confidence: 0.9
    }
  ]
}
```