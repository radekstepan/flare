import React, { type FC } from "react";
import CodeEditor from "react-simple-code-editor";
// @ts-expect-error
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-json";

interface Props {
  value: string;
  lang: string;
}

const Editor: FC<Props> = ({ value, lang }) => {
  const [code, setCode] = React.useState(value);

  return (
    <CodeEditor
      className="editor"
      value={code}
      onValueChange={(code) => setCode(code)}
      highlight={(code) => highlight(code, languages[lang])}
      padding={10}
      style={{
        fontFamily: '"Fira Code", monospace',
        fontSize: 12,
      }}
    />
  );
};

export default Editor;
