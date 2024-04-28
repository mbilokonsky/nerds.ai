---
title: Output of CodeSnippetTunerNerd against 098-object-property-inference.md
description: Generating proposed edits against a source text file using the CodeSnippetTunerNerd nerd. The source text is included, followed by edits generated by the same nerd against three different LLMs.
---

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
This operation generated results by running the CodeSnippetTunerNerd nerd against the source text using three different LLMs. The results are as follows:

#### GPT:
```typescript
{
  proposed_edits: [
    {
      existing_text: 'modifyButton(buttonAttributes); // red squiggly line under buttonAttributes',
      proposed_replacement: 'modifyButton(buttonAttributes);',
      reasoning: "The provided solution correctly addresses the TypeScript error by explicitly typing the 'buttonAttributes' object. Therefore, the comment about the red squiggly line is no longer applicable and should be removed to avoid confusion.",
      confidence: 1
    },
    {
      existing_text: 'modifyButtons(buttonsToChange); // red squiggly line under buttonsToChange',
      proposed_replacement: 'modifyButtons(buttonsToChange);',
      reasoning: "The solution provided correctly types the 'buttonsToChange' array as an array of 'ButtonAttributes', resolving the TypeScript error. The comment about the red squiggly line should be removed as it is no longer relevant.",
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
      existing_text: 'buttonsToChange[0].type = "something strange";',
      proposed_replacement: '',
      reasoning: "This line of code is used to demonstrate that TypeScript allows mutating the type property of array elements to an invalid value. However, it's not a good practice to show incorrect code without comments explaining the purpose. It's better to remove this line to avoid confusion.",
      confidence: 0.8
    },
    {
      existing_text: '// hovering over buttonsToChange shows:\n' +
        'const buttonsToChange: {\n' +
        '  type: string;\n' +
        '}[]',
      proposed_replacement: '// hovering over buttonsToChange shows:\n' +
        'const buttonsToChange: {\n' +
        "  type: string; // TypeScript infers this as 'string', not the specific union type\n" +
        '}[]',
      reasoning: "Adding a comment to clarify why TypeScript infers the type as 'string' instead of the specific union type would help the reader understand the issue better.",
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
      existing_text: '```typescript\n' +
        '// hovering over buttonsToChange shows:\n' +
        'const buttonsToChange: {\n' +
        '  type: string;\n' +
        '}[]\n' +
        '```',
      proposed_replacement: '```typescript\n' +
        '// hovering over buttonsToChange shows:\n' +
        'const buttonsToChange: {\n' +
        '  type: "button" | "submit" | "reset";\n' +
        '}[]\n' +
        '```',
      reasoning: 'The comment above the code snippet indicates that hovering over the variable `buttonsToChange` in an editor would show its inferred type. However, the type shown in the code snippet is incorrect. It should reflect the actual inferred type, which is an array of objects with a `type` property that can be either `"button"`, `"submit"`, or `"reset"`.',
      confidence: 0.9
    }
  ]
}
```