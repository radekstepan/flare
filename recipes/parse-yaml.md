# Parsing YAML files

This guide demonstrates an example of utilizing the `@radekstepan/flare` library to evaluate feature flags. The source of the gate data is a set of YAML files.

```ts
import { Flare } from "@radekstepan/flare";
import { yaml } from "@radekstepan/flare-utils";
```

This section imports the necessary modules from the `@radekstepan/flare` library, including `Flare` for feature flag evaluation and `yaml` for parsing YAML files.

```ts
const data = yaml.readYamlGates('fixtures/*.yml');
```

On this line, we're using the `readYamlGates` function to parse YAML files located in the fixtures directory (indicated by the `fixtures/*.yml` [glob](https://github.com/isaacs/node-glob#readme) pattern). The paths are relative to the current working directory.

This function provides the data wrapped in a Promise.

```ts
const flare = new Flare(data);
```

Armed with this data, we can now instantiate a new `Flare` class object. This object accepts the Promise-containing data as an argument.

```ts
flare.evaluateAll({company: "acme"}).then((res) => {
  console.log(res);
});
```

Finally, we're calling the `evaluateAll` method on our flare instance. This method evaluates the data based on some context - in this case, the context is `{company: "acme"}`.
