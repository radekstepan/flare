import type { PathLike } from "fs";
import { readFile } from "fs/promises";
import { load } from "js-yaml";
import type { Data } from "@radekstepan/flare-types";

export const readYaml = async <T = Data>(path: PathLike): Promise<T> => {
  const yaml = await readFile(path);
  return load(yaml.toString()) as T;
};
