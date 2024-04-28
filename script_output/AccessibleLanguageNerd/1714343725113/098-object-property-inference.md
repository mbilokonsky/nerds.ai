---
title: Output of AccessibleLanguageNerd against 098-object-property-inference.md
description: Generating proposed edits against a source text file using the AccessibleLanguageNerd nerd. The source text is included, followed by edits generated by the same nerd against three different LLMs.
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
This operation generated results by running the AccessibleLanguageNerd nerd against the source text using three different LLMs. The results are as follows:

#### GPT:
```typescript
{
  proposed_edits: [
    {
      existing_text: 'In this exercise, we are dealing with a `modifyButton` function. This function takes in some attributes which are defined in the `ButtonAttributes` type.',
      proposed_replacement: 'In this exercise, we are working with a function called `modifyButton`. This function accepts certain attributes defined by the `ButtonAttributes` type.',
      reasoning: "The revised sentence simplifies the language and makes the function's purpose clearer.",
      confidence: 0.9
    },
    {
      existing_text: "Following this, we have a declared `buttonAttributes` object defined as `type: 'button'`, which we then pass to our `modifyButton` function.",
      proposed_replacement: "Next, we declare an object `buttonAttributes` with the property `type: 'button'`, and pass it to the `modifyButton` function.",
      reasoning: 'The revision clarifies the sequence of actions and simplifies the sentence structure.',
      confidence: 0.9
    },
    {
      existing_text: 'Additionally, a second `modifyButtons` function is also present, which, like the name suggests, deals with an array of button attributes instead of a single attribute.',
      proposed_replacement: 'Additionally, there is a second function named `modifyButtons` that handles an array of button attributes, rather than just one.',
      reasoning: 'This revision simplifies and clarifies the description of what the `modifyButtons` function does.',
      confidence: 0.9
    },
    {
      existing_text: "Inside this, we have a variable `buttonsToChange`, which is an array composed of objects of `type: 'button'` and `type: 'submit':",
      proposed_replacement: "Within this function, we define a variable `buttonsToChange` as an array containing objects with `type: 'button'` and `type: 'submit':",
      reasoning: 'The revision clarifies the content and structure of the `buttonsToChange` array.',
      confidence: 0.9
    },
    {
      existing_text: 'Very much like before, we pass `buttonsToChange` into the `modifyButtons` function and encounter a similar error.',
      proposed_replacement: 'Similarly to the previous case, we pass `buttonsToChange` to the `modifyButtons` function and encounter a similar error.',
      reasoning: 'The revision improves the flow and readability of the sentence.',
      confidence: 0.9
    },
    {
      existing_text: 'Like before, we have an errors that the `buttonAttributes` type string is not assignable to type `"button" | "submit" | "reset"`.',
      proposed_replacement: 'As in the previous case, we encounter an error stating that the `buttonAttributes` type string is not assignable to the type `"button" | "submit" | "reset"`.',
      reasoning: 'The revision corrects grammatical errors and clarifies the nature of the error.',
      confidence: 0.95
    },
    {
      existing_text: "This means that we could change the type of the first element in the array to something different. TypeScript is scared of this, so it won't infer properly.",
      proposed_replacement: 'This implies that the type of the first element in the array could be changed to something different. TypeScript is cautious about this possibility, which prevents proper type inference.',
      reasoning: "The revision removes anthropomorphism ('TypeScript is scared') and clarifies the technical explanation.",
      confidence: 0.95
    }
  ]
}
```

#### Anthropic:
```typescript
{
  proposed_edits: [
    {
      existing_text: 'In this exercise, we are dealing with a `modifyButton` function. This function takes in some attributes which are defined in the `ButtonAttributes` type.',
      proposed_replacement: 'In this exercise, we have a `modifyButton` function that takes in attributes defined in the `ButtonAttributes` type.',
      reasoning: 'The revised wording is more concise and direct, making it easier to understand the key points.',
      confidence: 0.8
    },
    {
      existing_text: "Following this, we have a declared `buttonAttributes` object defined as `type: 'button'`, which we then pass to our `modifyButton` function.",
      proposed_replacement: "We then declare a `buttonAttributes` object with `type: 'button'` and pass it to the `modifyButton` function.",
      reasoning: 'The revised sentence structure is simpler and more straightforward, improving readability.',
      confidence: 0.9
    },
    {
      existing_text: "There is currently an error occurring when we call `modifyButton`, which closely resembles an issue we've seen before.",
      proposed_replacement: "Calling `modifyButton` currently results in an error similar to one we've encountered before.",
      reasoning: 'The proposed edit simplifies the sentence structure and makes it more direct.',
      confidence: 0.7
    },
    {
      existing_text: 'Additionally, a second `modifyButtons` function is also present, which, like the name suggests, deals with an array of button attributes instead of a single attribute.',
      proposed_replacement: 'There is also a second function, `modifyButtons`, which handles an array of button attributes rather than a single attribute.',
      reasoning: 'The revised sentence is more concise and eliminates unnecessary phrases, making it easier to understand.',
      confidence: 0.8
    },
    {
      existing_text: 'We get this error because even though the variable was declared with `const`, JavaScript allows us to modify object properties. This means that TypeScript also treats object properties as mutable, even if the object itself is declared as a constant.',
      proposed_replacement: 'This error occurs because although the variable is declared with `const`, JavaScript allows modifying object properties. As a result, TypeScript treats object properties as mutable, even when the object itself is declared as a constant.',
      reasoning: 'The proposed edit breaks the long sentence into two shorter ones, improving readability and making the explanation clearer.',
      confidence: 0.9
    },
    {
      existing_text: "Hovering over the `buttonsToChange` variable, we see that it's inferred as an array of type `string`:",
      proposed_replacement: 'If we hover over the `buttonsToChange` variable, we see that TypeScript infers it as an array of objects with a `type` property of type `string`:',
      reasoning: 'The proposed edit provides a more accurate description of what TypeScript infers for the `buttonsToChange` variable.',
      confidence: 0.95
    }
  ]
}
```

#### Gemini:
```typescript
{
  proposed_edits: [
    {
      existing_text: 'In this exercise, we are dealing with a `modifyButton` function. This function takes in some attributes which are defined in the `ButtonAttributes` type.',
      proposed_replacement: "In this exercise, we'll explore the `modifyButton` function. This function accepts attributes defined by the `ButtonAttributes` type.",
      reasoning: 'Rephrased the sentence to be more direct and replaced "dealing with" with a more precise verb.',
      confidence: 0.9
    },
    {
      existing_text: "Following this, we have a declared `buttonAttributes` object defined as `type: 'button'`, which we then pass to our `modifyButton` function.",
      proposed_replacement: "Next, we declare a `buttonAttributes` object with `type: 'button'`, which we then pass to our `modifyButton` function.",
      reasoning: 'Replaced "Following this" with "Next" for better reading flow.',
      confidence: 0.8
    },
    {
      existing_text: "There is currently an error occurring when we call `modifyButton`, which closely resembles an issue we've seen before.",
      proposed_replacement: 'We encounter an error when calling `modifyButton`, similar to a previous issue.',
      reasoning: 'Simplified the sentence structure and replaced "occurring" with a more concise verb.',
      confidence: 0.9
    },
    {
      existing_text: 'Additionally, a second `modifyButtons` function is also present, which, like the name suggests, deals with an array of button attributes instead of a single attribute.',
      proposed_replacement: 'We also have a `modifyButtons` function that handles an array of button attributes, as the name implies.',
      reasoning: 'Simplified the sentence structure and made it more concise.',
      confidence: 0.95
    },
    {
      existing_text: "Inside this, we have a variable `buttonsToChange`, which is an array composed of objects of `type: 'button'` and `type: 'submit'`:",
      proposed_replacement: "Within this function, we have a `buttonsToChange` variable, which is an array containing objects with `type: 'button'` and `type: 'submit'`:",
      reasoning: 'Clarified the context of the variable and rephrased the sentence for better readability.',
      confidence: 0.85
    },
    {
      existing_text: 'Very much like before, we pass `buttonsToChange` into the `modifyButtons` function and encounter a similar error.',
      proposed_replacement: 'Similar to the previous case, passing `buttonsToChange` to the `modifyButtons` function results in a similar error.',
      reasoning: 'Rephrased the sentence to be more direct and formal.',
      confidence: 0.9
    },
    {
      existing_text: 'Your task is to determine why we have these errors and find a solution to resolve them.',
      proposed_replacement: 'The challenge is to identify the cause of these errors and find a solution to fix them.',
      reasoning: 'Rephrased the sentence to be more engaging and used synonyms for clarity.',
      confidence: 0.8
    },
    {
      existing_text: 'Like before, we have an errors that the `buttonAttributes` type string is not assignable to type `"button" | "submit" | "reset"`.',
      proposed_replacement: 'Similar to the previous issue, we encounter an error stating that the `buttonAttributes` type string is not assignable to the type `"button" | "submit" | "reset"`.',
      reasoning: 'Clarified the sentence structure and used more precise language.',
      confidence: 0.9
    },
    {
      existing_text: 'We get this error because even though the variable was declared with `const`, JavaScript allows us to modify object properties. This means that TypeScript also treats object properties as mutable, even if the object itself is declared as a constant.',
      proposed_replacement: 'This error arises because, despite using `const` for variable declaration, JavaScript permits modification of object properties. Consequently, TypeScript also considers object properties mutable, even when the object is declared as a constant.',
      reasoning: 'Rephrased the sentence to be more formal and used more precise language.',
      confidence: 0.95
    },
    {
      existing_text: 'There are a couple ways to fix this issue.',
      proposed_replacement: 'There are a few ways to address this issue.',
      reasoning: 'Used a more formal synonym for "fix".',
      confidence: 0.7
    },
    {
      existing_text: "One way to ensure that the `buttonAttributes` is assigned correctly is by inlining it when calling the `modifyButton` function. This way `type` can't be modified before it gets passed into the function:",
      proposed_replacement: "One approach to ensure correct assignment of `buttonAttributes` is to inline it when calling the `modifyButton` function. This prevents modification of the `type` property before it's passed to the function:",
      reasoning: 'Rephrased the sentence to be more formal and precise.',
      confidence: 0.9
    },
    {
      existing_text: 'The other way to solve the issue is by adding a type to the `buttonAttributes` object.',
      proposed_replacement: 'Another solution is to explicitly specify the type for the `buttonAttributes` object.',
      reasoning: 'Rephrased the sentence to be more formal and precise.',
      confidence: 0.9
    },
    {
      existing_text: 'By providing the type, TypeScript can check whether it matches `"button" | "submit" | "reset"` and everything works as expected.',
      proposed_replacement: 'By providing the type, TypeScript can verify if it aligns with `"button" | "submit" | "reset"`, ensuring correct functionality.',
      reasoning: 'Rephrased the sentence to be more formal and precise.',
      confidence: 0.9
    },
    {
      existing_text: 'The reasoning behind the errors for arrays is the same as for objects as we saw above.',
      proposed_replacement: 'The rationale behind the errors for arrays mirrors that for objects, as discussed earlier.',
      reasoning: 'Used more formal synonyms for "reasoning" and "saw".',
      confidence: 0.8
    },
    {
      existing_text: "Hovering over the `buttonsToChange` variable, we see that it's inferred as an array of type `string`:",
      proposed_replacement: 'Upon inspection, the `buttonsToChange` variable is inferred as an array of type `string`:',
      reasoning: 'Replaced "hovering over" with a more formal equivalent.',
      confidence: 0.7
    },
    {
      existing_text: "This means that we could change the type of the first element in the array to something different. TypeScript is scared of this, so it won't infer properly.",
      proposed_replacement: 'This implies the possibility of altering the type of the first element in the array, which TypeScript aims to prevent through strict type inference.',
      reasoning: 'Rephrased the sentence to be more formal and avoided anthropomorphizing TypeScript.',
      confidence: 0.9
    },
    {
      existing_text: 'The fix here is to specify that `buttonsToChange` is an array of `ButtonAttributes`:',
      proposed_replacement: 'To resolve this, we explicitly declare `buttonsToChange` as an array of `ButtonAttributes`:',
      reasoning: 'Rephrased the sentence to be more formal and precise.',
      confidence: 0.9
    },
    {
      existing_text: "Understanding how TypeScript infers object properties can help you improve your coding approach. Depending on the situation, it may be cleaner to inline variables when passing them directly into functions rather than declaring them separately. Either way you go, it's important to understand how the techniques you use affect inference.",
      proposed_replacement: 'Grasping how TypeScript infers object properties can enhance your coding practices. Depending on the context, inlining variables when passing them to functions might be preferable to separate declarations. Regardless of the approach, understanding the impact of your techniques on type inference is crucial.',
      reasoning: 'Rephrased the sentence to be more formal and precise.',
      confidence: 0.9
    }
  ]
}
```