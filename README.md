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

The Flare class is the main export of this package. It is used to create a new Flare instance. You need to provide a Data object or a Promise resolving to a Data object in the constructor. The Data object contains gate definitions that are compiled and stored for evaluation.

```ts
import Flare from "@radekstepan/flare";

const data = Promise.resolve({
  gate1: {
    conditions: [{...}], // Define conditions here
    eval: '{...}' // Expression to evaluate
  },
  //...more gates
});

const flare = new Flare(data);
```

See the schema definition in `flare-utils` for how to structure the gates and their conditions. Alternatively, see the the test fixtures in this project or the recipes folder.

### Evaluating Gates

You can evaluate a specific gate or all gates using the `evaluate` and `evaluateAll` methods respectively. Both methods return a Promise resolving to an object with gate names as keys and the result of their evaluation as values.

```js
flare.evaluate("gate1", inputContext)
  .then(result => console.log(result));

flare.evaluateAll(inputContext)
  .then(result => console.log(result));
```

### Validating input, YAML files

Validate input data containing gate config against a schema or to load config from YAML files see `flare-utils`.
