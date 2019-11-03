import React, { useState } from "react";
import ViewPager from "./ViewPager";

export default {
  component: ViewPager,
  title: "ViewPager"
};

export function simple() {
  const [index, setIndex] = useState(0);
  const pageCount = 5;

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
      <ViewPager index={index} pageCount={pageCount} onChangeIndex={setIndex}>
        {({ index, state }) => (
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
        )}
      </ViewPager>
    </div>
  );
}
