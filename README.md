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

See the schema definition in `packages/utils/` for how to structure the gates and their conditions. Alternatively, see the the test fixtures in the `packages/main/` project or the `recipes/` folder for examples.

You can evaluate a specific gate or all gates using the `evaluate` and `evaluateAll` methods respectively. Both methods return a Promise resolving to an object with gate names as keys and the result of their evaluation as values.

```js
flare.evaluate("gate1", context)
  .then(result => console.log(result));

flare.evaluateAll(context)
  .then(result => console.log(result));
```

### Recipes

1. [Basic example with data validation](recipes/basic-with-validation.md)
2. [Adjusting YAML gates](recipes/yaml-gates.md)
3. [Parsing YAML files](recipes/parse-yaml.md)
4. [Glob patterns](recipes/glob-patterns.md)
5. [Parsing YAML files from a git repo with validation](recipes/git-parse-yaml-with-validation.md)

### Benchmark

This benchmark was conducted using a script located in the `packages/benchmark` directory, executed on a system equipped with a Ryzen 5 3600 processor and running Ubuntu for Windows Subsystem for Linux (WSL). The script utilizes [autocannon](https://github.com/mcollina/autocannon), running it against a Node HTTP server that evaluates Flare gates on each request.

The benchmark results displayed below indicate the performance metrics for varying numbers of gates (_n_ gates), with each gate having 10 conditions and each condition having 1,000 values.

| Gates _n_            | 0       | 1       | 10      | 20      | 50      |
|----------------------|---------|---------|---------|---------|---------|
| Avg Requests/sec     | 63,489  | 14,574  | 6,450   | 4,157   | 1,845   |
| Avg Latency (ms)     | 0.01    | 0.11    | 1.14    | 2.10    | 4.90    |
| Std Dev Latency (ms) | 0.08    | 0.34    | 0.43    | 0.81    | 1.61    |
| Boot Time (ms)       | 2       | 6       | 34      | 62      | 144     |

Please note that the "Boot Time" value denotes the time it takes to launch an HTTP server, load all `Gates` from a JSON file, compile all the expressions, and convert the list of values for each gate condition into sets.

Furthermore, the methods `flare.evaluate` and `flare.evaluateAll` are non-blocking. They return a promise that resolves once the input `Gates` have finished loading.
