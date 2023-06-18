import fs from "node:fs/promises";
import { file } from "tmp-promise";
import { faker } from "@faker-js/faker";
import { validate } from "@radekstepan/flare-utils";

const multiple = (n) => new Array(n).fill(true).map((_, i) => i);

export default async function scaffold(flags) {
  const { path } = await file();

  const gates = multiple(flags.gates).reduce((acc, i) => ({
    ...acc,
    [i + faker.lorem.slug()]: (() => {
      const conditions = multiple(flags.conditions).map(
        (i) => "id" + i + faker.lorem.word()
      );

      return {
        // Gets compiled and evaluated using jexl.
        eval: conditions.join(" || "),
        conditions: conditions.map((id) => ({
          id: id,
          kind: "context",
          operation: "include",
          path: faker.lorem.word(),
          value: multiple(flags.values).map(faker.string.uuid),
        })),
      };
    })(),
  }));
  await validate.validateGates(gates);

  await fs.writeFile(path, JSON.stringify(gates));

  return ["servers/flare.js", path];
}
