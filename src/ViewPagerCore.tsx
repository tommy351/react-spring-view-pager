import React, {
  FunctionComponent,
  useEffect,
  useState,
  useRef,
  CSSProperties
} from "react";
import { animated, useSpring } from "react-spring";
import { useDrag } from "react-use-gesture";
import useMeasure from "react-use-measure";
import clamp from "lodash.clamp";
import { BaseProps, ChildState } from "./types";

export interface GetStyleInput {
  index: number;
  position: number;
  velocity: number;
}

export interface ViewPagerCoreProps extends BaseProps {
  getContainerStyle(input: GetStyleInput): CSSProperties;
  getChildStyle(input: GetStyleInput): CSSProperties;
}

export const ViewPagerCore: FunctionComponent<ViewPagerCoreProps> = ({
  index,
  pageCount,
  children,
  onPageChange,
  getContainerStyle,
  getChildStyle,
  minVelocity = 0.01,
  velocityThreshold = 0.5,
  minMovement = 0.05,
  movementThreshold = 0.5
}) => {
  function getDefaultContainerStyle(index: number) {
    return {
      ...getContainerStyle({ index, position: 0, velocity: 0 }),
      immediate: false
    };
  }

  function isValidIndex(index: number) {
    return index >= 0 && index < pageCount;
  }

  const ref = useRef<HTMLDivElement>(null);
  const { width: containerWidth } = useMeasure(ref);
  const [nextIndex, setNextIndex] = useState(index);
  const [props, set] = useSpring(() => getDefaultContainerStyle(index));

  const bind = useDrag(({ movement: [movementX], last, down, velocity }) => {
    const position = clamp(movementX / containerWidth, -1, 1);
    const absPosition = Math.abs(position);

    if (last) {
      const isQuickMovement =
        velocity > velocityThreshold && absPosition > minMovement;
      const shouldChangeIndex =
        absPosition > movementThreshold || isQuickMovement;

      if (shouldChangeIndex && isValidIndex(nextIndex)) {
        onPageChange(nextIndex);
      } else {
        setNextIndex(index);
        set(getDefaultContainerStyle(index));
      }
    } else if (down && velocity > minVelocity) {
      setNextIndex(position > 0 ? index - 1 : index + 1);

      set({
        ...getContainerStyle({ index, position, velocity }),
        immediate: true
      });
    }
  });

  useEffect(() => {
    set(getDefaultContainerStyle(index));
  }, [index]);

  function getPageState(pageIndex: number) {
    if (pageIndex === index) {
      return pageIndex === nextIndex ? ChildState.Entered : ChildState.Exiting;
    }

    return pageIndex === nextIndex ? ChildState.Entering : ChildState.Exited;
  }

  return (
    <animated.div {...bind()} ref={ref} style={props}>
      {[index - 1, index, index + 1].filter(isValidIndex).map(i => (
        <div
          key={i}
          style={getChildStyle({ index: i, position: 0, velocity: 0 })}
        >
          {children({ index: i, state: getPageState(i) })}
        </div>
      ))}
    </animated.div>
  );
};
