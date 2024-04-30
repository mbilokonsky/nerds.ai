# Problem
In our continued exploration of button types, we now have a modified version of `ButtonAttributes` that accepts `cancel` and `confirm` buttons. Each of these buttons exists as an object with a `type` of `ButtonType`. As in the previous exercises, the `ButtonType` remains either `button`, `submit`, or `reset`:

```tsx
type ButtonType = "button" | "submit" | "reset";

type ButtonAttributes = {
  cancel: {
    type: ButtonType;
  };
  confirm: {
    type: ButtonType;
  };
};
```

We call `Object.freeze()` on `buttonAttributes` which effectively locks the object, preventing any property alterations: 

```tsx
const modifyButtons = (attributes: ButtonAttributes) => {};

const buttonAttributes = Object.freeze({
  cancel: {
    type: "button",
  },
  confirm: {
    type: "button",
  },
});

modifyButtons(buttonAttributes); // red squiggly line under buttonAttributes
```

However, there's an error when we call `modifyButtons` with `buttonAttributes`.

## Challenge

Your task is to diagnose why we have an error when using `Object.freeze`, since it seems like it should work like `as const` did.

To solve the issue, you should only modify the `buttonAttributes` code.

# Resolution
In TypeScript, using `Object.freeze` is a common method for creating immutable objects. However, there are some significant differences between `Object.freeze` and `as const`.

When applying `Object.freeze` to the `buttonAttributes` object, we can see that a read-only modifier is being inferred on this object:

```typescript
type ButtonType = "button" | "submit" | "reset";

const buttonAttributes = Object.freeze({
  cancel: {
    type: "button" as ButtonType,
  },
  confirm: {
    type: "button" as ButtonType,
  },
});

// hovering over buttonAttributes shows:
const buttonAttributes: Readonly<{
  cancel: {
    type: "button";
  };
  confirm: {
    type: "button";
  };
}>
```

However, it's only working at the top level of the object. For example, if we add another type at the top level like `type: 'blah'`, the top level property is read-only. If we try to modify this, TypeScript will throw an error: 

```typescript
const buttonAttributes = Object.freeze({
  type: "blah",
  cancel: {
    type: "button" as ButtonType,
  },
  confirm: {
    type: "button" as ButtonType,
  },
});

buttonAttributes.type = "submit"; // red squiggly line under `type`

// Hovering over type shows:
Cannot assign to 'type' because it is a read-only property
```

However, `Object.freeze` doesn't work on nested levels of an object, so we can still modify the `type` property of `cancel` and `confirm`:

```typescript
buttonAttributes.confirm.type = "reset";
```

This behavior is because `Object.freeze` is not recursive; it only works on the top level of the object. Another thing to note about `Object.freeze` is that it runs at runtime, which can make your application slower.

An alternative to `Object.freeze` is using `as const`. When we modify `buttonAttributes` to use `as const` instead of `Object.freeze`, the whole object, including all nested layers, becomes read-only. Moreover, `as const` infers those literals too. 

```typescript
const buttonAttributes = {
  cancel: {
    type: "button" as ButtonType,
  },
  confirm: {
    type: "button" as ButtonType,
  },
} as const;

// Hovering over buttonAttributes shows:
const buttonAttributes: {
  readonly cancel: {
    readonly type: "button";
  };
  readonly confirm: {
    readonly type: "button";
  };
}
```

`As const` does not have any runtime cost and recurses through the object, which makes it preferable over `Object.freeze` unless you need to ensure freezing at runtime specifically. Overall, `as const` provides a more convenient and efficient approach to creating immutable objects in TypeScript than using `Object.freeze`.