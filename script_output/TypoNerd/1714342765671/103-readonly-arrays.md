## Output of TypoNerd against 103-readonly-arrays.md
  
  ### Source Text
  # Problem
In this exercise, you'll be dealing with a function called `printNames`. This function accepts an array of `names` and prints each name to the console.

However, we want to add a special restriction to this function: it shouldn't be possible to mutate the array it receives. In other words, operations such as adding or changing an element in the array shouldn't be allowed:

```typescript
function printNames(names: string[]) {
  for (const name of names) {
    console.log(name);
  }

  // @ts-expect-error // red squiggly line
  names.push("John");

  // @ts-expect-error // red squiggly line
  names[0] = "Billy";
}
```

However, in the current implementation the `@ts-expect-error` directives show us that it's possible to mutate the array.

## Challenge

Your task is to determine what type should be assigned to the `names` parameter to ensure that the array cannot be mutated. There are two ways to solve this problem.

# Resolution
There are a couple of strategies for handling read-only arrays in TypeScript. Both are functionally identical, and your choice of which to use will ultimately come down to personal preference.

## Solution 1: Add the `readonly` Keyword

The first approach solution is to add the `readonly` keyword before the `string[]` array. It applies to the entire `string[]` array, converting it into a read-only array:

```typescript
function printNames(names: readonly string[]) {
  ...
}
```

With this setup, you can't call `.push()` or modify elements in the array. However, methods like `map()` and `reduce()` remain accessible since these create a copy of the array, and do not mutate the original.

## Solution 2: Use the `ReadonlyArray` Type Helper

Alternatively, TypeScript offers a type helper called `ReadonlyArray` that functions in the same way:

```typescript
function printNames(names: ReadonlyArray<string>) {
  ...
}
```

Regardless of which of these two methods you use, TypeScript will still display `readonly string[]` when hovering over the `names` parameter:

```typescript
// hovering over `names` shows:
(parameter) names: readonly string[]
```

No matter which syntax you prefer, both approaches are functionally identical. If you feel the need to choose one, it might be better to choose the `readonly string[]` syntax for consistency. Whichever you choose, remember they're essentially the same under the hood.
  
  ### Operation Results:
  This operation generated results by running the TypoNerd nerd against the source text using three different LLMs. The results are as follows:

  #### GPT:
  ```typescript
  {}
  ```

  #### Anthropic:
  ```typescript
  {
  proposed_edits: [
    {
      existing_text: 'approach solution',
      proposed_replacement: 'approach',
      reasoning: "The word 'solution' is redundant here since 'approach' already conveys the meaning of a solution or method.",
      confidence: 0.9
    },
    {
      existing_text: 'If you feel the need to choose one, it might be better to choose the `readonly string[]` syntax for consistency.',
      proposed_replacement: 'If you need to choose one for consistency, the `readonly string[]` syntax is recommended.',
      reasoning: 'The original phrasing is a bit wordy and indirect. This proposed edit conveys the same meaning more concisely.',
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
      existing_text: 'approach solution',
      proposed_replacement: 'approach',
      reasoning: "The word 'solution' appears to be redundant here.",
      confidence: 0.9
    }
  ]
}
  ```