## Output of TypoNerd against 098-object-property-inference.md
  
  ### Source Text
  # Problem
In this exercise, we are dealing with a `modifyButton` function. This function takes in some attributes which are defined in the `ButtonAttributes` type.

The `ButtonAttributes` type has a single property, `type`, which can be either "button", "submit", or "reset".

Following this, we have a declared `buttonAttributes` object defined as `type: 'button'`, which we then pass to our `modifyButton` function.

```typescript
type ButtonAttributes = {
  type: "button" | "submit" | "reset";
};

const modifyButton = (attributes: ButtonAttributes) => {};

const buttonAttributes = {
  type: "button",
};

modifyButton(buttonAttributes); // red squiggly line under buttonAttributes
```

There is currently an error occurring when we call `modifyButton`, which closely resembles an issue we've seen before.

Additionally, a second `modifyButtons` function is also present, which, like the name suggests, deals with an array of button attributes instead of a single attribute.

Inside this, we have a variable `buttonsToChange`, which is an array composed of objects of `type: 'button'` and `type: 'submit'`:

```typescript
const modifyButtons = (attributes: ButtonAttributes[]) => {};

const buttonsToChange = [
  {
    type: "button",
  },
  {
    type: "submit",
  },
];

modifyButtons(buttonsToChange); // red squiggly line under buttonsToChange
```

Very much like before, we pass `buttonsToChange` into the `modifyButtons` function and encounter a similar error. 

## Challenge

Your task is to determine why we have these errors and find a solution to resolve them.

# Resolution
Like before, we have an errors that the `buttonAttributes` type string is not assignable to type `"button" | "submit" | "reset"`.

We get this error because even though the variable was declared with `const`, JavaScript allows us to modify object properties. This means that TypeScript also treats object properties as mutable, even if the object itself is declared as a constant.

There are a couple ways to fix this issue. 

## Solution 1: Inline Object Solution

One way to ensure that the `buttonAttributes` is assigned correctly is by inlining it when calling the `modifyButton` function. This way `type` can't be modified before it gets passed into the function:

```typescript
modifyButton({
  type: "button"
});
```

## Solution 2: Adding a Type

The other way to solve the issue is by adding a type to the `buttonAttributes` object.

```typescript
const buttonAttributes: ButtonAttributes = {
  type: "button",
};

const modifyButton = (attributes: ButtonAttributes) => {};
modifyButton(buttonAttributes);
```

By providing the type, TypeScript can check whether it matches `"button" | "submit" | "reset"` and everything works as expected.

## Handling Arrays

The reasoning behind the errors for arrays is the same as for objects as we saw above.

Hovering over the `buttonsToChange` variable, we see that it's inferred as an array of type `string`:

```typescript
// hovering over buttonsToChange shows:
const buttonsToChange: {
  type: string;
}[]
```

This means that we could change the type of the first element in the array to something different. TypeScript is scared of this, so it won't infer properly.

```typescript
// The first element of an array can have its properties changed
buttonsToChange[0].type = "something strange";
```

The fix here is to specify that `buttonsToChange` is an array of `ButtonAttributes`:

```typescript
const buttonsToChange: ButtonAttributes[] = [
  {
    type: "button",
  },
  {
    type: "submit",
  },
];

modifyButtons(buttonsToChange);
```

Understanding how TypeScript infers object properties can help you improve your coding approach. Depending on the situation, it may be cleaner to inline variables when passing them directly into functions rather than declaring them separately. Either way you go, it's important to understand how the techniques you use affect inference.
  
  ### Operation Results:
  This operation generated results by running the TypoNerd nerd against the source text using three different LLMs. The results are as follows:

  #### GPT:
  ```typescript
  {
  proposed_edits: [
    {
      existing_text: 'Like before, we have an errors that the',
      proposed_replacement: 'Like before, we have an error that the',
      reasoning: "The phrase 'an errors' is grammatically incorrect. It should be singular 'an error' to match the singular article 'an'.",
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
      existing_text: 'an errors',
      proposed_replacement: 'an error',
      reasoning: "Grammatical correction - 'error' should be singular to match the article 'an'.",
      confidence: 0.95
    },
    {
      existing_text: 'type string',
      proposed_replacement: 'type',
      reasoning: "The word 'string' seems extraneous here and can be removed for clarity.",
      confidence: 0.8
    },
    {
      existing_text: 'type `string`',
      proposed_replacement: 'type `{ type: string; }[]`',
      reasoning: "The inferred type shown in the code comment is an array of objects with a 'type' property of type string, not just a string type.",
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
      existing_text: 'errors that the `buttonAttributes` type string is not assignable to type',
      proposed_replacement: 'error that the `buttonAttributes` object is not assignable to type',
      reasoning: 'The wording "type string" is not accurate in this context. The issue is with the object itself, not its type as a string.',
      confidence: 0.95
    },
    {
      existing_text: 'an errors',
      proposed_replacement: 'an error',
      reasoning: '"errors" should be singular in this context.',
      confidence: 1
    }
  ]
}
  ```