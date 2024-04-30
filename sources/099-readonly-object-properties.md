# Problem
Here we have an `updateUser` function which accepts a `user` of type `User`.

The `User` type has three properties: `id`, `name`, and `age`. 

Inside the `updateUser` function, our goal is to allow modifications to the `name` and `age` properties, while ensuring that the `id` remains constant and cannot be changed.

```typescript
type User = {
  id: number;
  name: string;
  age: number;
}

const updateUser = (user: User) => {
    user.name = "Jane Doe";
    user.age = 30;

    // @ts-expect-error Should not be able to modify readonly // red squiggly line under full line
    user.id = 1;
}
```

## Challenge

Your challenge is to figure out how to modify the type definition for `User` to make `id` a read-only property. This will prevent the `id` from being changed, and the error will go away.

# Resolution
The solution to this challenge is pretty straightforward.

TypeScript offers a first-class approach for this by adding the `readonly` keyword before the property, like so: 

```typescript
type User = {
  readonly id: number;
  name: string;
  age: number;
};
```

With this change, the `id` property becomes read-only, whereas the other properties `name` and `age` remain mutable.

Remember, object properties in both TypeScript and JavaScript are mutable by default.

Adding of `readonly` to a property has no runtime effect, but instead is a type annotation that provides crucial information. It informs you that a certain property should not be changed once it is set, which eliminates the risk of unwarranted mutations.

The `readonly` annotation is a tool that more developers should adopt in their type definitions.

In both front-end and back-end applications, where immutability is a foundational concept, direct mutation of objects is often avoided. Therefore, many properties should ideally be set as read-only. 

The `readonly` type annotation is a simple but remarkably handy feature that can protect your code from bugs.