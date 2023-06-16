import type { Gates } from "@radekstepan/flare-types";
import { serializeError } from "serialize-error";
import { gatesSchema } from "./schema.js";

export const validateGates = async (gates: Gates): Promise<Gates> =>
  gatesSchema.validateAsync(gates).catch((error) => {
    const { message } = serializeError(error);
    return Promise.reject(message);
  });
