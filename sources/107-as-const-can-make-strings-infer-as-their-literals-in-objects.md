There's another interesting feature of `as const`, which we'll see in this example.

The `modifyButton` function accepts an `attributes` object typed as `ButtonAttributes`, which has `type` values of "button," "submit," or "reset".


```typescript
type ButtonAttributes = {
  type: "button" | "submit" | "reset";
};

const modifyButton = (attributes: ButtonAttributes) => {};
```

In this example, the `buttonAttributes` object only defines `type` as "button," which causes an error when passing it into the `modifyButton` function:

```tsx
const buttonAttributes = {
  type: "button";
};

modifyButton(buttonAttributes); // red squiggly line under buttonAttributes
```

As we've seen, we can fix this by adding `as const` to the `buttonAttributes` object, which makes the entire object read-only:

```typescript
const buttonAttributes = {
  type: "button";
} as const;

// Hovering over buttonAttributes shows:
const buttonAttributes: {
  readonly type: "button";
}
```

We can also apply `as const` to just `type` property:

```typescript
const buttonAttributes = {
  type: "button" as const;
};
```

However, this time the `type` property here is not read-only, but it's inferred as its literal type:

```typescript
// Hovering over buttonAttributes shows:
const buttonAttributes: {
  type: "button";
}
```

Building on this, we could also ensure the literal type inference for various properties in an array of objects by adding `as const` after each `type` property:

```typescript
const modifyButtons = (attributes: ButtonAttributes[]) => {};

const buttonsToChange = [
  {
    type: "button" as const,
  },
  {
    type: "submit" as const,
  },
];
```

Even with `as const` applied, we're still able to modify the `type` property but only to be one of the allowed literal types:

```typescript
buttonAttributes.type = "button";
```

This property makes `as const` a handy tool to be used whenever you want to ensure a specific literal is inferred for an object you're working with.
