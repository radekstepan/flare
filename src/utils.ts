import { readFile } from "fs/promises";
import { normalize } from "path";
import { load } from "js-yaml";
// TODO use
// import {serializeError} from "serialize-error";
import { gateSchema } from "./schema";
import type { Data } from "./interfaces";

export const readYaml = async <T = Data>(path: string): Promise<T> => {
  const yaml = await readFile(normalize(path));
  return load(yaml.toString()) as T;
};

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
        // const {message} = serializeError(error);
        throw new GateSchemaError(name, error.message);
      })
    )
  );
};
