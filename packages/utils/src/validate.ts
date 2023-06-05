import type { Gates } from "@radekstepan/flare-types";
import { serializeError } from "serialize-error";
import { gateSchema } from "./schema.js";

export class GateSchemaError extends Error {
  gate: string;

  constructor(gate: string, message?: string) {
    super(message);
    this.gate = gate;

    Object.setPrototypeOf(this, GateSchemaError.prototype);
  }
}

export const validateGates = async (gates: Gates) => {
  return Promise.all(
    Object.entries(gates).map(([name, gate]) =>
      gateSchema.validateAsync(gate).catch((error) => {
        const { message } = serializeError(error);
        throw new GateSchemaError(name, message);
      })
    )
  );
};
