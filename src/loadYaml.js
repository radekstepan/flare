import { readFileSync } from "fs";
import { normalize } from "path";
import { load } from "js-yaml";

const loadYaml = (name) => {
  const yaml = readFileSync(normalize(`${__dirname}/../fixtures/${name}.yml`));
  return load(yaml);
};

export default loadYaml;
