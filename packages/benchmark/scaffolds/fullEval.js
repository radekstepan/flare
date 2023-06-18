import fs from "node:fs/promises";
import { file } from "tmp-promise";
import { faker } from "@faker-js/faker";
import { validate } from "@radekstepan/flare-utils";

export default async function scaffold(flags) {
  const { path } = await file();
  const gates = faker.helpers
    .multiple(
      () => ({
        [faker.lorem.slug()]: {
          // Gets compiled and evaluated using jexl.
          eval: "isCompany && true",
          conditions: [
            {
              id: "isCompany",
              kind: "context",
              operation: "include",
              path: "company",
              value: faker.helpers.multiple(faker.string.uuid, {
                count: flags.values,
              }),
            },
          ],
        },
      }),
      { count: flags.gates }
    )
    .reduce((acc, gate) => Object.assign(acc, { ...gate }), {});

  await validate.validateGates(gates);

  await fs.writeFile(path, JSON.stringify(gates));

  return ["servers/flare.js", path];
}
