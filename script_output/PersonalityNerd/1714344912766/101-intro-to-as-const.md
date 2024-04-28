---
title: Output of PersonalityNerd against 101-intro-to-as-const.md
description: Generating proposed edits against a source text file using the PersonalityNerd nerd. The source text is included, followed by edits generated by the same nerd against three different LLMs.
---

# Problem
Here we have the same setup as before: a `modifyButton` function that takes in an object of `buttonAttributes` which expects a type of `ButtonAttributes` containing either "button", "submit" or "reset":

```tsx
type ButtonAttributes = {
  type: "button" | "submit" | "reset";
};

const modifyButton = (attributes: ButtonAttributes) => {};

const buttonAttributes = {
  type: "button",
};

modifyButton(buttonAttributes); // red squiggly line under buttonAttributes
```

The problem arises when we try to pass `buttonAttributes` into the `modifyButton` function. We receive a TypeScript error stating that the argument of type `string` is not assignable to the parameter of type `ButtonAttributes`. This issue occurs because the `buttonAttributes.type` is mutable. 

Previously, we solved this by specifying a type for `buttonAttributes`. 

However, there's a more interesting approach where we can instruct TypeScript to treat `buttonAttributes` as if none of its properties can be changed. Essentially, we want to make `buttonAttributes` deeply read-only.

## Challenge

Your task is to find the appropriate annotation to apply to `buttonAttributes` to make it deeply read-only. However, you can only work on the `buttonAttributes` definition, and you're not allowed to use the `ButtonAttributes` type.

# Resolution
By adding `as const` to `buttonAttributes`, a `readonly` modifier is applied to the type. 

This fixes the inference issue on `type` so it will be inferred as a `button` and not a `string`:

```tsx
type ButtonAttributes = {
  type: "button" | "submit" | "reset";
};

const buttonAttributes = {
  type: "button",
} as const;

// hovering over buttonAttributes shows:
const buttonAttributes: {
  readonly type: "button";
}
```

There's no cost to using `as const` in your code, as it disappears at runtime.

Using `as const` is an incredibly effective pattern found in a multitude of applications, especially when configuring objects in TypeScript.

### Operation Results:
This operation generated results by running the PersonalityNerd nerd against the source text using three different LLMs. The results are as follows:

#### GPT:
```typescript
[Error running GPT: SyntaxError: Unexpected non-whitespace character after JSON at position 1968]
```

#### Anthropic:
```typescript
{
  proposed_edits: [
    {
      existing_text: 'The problem arises when we try to pass `buttonAttributes` into the `modifyButton` function.',
      proposed_replacement: 'The problem rears its ugly head when we try to shove `buttonAttributes` into the `modifyButton` function.',
      reasoning: 'Adding some Spike-like snark and attitude to the description of the problem.',
      confidence: 0.8
    },
    {
      existing_text: 'We receive a TypeScript error stating that the argument of type `string` is not assignable to the parameter of type `ButtonAttributes`.',
      proposed_replacement: "TypeScript gets its knickers in a twist, whining that the argument of type `string` can't be assigned to the parameter of type `ButtonAttributes`.",
      reasoning: 'Injecting some colorful language and wit into the error description, as Spike might do.',
      confidence: 0.7
    },
    {
      existing_text: 'This issue occurs because the `buttonAttributes.type` is mutable.',
      proposed_replacement: "This bloody issue crops up because `buttonAttributes.type` is as mutable as a vampire's morals.",
      reasoning: "Using a vampire reference to humorously explain the mutability problem, in Spike's style.",
      confidence: 0.9
    },
    {
      existing_text: "There's no cost to using `as const` in your code, as it disappears at runtime.",
      proposed_replacement: 'Using `as const` in your code is free as a bird, mate. It vanishes like a vampire at sunrise when runtime comes around.',
      reasoning: 'Explaining the runtime behavior with a cheeky vampire analogy that Spike would appreciate.',
      confidence: 0.85
    }
  ]
}
```

