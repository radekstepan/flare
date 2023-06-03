import jexl from "jexl";
import { Eval } from "./interfaces.js";

const compile = (expr: string): Eval => {
  switch (expr) {
    case "true":
      return () => Promise.resolve(true);
    case "false":
      return () => Promise.resolve(false);
    default:
      const compiled = jexl.compile(expr);
      return compiled.eval.bind(compiled);
  }
};

export default compile;
