export * as schema from "./schema.js";
export * as validate from "./validate.js";

export const yaml = {
  readYamlGates: () => {
    throw new Error(
      'Not supported in the browser; use e.g. "js-yaml" directly'
    );
  },
};
