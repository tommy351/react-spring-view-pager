import React, { FunctionComponent } from "react";
import { BaseProps } from "./types";
import { ViewPagerCore } from "./ViewPagerCore";

export const FlatViewPager: FunctionComponent<BaseProps> = props => {
  return (
    <ViewPagerCore
      {...props}
      getContainerStyle={({ x }) => ({
        width: "100%",
        height: "100%",
        position: "relative",
        transform: x.interpolate(x => `translateX(${x * -100}%)`)
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
