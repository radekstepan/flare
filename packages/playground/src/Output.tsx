import React from "react";
import { useAsync } from "react-use";
import { load } from "js-yaml";
import { useAtomValue } from "jotai";
import { Flare } from "@radekstepan/flare";
import { validate } from "@radekstepan/flare-utils";
import type { Gates, Context } from "@radekstepan/flare-types";
import { gatesInput, contextInput } from "./atoms";

function Output() {
  const yamlGates = useAtomValue(gatesInput);
  const context = useAtomValue(contextInput);

  const state = useAsync(async () => {
    if (!context) {
      return;
    }
    const gates = load(yamlGates) as Gates;
    await validate.validateGates(gates);
    const flare = new Flare(gates);
    const res = await flare.evaluateAll(JSON.parse(context) as Context);
    return JSON.stringify(res, null, 2);
  }, [yamlGates, context]);

  return (
    <div className="output">
      {!state.loading && (
        <>
          {state.error ? (
            <pre className="block error">{state.error.toString()}</pre>
          ) : (
            <span className="block success">YAML gates pass validation</span>
          )}
          {state.value && <pre className="block">{state.value}</pre>}
        </>
      )}
    </div>
  );
}

export default Output;
