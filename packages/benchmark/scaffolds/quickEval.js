import fs from "node:fs/promises";
import { file } from "tmp-promise";
import { faker } from "@faker-js/faker";
import { validate } from "@radekstepan/flare-utils";

const multiple = (n) => new Array(n).fill(true).map((_, i) => i);

export default async function scaffold(flags) {
  const { path } = await file();

  const gates = multiple(flags.gates).reduce(
    (acc, i) => ({
      ...acc,
      [i + faker.lorem.slug()]: {
        // This skips compiling the expression using jexl.
        eval: "true",
        conditions: multiple(flags.conditions).map((i) => ({
          id: "id" + i + faker.lorem.word(),
          kind: "context",
          operation: "include",
          path: faker.lorem.word(),
          value: multiple(flags.values).map(faker.string.uuid),
        })),
      },
    }),
    {}
  );

  await validate.validateGates(gates);

  await fs.writeFile(path, JSON.stringify(gates));

  return ["servers/flare.js", path];
}
