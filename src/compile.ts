import jexl from "jexl";
import { Eval } from "./interfaces.js";

const compile = (expr: string): Eval => {
  if (expr === "true") {
    return () => Promise.resolve(true);
  } else if (expr === "false") {
    return () => Promise.resolve(false);
  }

  const compiled = jexl.compile(expr);
  return compiled.eval.bind(compiled);
};

export default compile;
