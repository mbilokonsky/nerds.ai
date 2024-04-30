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