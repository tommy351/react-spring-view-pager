import React, { useRef, ReactNode, useState, useEffect } from "react";
import { animated, useSpring } from "react-spring";
import useMeasure from "react-use-measure";
import { useDrag } from "react-use-gesture";
import bezierEasing from "bezier-easing";
import clamp from "lodash.clamp";

const easeOut = bezierEasing(0.19, 1, 0.22, 1);
const ANGLE = 90;
const MIN_VELOCITY = 0.01;
const EASING_RATIO = 0.25;
const POSITION_THRESHOLD = 0.5;
const VELOCITY_THRESHOLD = 0.5;
const MIN_POSITION_THRESHOLD = 0.05;

function noop() {
  // do nothing
}

function calcRotateDeg(index: number) {
  return -index * ANGLE;
}

export enum ChildState {
  Entering = "entering",
  Entered = "entered",
  Exiting = "exiting",
  Exited = "exited"
}

export interface ChildProps {
  index: number;
  state: ChildState;
}

export interface ViewPagerProps {
  index: number;
  pageCount: number;
  children(props: ChildProps): ReactNode;
  onChangeIndex?(index: number): void;
}

export default function ViewPager({
  index,
  pageCount,
  children,
  onChangeIndex = noop
}: ViewPagerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { width: containerWidth } = useMeasure(ref);
  const [nextIndex, setNextIndex] = useState(index);

  const [{ rotateDeg }, set] = useSpring(() => ({
    rotateDeg: calcRotateDeg(index)
  }));

  const bind = useDrag(({ movement: [movementX], velocity, last, down }) => {
    const position = clamp(movementX / containerWidth, -1, 1);
    const absPosition = Math.abs(position);
    const canChangeIndex = nextIndex >= 0 && nextIndex < pageCount;
    const rotateDeg = calcRotateDeg(index);

    if (last) {
      const shouldChangeIndex =
        absPosition > POSITION_THRESHOLD ||
        (velocity > VELOCITY_THRESHOLD && absPosition > MIN_POSITION_THRESHOLD);

      if (shouldChangeIndex && canChangeIndex) {
        onChangeIndex(nextIndex);
      } else {
        // Reset nextIndex
        setNextIndex(index);
        set({
          rotateDeg,
          immediate: false
        });
      }
    } else if (down && velocity > MIN_VELOCITY) {
      const offsetPos = canChangeIndex
        ? position
        : position * easeOut(absPosition) * EASING_RATIO;

      setNextIndex(position > 0 ? index - 1 : index + 1);

      set({
        rotateDeg: rotateDeg + offsetPos * ANGLE,
        immediate: true
      });
    }
  });

  useEffect(() => {
    set({
      rotateDeg: calcRotateDeg(index),
      immediate: false
    });
  }, [set, index]);

  function renderPage(pageIndex: number) {
    if (pageIndex < 0 || pageIndex >= pageCount) return;

    const state = (() => {
      if (pageIndex === index) {
        if (pageIndex === nextIndex) return ChildState.Entered;
        return ChildState.Exiting;
      }

      if (pageIndex === nextIndex) return ChildState.Entering;
      return ChildState.Exited;
    })();

    return (
      <div
        key={pageIndex}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          transform: `rotateY(${pageIndex *
            ANGLE}deg) translateZ(${containerWidth / 2}px)`
        }}
      >
        {children({
          index: pageIndex,
          state
        })}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        perspective: `${containerWidth * 2}px`
      }}
    >
      <animated.div
        {...bind()}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          transform: rotateDeg.interpolate(
            v => `translateZ(${containerWidth / -2}px) rotateY(${v}deg)`
          )
        }}
      >
        {renderPage(index - 1)}
        {renderPage(index)}
        {renderPage(index + 1)}
      </animated.div>
    </div>
  );
}
