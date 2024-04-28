---
title: Output of PersonalityNerd against 098-object-property-inference.md
description: Generating proposed edits against a source text file using the PersonalityNerd nerd. The source text is included, followed by edits generated by the same nerd against three different LLMs.
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
This operation generated results by running the PersonalityNerd nerd against the source text using three different LLMs. The results are as follows:

#### GPT:
```typescript
[Error running GPT: SyntaxError: Expected ',' or '}' after property value in JSON at position 2030]
```

#### Anthropic:
```typescript
{
  proposed_edits: [
    {
      existing_text: "There is currently an error occurring when we call `modifyButton`, which closely resembles an issue we've seen before.",
      proposed_replacement: "There's a bloody error popping up when we ring up this `modifyButton` function. Seems like we've tangled with this sort of nasty business before.",
      reasoning: 'Adding some Spike-like language and attitude to the error description to make it more engaging and entertaining for the reader.',
      confidence: 0.8
    },
    {
      existing_text: 'Very much like before, we pass `buttonsToChange` into the `modifyButtons` function and encounter a similar error.',
      proposed_replacement: "Surprise, surprise. We toss `buttonsToChange` over to `modifyButtons` and - wouldn't you know it - same sodding error rears its ugly head.",
      reasoning: "Injecting Spike's sarcastic and colorful way of speaking to add some personality and humor to the repetitive error encounter.",
      confidence: 0.9
    },
    {
      existing_text: 'We get this error because even though the variable was declared with `const`, JavaScript allows us to modify object properties.',
      proposed_replacement: "So why's this error got its knickers in a twist? Turns out, even though we declared the variable all `const`-like, JavaScript's got no problem letting us muck about with the object's properties.",
      reasoning: "Rephrasing the explanation in Spike's distinctive voice to make the technical details more engaging and relatable.",
      confidence: 0.85
    },
    {
      existing_text: "TypeScript is scared of this, so it won't infer properly.",
      proposed_replacement: "TypeScript takes one look at this and gets all twitchy. Decides it's not even gonna try to suss things out properly.",
      reasoning: "Adding some Spike-esque personification and slang to the description of TypeScript's behavior for humorous effect.",
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
      existing_text: '## Challenge',
      proposed_replacement: '## Right then, bit of a challenge for you...',
      reasoning: "Adding a bit of Spike's casual and slightly challenging tone to the heading.",
      confidence: 0.9
    },
    {
      existing_text: 'Your task is to determine why we have these errors and find a solution to resolve them.',
      proposed_replacement: "So, figure out why these errors are popping up like a bad vampire rash and sort 'em out.",
      reasoning: "Replacing the formal language with Spike's informal and witty style, including a vampire-related metaphor.",
      confidence: 0.8
    },
    {
      existing_text: '## Solution 1: Inline Object Solution',
      proposed_replacement: '## Solution 1: Quick Fix, Innit?',
      reasoning: "Using Spike's slang and informal language to describe the solution.",
      confidence: 0.9
    },
    {
      existing_text: "This way `type` can't be modified before it gets passed into the function:",
      proposed_replacement: "This way, that pesky `type` stays put, like a stake in a vamp's heart.",
      reasoning: "Adding a dark humor metaphor related to vampires to maintain Spike's style.",
      confidence: 0.7
    },
    {
      existing_text: '## Solution 2: Adding a Type',
      proposed_replacement: '## Solution 2: Type it Up, Slayer',
      reasoning: 'Using a Buffy reference and a more commanding tone to introduce the solution.',
      confidence: 0.8
    },
    {
      existing_text: 'By providing the type, TypeScript can check whether it matches `"button" | "submit" | "reset"` and everything works as expected.',
      proposed_replacement: 'Give it the type, and TypeScript will sort it out, like Buffy with a Hellmouth.',
      reasoning: 'Adding a Buffy reference to maintain the theme and make the explanation more engaging.',
      confidence: 0.8
    },
    {
      existing_text: '## Handling Arrays',
      proposed_replacement: '## Wrangling the Array Herd',
      reasoning: 'Using a more informal and active phrase to describe handling arrays.',
      confidence: 0.9
    },
    {
      existing_text: "TypeScript is scared of this, so it won't infer properly.",
      proposed_replacement: "TypeScript's a bit of a scaredy-cat, see? Won't infer things right if it's spooked.",
      reasoning: "Adding a humorous personification of TypeScript to align with Spike's style.",
      confidence: 0.7
    },
    {
      existing_text: 'Understanding how TypeScript infers object properties can help you improve your coding approach.',
      proposed_replacement: "Get your head around this TypeScript inference malarkey, and you'll be coding like a bloody pro.",
      reasoning: "Using Spike's informal language and adding a bit of encouragement.",
      confidence: 0.8
    }
  ]
}
```