#### Gemini:
```typescript
{
  proposed_edits: [
    {
      existing_text: 'Here we have the same setup as before: a `modifyButton` function that takes in an object of `buttonAttributes` which expects a type of `ButtonAttributes` containing either "button", "submit" or "reset":',
      proposed_replacement: 'Right then, listen up. We\'ve got this `modifyButton` geezer, see? It takes an object of `buttonAttributes`, which is a right ponce and expects a type of `ButtonAttributes` with either "button", "submit" or "reset":',
      reasoning: 'Spike would use more informal and engaging language, with a bit of British slang.',
      confidence: 0.8
    },
    {
      existing_text: 'The problem arises when we try to pass `buttonAttributes` into the `modifyButton` function.',
      proposed_replacement: 'The trouble starts when we try to shove `buttonAttributes` into the `modifyButton` function.',
      reasoning: 'Spike would use more active and aggressive verbs.',
      confidence: 0.7
    },
    {
      existing_text: 'This issue occurs because the `buttonAttributes.type` is mutable.',
      proposed_replacement: 'This happens because `buttonAttributes.type` is a right fickle git, always changing.',
      reasoning: 'Spike would use more descriptive and humorous language to explain the issue.',
      confidence: 0.8
    },
    {
      existing_text: 'Essentially, we want to make `buttonAttributes` deeply read-only.',
      proposed_replacement: 'Basically, we want to make `buttonAttributes` as unchanging as a crypt.',
      reasoning: 'Spike would use a more vivid and relatable metaphor.',
      confidence: 0.9
    },
    {
      existing_text: '## Challenge',
      proposed_replacement: '## Right, your turn then',
      reasoning: 'Spike would use a more direct and challenging tone.',
      confidence: 0.7
    },
    {
      existing_text: 'Your task is to find the appropriate annotation to apply to `buttonAttributes` to make it deeply read-only.',
      proposed_replacement: "Your job is to find the right spell to cast on `buttonAttributes` to make it as unchangeable as a vampire's soul.",
      reasoning: 'Spike would use a more metaphorical and humorous way to describe the task.',
      confidence: 0.9
    },
    {
      existing_text: "However, you can only work on the `buttonAttributes` definition, and you're not allowed to use the `ButtonAttributes` type.",
      proposed_replacement: "But here's the catch: you can only mess with the `buttonAttributes` definition, and no using the `ButtonAttributes` type. It's like fighting with one hand tied behind your back, but hey, who said life was fair?",
      reasoning: 'Spike would add a bit of snark and a challenge to the instructions.',
      confidence: 0.8
    },
    {
      existing_text: 'By adding `as const` to `buttonAttributes`, a `readonly` modifier is applied to the type.',
      proposed_replacement: "Slap `as const` onto `buttonAttributes`, and it's like putting a stake through its heart - it ain't changing no more.",
      reasoning: 'Spike would use a more vivid and humorous metaphor to explain the solution.',
      confidence: 0.9
    },
    {
      existing_text: 'This fixes the inference issue on `type` so it will be inferred as a `button` and not a `string`:',
      proposed_replacement: "This sorts out the problem with `type`, so it'll be seen as a proper `button` and not some wishy-washy `string`:",
      reasoning: 'Spike would use more informal and descriptive language.',
      confidence: 0.7
    },
    {
      existing_text: "There's no cost to using `as const` in your code, as it disappears at runtime.",
      proposed_replacement: "Don't worry, using `as const` won't cost you a penny, it vanishes like a ghost at runtime.",
      reasoning: 'Spike would use a more relatable and humorous analogy.',
      confidence: 0.8
    },
    {
      existing_text: 'Using `as const` is an incredibly effective pattern found in a multitude of applications, especially when configuring objects in TypeScript.',
      proposed_replacement: "Using `as const` is a bloody brilliant trick, comes in handy more often than you'd think, especially when you're setting up objects in TypeScript.",
      reasoning: 'Spike would use more enthusiastic and informal language to emphasize the usefulness of the pattern.',
      confidence: 0.9
    }
  ]
}
```