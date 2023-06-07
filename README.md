# flare

> Feature Flag Loading and Runtime Evaluation

Flare is a dynamic gating library that evaluates conditions based on input contexts. The package allows you to set up gates using various conditions and evaluate these conditions based on a given input. The package provides a promise-based API that is highly flexible and easy to use in any JavaScript or TypeScript project.

## Features

- Support for both synchronous and asynchronous condition evaluation.
- Supports complex gating structures through "gates", each containing multiple conditions.
- Provides built-in gate condition operations such as include and exclude.
- Performs evaluation of all gates or individual gates based on the given input context.

## Installation

```bash
yarn add @radekstepan/flare
```

## Usage

The Flare class is the main export of this package. It is used to create a new Flare instance. You need to provide a `Gates` object or a Promise resolving to a `Gates` object in the constructor. The `Gates` object contains gate definitions that are compiled and stored for evaluation.

```ts
import Flare from "@radekstepan/flare";

const gates = Promise.resolve({
  gate1: {
    conditions: [{...}], // Define conditions here
    eval: '{...}' // Expression to evaluate
  },
  //...more gates
});

const flare = new Flare(gates);
```

See the schema definition in `utils/` for how to structure the gates and their conditions. Alternatively, see the the test fixtures in the `main/` project or the `recipes/` folder for examples.

### Evaluating Gates

You can evaluate a specific gate or all gates using the `evaluate` and `evaluateAll` methods respectively. Both methods return a Promise resolving to an object with gate names as keys and the result of their evaluation as values.

```js
flare.evaluate("gate1", context)
  .then(result => console.log(result));

flare.evaluateAll(context)
  .then(result => console.log(result));
```

### Validating gates, YAML files

See `flare-utils` to:
- validate gates against a schema
- load input data from YAML files
