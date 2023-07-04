import React from "react";
import Editor from "./Editor";
import Convert from "./Convert";
import Output from "./Output";
import { gatesInput, contextInput } from "./atoms";

function App() {
  return (
    <div className="page">
      <div className="title">
        <a href="https://github.com/radekstepan/flare" target="_blank">
          flare
        </a>
      </div>
      <div className="em">Feature Flag Loading and Runtime Evaluation</div>
      <div className="section">
        Flare is a dynamic gating library that evaluates conditions based on
        input contexts. The package allows you to set up gates using various
        conditions and evaluate these conditions based on a given input.
      </div>
      <div className="section">
        <div className="subtitle">YAML Gates</div>
        <Convert />
        <div>Enter your YAML gates, specifying conditions and operations.</div>
        <Editor lang="yaml" atom={gatesInput} />
      </div>
      <div className="section">
        <div className="subtitle">Context</div>
        <div>Enter the JSON context that will be used for evaluation.</div>
        <Editor lang="json" atom={contextInput} />
      </div>
      <div className="section">
        <Output />
      </div>
    </div>
  );
}

export default App;
