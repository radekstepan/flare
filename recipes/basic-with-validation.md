# Basic example with data validation

Let's walk through a basic example of using the `@radekstepan/flare` library for feature flag evaluation in TypeScript.

```ts
import { Flare } from "@radekstepan/flare";
import { validate } from "@radekstepan/flare-utils";
// NOTE: only necessary if you use TypeScript
import { Operation, Kind } from "@radekstepan/flare-types";
```

This section imports the necessary modules from the `@radekstepan/flare` library, including `Flare` for feature flag evaluation, `validate` for data validation, and `Operation` and `Kind` from `flare-types` for specifying flag conditions.

```ts
const data = {
  gate1: {
    eval: "user",
    conditions: [
      {
        id: "user",
        operation: Operation.INCLUDE,
        kind: Kind.CONTEXT,
        path: "name",
        value: ["tommy", "johnny"],
      },
    ],
  },
};
```

Here, a sample data object is defined, representing a feature flag named "gate1". It contains a single condition that checks if the user's name (accessed via the `path` property) is either "tommy" or "johnny". This condition uses the `Operation.INCLUDE` operation to determine if the user's name is included in the specified values.

```ts
const flare = new Flare(
  new Promise((resolve, reject) => {
    validate
      .validateData(data)
      .then(() => {
        resolve(data);
      })
      .catch(reject);
  })
);
```

A new instance of the `Flare` class is created, which takes a Promise as its argument. The Promise is used to validate the data object using the `validateData` function from the `flare-utils` module. If the validation is successful, the Promise is resolved with the data object, and if an error occurs, the Promise is rejected.

```js
flare.evaluate("gate1", { name: "johnny" }).then((res) => {
  console.log(res);
});
```

Finally, the `evaluate` method of the `flare` object is called with the flag name ("gate1") and an object representing the user's context ({name: "johnny"}). This method returns a Promise that resolves with the evaluation result. In this example, the result is logged to the console.
