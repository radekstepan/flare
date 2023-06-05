# flare-utils

## Installation

```bash
yarn add @radekstepan/flare-utils
```

## Usage

### Gate schema validator

Validate input data containing gate config against a schema to make sure it is properly formatted for `flare`. If the validation fails, it throws a `GateSchemaError` with the gate name and error message.

```ts
import {validate} from "@radekstepan/flare-utils";

const data = {
  gate1: {
    conditions: [{...}], // Define conditions here
    eval: '{...}' // Expression to evaluate
  },
  //...more gates
};

validate.validateData(data).then(() => {
  // Everything is OK
});
```

### Read YAML data

The `readYamlData` function accepts a path to a YAML file (or a directory containing YAML files) and returns a promise which resolves to a `Data` object. This is useful for reading gate schemas stored in YAML files.

```ts
import { yaml } from "@radekstepan/flare-utils";

yaml.readYamlData(pathLike).then((data) => {
  // Save the data to the disk or pass it to flare directly
});
```
