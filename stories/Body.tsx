import React, { FunctionComponent } from "react";

export const Body: FunctionComponent = ({ children }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%"
      }}
    >
      {children}
    </div>
  );
};
