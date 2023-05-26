import { readFile } from "fs/promises";
import { normalize } from "path";
import { load } from "js-yaml";
import type { Data } from "./interfaces";

const loadYaml = async (name: string): Promise<Data> => {
  const yaml = await readFile(
    normalize(`${__dirname}/../fixtures/${name}.yml`)
  );
  return load(yaml.toString()) as Data;
};

export default loadYaml;
