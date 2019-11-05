import React, { FunctionComponent } from "react";
import { BaseProps } from "./types";
import { ViewPagerCore } from "./ViewPagerCore";

const ANGLE = 90;

export const CubeViewPager: FunctionComponent<BaseProps> = props => {
  return (
    <ViewPagerCore
      {...props}
      getContainerStyle={({ x, rect: { width } }) => ({
        width: "100%",
        height: "100%",
        position: "relative",
        transformStyle: "preserve-3d",
        transform: x.interpolate(
          x =>
            `perspective(${width * 2}px) translateZ(${width /
              -2}px) rotateY(${x * -ANGLE}deg)`
        )
      })}
      getChildStyle={({ index, rect: { width } }) => ({
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        transform: `rotateY(${index * ANGLE}deg) translateZ(${width / 2}px)`
      })}
    />
  );
};
