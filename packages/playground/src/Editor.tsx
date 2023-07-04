import React, { type FC } from "react";
import CodeEditor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-json";
import { useAtom, type Atom } from "jotai";

interface Props {
  lang: "yaml" | "json";
  atom: Atom<string>;
}

const Editor: FC<Props> = ({ lang, atom }) => {
  const [text, setText] = useAtom(atom);

  return (
    <CodeEditor
      className="editor"
      value={text}
      onValueChange={setText}
      highlight={(code) => Prism.highlight(code, Prism.languages[lang], lang)}
      padding={10}
      style={{
        fontFamily: '"Fira Code", monospace',
        fontSize: 12,
      }}
    />
  );
};

export default Editor;
