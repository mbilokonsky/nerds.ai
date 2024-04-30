## Output of TypoNerd against 104-readonly-arrays-assignability-to-mutable-arrays.md
  
  ### Source Text
  When working with TypeScript, it's important to understand the distinction between read-only and mutable arrays.

In this example, `printNamesReadOnly` and `printNamesMutable`, which are functionally identical, except `printNamesReadOnly` takes a read-only array of names as a parameter whereas `printNamesMutable` takes a mutable array:

```typescript
function printNamesReadOnly(names: readonly string[]) {
  for (const name of names) {
    console.log(name);
  }
}

function printNamesMutable(names: string[]) {
  for (const name of names) {
    console.log(name);
  }
}
```

When we create a mutable array of names, it can be passed as an argument to both of these functions:

```typescript
const mutableNames = ["John", "Jane", "Mike"];

printNamesReadOnly(mutableNames);
printNamesMutable(mutableNames);
```

This works because specifying `readonly` on the `printNamesReadOnly` function parameter only guarantees that it won't alter the array's content. Thus, it doesn't matter if we pass a mutable array because it won't be changed.

However, the reverse isn't true.

If we declare a read-only array, which we often do using the `as const` syntax, we can only pass it to `printNamesReadOnly`. Attempting to pass it to `printNamesMutable` will yield an error:

```typescript
const readonlyNames = ["John", "Jane", "Mike"] as const;

printNamesReadOnly(readonlyNames);

printNamesMutable(readonlyNames); // red squiggly line under readonlyNames

// hovering over readonlyNames shows:
Error: Argument of type 'readonly ["John", "Jane", "Mike"]' is not assignable to parameter of type 'string[]'
```

The error arises due to the potential for a mutable array to be altered inside of the function, which isn't acceptable for a read-only array.

In essence, read-only arrays can only be assigned to other read-only types. This characteristic is somewhat viral: if a function deep down the call stack expects a `readonly` array, then that array must remain `readonly` throughout. Doing so ensures that the array won't be mutated in any manner as it moves down the stack.

In conclusion, even though you can assign mutable arrays to read-only arrays, you cannot assign read-only arrays to mutable arrays.
  
  ### Operation Results:
  This operation generated results by running the TypoNerd nerd against the source text using three different LLMs. The results are as follows:

  #### GPT:
  ```typescript
  { proposed_edits: [] }
  ```

  #### Anthropic:
  ```typescript
  {
  proposed_edits: [
    {
      existing_text: '`printNamesReadOnly` and `printNamesMutable`, which are functionally identical, except',
      proposed_replacement: '`printNamesReadOnly` and `printNamesMutable` are functionally identical, except',
      reasoning: 'Adding a missing word to improve sentence flow and clarity.',
      confidence: 0.9
    },
    {
      existing_text: "it's content",
      proposed_replacement: 'its content',
      reasoning: "Correcting a common mistake with the possessive form of 'it'.",
      confidence: 0.95
    },
    {
      existing_text: "it's important",
      proposed_replacement: "it's important",
      reasoning: "The contraction 'it's' is used correctly here, so no change is needed.",
      confidence: 1
    }
  ]
}
  ```

  #### Gemini:
  ```typescript
  { proposed_edits: [] }
  ```