# Parsing YAML files from a git repo with validation

This TypeScript script clones a GitHub repository, reads and validates YAML files in the repository according to the `Gates` schema, and saves the data in a JSON file locally.

```ts
import fs from "fs/promises";
import path from "path";
import { simpleGit } from "simple-git";
import { dir as tmpDir } from "tmp-promise";
import { validate, yaml } from "@radekstepan/flare-utils";

// Repo to clone
const repo = "git@github.com:radekstepan/flare.git";

// The path where to save the output
const savePath = path.join(`${process.cwd()}/data.json`);
```

The above section is responsible for importing the necessary modules and defining the repository URL and the output save path. The `repo` constant is the SSH URL of the GitHub repository to clone, and the `savePath` constant is the location where the JSON file will be saved after processing the YAML files. 

```ts
async function job() {
  // Create a temporary directory
  const { path: tempDirPath } = await tmpDir();

  // Clone the repo into the temporary directory
  await simpleGit().clone(repo, tempDirPath);

  // Change current working directory to the cloned repo
  process.chdir(tempDirPath);

  // Initialize a git instance with the path to the cloned repo
  const git = simpleGit(tempDirPath);

  // Check out the master branch
  await git.checkout("master");
```

The `job` function begins by creating a temporary directory using `tmp-promise`. It then clones the repository into this temporary directory using `simple-git`. After cloning, it changes the current working directory to the cloned repository's location. The `simpleGit` instance `git` is then used to switch to the 'master' branch.

```ts
  // Parse all the YAML files.
  const data = await yaml.readYamlGates("**/fixtures/**/*.yml");
```

This line uses the `readYamlGates` function from `@radekstepan/flare-utils` to read and parse all YAML files located in 'fixtures' directory or any of its subdirectories.

```ts
  // Validate the gates.
  await validate.validateGates(data);
```

The `validateGates` function from `@radekstepan/flare-utils` is used to validate the parsed YAML data making sure it matches the `Gates` schema.

```ts
  // And save.
  await fs.writeFile(savePath, JSON.stringify(data));
}
```

Lastly, the validated YAML data is converted into a JSON string using `JSON.stringify()` and then saved to a file using `fs.writeFile()`. The file will be saved at the path defined by `savePath`.

```ts
job();
```

This line calls the `job` function to start the execution of the script.
