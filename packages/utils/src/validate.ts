import type { Gates } from "@radekstepan/flare-types";
import { serializeError } from "serialize-error";
import { gateSchema } from "./schema.js";

export const validateGates = async (gates: Gates) => {
  return Promise.all(
    Object.entries(gates).map(([name, gate]) =>
      gateSchema.validateAsync(gate).catch((error) => {
        const { message } = serializeError(error);
        return Promise.reject(`"${name}.${message.substr(1)}`);
      })
    )
  );
};
