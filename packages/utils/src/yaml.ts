import { readFile } from "fs/promises";
import { glob, type GlobOptions } from "glob";
import type { PathBase } from "path-scurry";
import { load } from "js-yaml";
import type { Gates } from "@radekstepan/flare-types";

export const readYamlFile = async <T>(
  path: string | PathBase
): Promise<[string, T]> => {
  const fullPath = typeof path === "string" ? path : path.fullpath();
  const yaml = await readFile(fullPath);
  return [fullPath, load(yaml.toString()) as T];
};

export const readYamlPath = async <T>(
  pattern: string | string[],
  options?: GlobOptions
): Promise<Record<string, T>> => {
  const paths = await (options ? glob(pattern, options) : glob(pattern));

  const results = await Promise.all(paths.map((path) => readYamlFile<T>(path)));

  return Object.fromEntries(results);
};

export const readYamlGates = async <T = Gates>(
  pattern: string | string[],
  options?: GlobOptions
): Promise<T> => {
  const files = await readYamlPath<T>(pattern, options);
  const result = {};
  for (const file in files) {
    Object.assign(result, files[file]);
  }
  return result as T;
};
