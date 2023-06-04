import type { Data } from "@radekstepan/flare-types";
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

export const validateData = async (data: Data) => {
  return Promise.all(
    Object.entries(data).map(([name, gate]) =>
      gateSchema.validateAsync(gate).catch((error) => {
        const { message } = serializeError(error);
        throw new GateSchemaError(name, message);
      })
    )
  );
};
