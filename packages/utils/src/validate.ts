import type { Data } from "@radekstepan/flare-types";
import { serializeError } from "serialize-error";
import { gatesSchema } from "./schema.js";

export const validateGates = async (data: Data): Promise<Data> =>
  gatesSchema.validateAsync(data).catch((error) => {
    const { message } = serializeError(error);
    return Promise.reject(message);
  });
