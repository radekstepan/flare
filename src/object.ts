import * as dot from "dot-prop";
import type { InputContextValue, InputContext } from "./interfaces.js";

export const getProperty = (
  object: InputContext,
  path: string
): InputContextValue | null => {
  if (typeof path !== "string") {
    return null;
  }

  const prop = dot.getProperty(object, path);

  return typeof prop === "number" || typeof prop === "string" ? prop : null;
};
