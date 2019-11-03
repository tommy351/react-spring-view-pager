import React, { FunctionComponent } from "react";
import { BaseProps } from "./types";
import { ViewPagerCore } from "./ViewPagerCore";

export const FlatViewPager: FunctionComponent<BaseProps> = props => {
  return (
    <ViewPagerCore
      {...props}
      getContainerStyle={({ index, position }) => ({
        width: "100%",
        height: "100%",
        position: "relative",
        transform: `translateX(${(-index + position) * 100}%)`
      })}
      getChildStyle={({ index }) => ({
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: `${index * 100}%`
      })}
    />
  );
};
