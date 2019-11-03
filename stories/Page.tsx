import React, { FunctionComponent } from "react";

interface PageProps {
  index: number;
  pageCount: number;
}

export const Page: FunctionComponent<PageProps> = ({ index, pageCount }) => {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        backgroundColor: `hsl(${(index * 360) / pageCount}, 50%, 50%)`
      }}
    >
      <span style={{ fontSize: "50px" }}>{index}</span>
    </div>
  );
};
