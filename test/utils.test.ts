import test from "ava";
import { GateSchemaError, validateData } from "../src/utils.js";
import { InputGate } from "../src/interfaces.js";

const goodGate: InputGate = {
  eval: "true",
  conditions: [
    {
      id: "foo",
      operation: "exclude",
      kind: "context",
      path: "valid.path",
      value: ["1"],
    },
  ],
};
const badGate = {
  eval: "true",
} as InputGate;

test("should throw an error on invalid input data", async (t) => {
  const error = new GateSchemaError("badGate", '"conditions" is required');

  const [res] = await Promise.allSettled([
    validateData({
      goodGate,
      badGate,
    }),
  ]);

  t.like(res, { status: "rejected", reason: error });
});
