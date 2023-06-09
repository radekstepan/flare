import test from "ava";
import { Operation, Kind, type Gate } from "@radekstepan/flare-types";
import { validateGates } from "../src/validate.js";

const goodGate: Gate = {
  eval: "true",
  conditions: [
    {
      id: "foo",
      operation: Operation.EXCLUDE,
      kind: Kind.CONTEXT,
      path: "valid.path",
      value: ["1"],
    },
  ],
};
const badGate = {
  eval: "true",
} as Gate;

test("should throw an error on invalid input data", async (t) => {
  const [res] = await Promise.allSettled([
    validateGates([
      {
        goodGate,
        badGate,
      },
    ]),
  ]);

  t.like(res, {
    status: "rejected",
    reason: '"[0].badGate.conditions" is required',
  });
});

test("should return the input gates when succesful", async (t) => {
  const [res] = await Promise.allSettled([
    validateGates([
      {
        goodGate,
      },
    ]),
  ]);

  t.like(res, {
    status: "fulfilled",
    value: [{ goodGate }],
  });
});
