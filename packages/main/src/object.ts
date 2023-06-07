import * as dot from "dot-prop";

export const getProperty = <T>(object: any, path: string): T | null => {
  if (typeof path !== "string") {
    return null;
  }

  const prop = dot.getProperty(object, path);

  return typeof prop === "number" || typeof prop === "string" ? prop : null;
};
