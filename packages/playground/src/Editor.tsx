import React, { type FC } from "react";
import CodeEditor from "react-simple-code-editor";
// @ts-expect-error
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-json";
import { useAtom, type Atom } from "jotai";

interface Props {
  lang: string;
  atom: Atom<string>;
}

const Editor: FC<Props> = ({ lang, atom }) => {
  const [text, setText] = useAtom(atom);

  return (
    <CodeEditor
      className="editor"
      value={text}
      onValueChange={setText}
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
