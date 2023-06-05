# flare-utils

## Installation

```bash
yarn add @radekstepan/flare-utils
```

## Usage

### Gate schema validator

Validate input `Gates` containing gate config against a schema to make sure it is properly formatted for `flare`. If the validation fails, it throws a `GateSchemaError` with the gate name and error message.

```ts
import {validate} from "@radekstepan/flare-utils";

const gates = {
  gate1: {
    conditions: [{...}], // Define conditions here
    eval: '{...}' // Expression to evaluate
  },
  //...more gates
};

validate.validateGates(gates).then(() => {
  // Everything is OK
});
```

### Read YAML gates

The `readYamlGates` function accepts a path to a YAML file (or a directory containing YAML files) and returns a promise which resolves to the `Gates` object. This is useful for reading gate schemas stored in YAML files.

```ts
import { yaml } from "@radekstepan/flare-utils";

yaml.readYamlGates(pathLike).then((gates) => {
  // Save the gates to the disk or pass it to flare directly
});
```
