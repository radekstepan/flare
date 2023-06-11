import React, { type FC } from "react";
import Typist from "react-typist";

interface Props {}

const Output: FC<Props> = ({}) => {
  return (
    <div className="output">
      <Typist stdTypingDelay={20} avgTypingDelay={35} cursor={{ show: false }}>
        <span className="success">YAML gates pass validation.</span>
      </Typist>
    </div>
  );
};

export default Output;
