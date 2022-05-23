import React from "react";
import { ChildState } from "../src";

interface PageProps {
  index: number;
  state: ChildState;
  pageCount: number;
}

export const Page = ({ index, state, pageCount }: PageProps) => {
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
      <span>{state}</span>
    </div>
  );
};
