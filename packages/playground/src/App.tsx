import React from "react";
import Editor from "./Editor";
import Output from "./Output";
import * as examples from "./examples";
import "./app.less";

function App() {
  return (
    <div className="page">
      <div className="title">flare</div>
      <div className="em">Feature Flag Loading and Runtime Evaluation</div>
      <div className="section">
        Flare is a dynamic gating library that evaluates conditions based on
        input contexts. The package allows you to set up gates using various
        conditions and evaluate these conditions based on a given input. The
        package provides a promise-based API that is highly flexible and easy to
        use in any JavaScript or TypeScript project.
      </div>
      <div className="section">
        <div className="subtitle">YAML Gates</div>
        <div>Enter your YAML gates, specifying conditions and operations.</div>
        <Editor value={examples.yaml} lang="yaml" />
      </div>
      <div className="section">
        <div className="subtitle">Context</div>
        <div>Enter the JSON context that will be used for evaluation.</div>
        <Editor value={examples.json} lang="json" />
      </div>
      <div className="section">
        <div className="button">&#9658; Run</div>
      </div>
      <div className="section">
        <Output />
      </div>
    </div>
  );
}

export default App;
