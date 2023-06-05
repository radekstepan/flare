import type { PathLike } from "fs";
import { readFile, stat, readdir } from "fs/promises";
import { join, extname, basename } from "path";
import { load } from "js-yaml";
import type { Data } from "@radekstepan/flare-types";

const readYamlFile = async <T>(path: PathLike): Promise<T> => {
  const yaml = await readFile(path);
  return load(yaml.toString()) as T;
};

const YAML_EXT = [".yml", ".yaml"];

export const readYamlPath = async <T>(
  path: PathLike
): Promise<Record<string, T>> => {
  const stats = await stat(path);
  const pathString = path.toString();

  if (stats.isFile() && YAML_EXT.includes(extname(pathString))) {
    return { [basename(pathString)]: await readYamlFile(path) };
  }

  if (stats.isDirectory()) {
    const dirents = await readdir(path);
    const results = await Promise.all(
      dirents.map(async (dirent) => {
        const fullPath = join(pathString, dirent);
        return readYamlPath(fullPath);
      })
    );

    return Object.assign({}, ...results);
  }

  return {};
};

export const readYamlData = async <T = Data>(path: PathLike): Promise<T> => {
  const files = await readYamlPath<T>(path);
  const result = {};
  for (const file in files) {
    Object.assign(result, files[file]);
  }
  return result as T;
};
