import { GateSchemaError, validateData } from "../utils";
import { InputGate } from "../interfaces";

describe("object", () => {
  describe("validateData", () => {
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

    test("Should throw an error on invalid input data", () => {
      const error = new GateSchemaError("badGate", '"conditions" is required');

      return expect(
        validateData({
          goodGate,
          badGate,
        })
      ).rejects.toThrow(error);
    });
  });
});
