import React, { useCallback, useState, useEffect, type FC } from "react";
import { load, dump } from "js-yaml";
import { useAtom } from "jotai";
import { gatesInput } from "./atoms";

interface Props {}

const Convert: FC<Props> = () => {
  const [text, setText] = useAtom(gatesInput);
  const [json, setJson] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
    try {
      const obj = JSON.parse(text);
      setJson(obj);
    } catch {
      setJson(false);
    }
  }, [text]);

  const onConvert = useCallback(() => {
    try {
      let output;
      if (json) {
        output = dump(json, { quotingType: '"' });
        setText(output);
      } else {
        output = load(text);
        setText(JSON.stringify(output, null, 2));
      }
    } catch {
      setError(true);
    }
  }, [json, text, setText]);

  return (
    <div id="convert">
      <div className={error ? "error" : "link"} onClick={onConvert}>
        Convert to {json ? "YAML" : "JSON"}
      </div>
    </div>
  );
};

export default Convert;
