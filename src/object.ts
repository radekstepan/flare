import type { InputContextValue, InputContext } from "./interfaces";

export const getProperty = (
  object: InputContext,
  path: string
): InputContextValue | null => {
  if (typeof path !== "string") {
    return null;
  }

  const parts = path.split(".");
  let current: InputContext | InputContextValue = object;
  for (let i = 0; i < parts.length; i++) {
    if (
      current === null ||
      typeof current !== "object" ||
      !(parts[i] in current)
    ) {
      return null;
    }
    current = current[parts[i]];
  }

  return typeof current === "number" || typeof current === "string"
    ? current
    : null;
};
