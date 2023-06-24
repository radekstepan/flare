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

  const { loading, error, value } = useAsync(async () => {
    const gates = load(yamlGates) as Gates;
    await validate.validateGates(gates);
    const n = Object.keys(gates).length;
    if (!context) {
      return { n };
    }
    const flare = new Flare(gates);
    const res = await flare.evaluateAll(JSON.parse(context) as Context, true);
    return { n, evaluated: JSON.stringify(res, null, 2) };
  }, [yamlGates, context]);

  return (
    <div className="output">
      {!loading && (
        <>
          {error && <pre className="block error">{error.toString()}</pre>}
          {value && (
            <>
              <span className="block success">
                YAML gate{value.n > 1 && "s"} pass{value.n < 2 && "es"}{" "}
                validation
              </span>
              {value.evaluated && (
                <pre className="block">{value.evaluated}</pre>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Output;
