import React, {
  FunctionComponent,
  useEffect,
  useState,
  useCallback,
  useRef,
  CSSProperties
} from "react";
import { animated, useSpring } from "react-spring";
import { useDrag } from "react-use-gesture";
import useMeasure, { DOMRectReadOnly } from "use-measure";
import clamp from "lodash.clamp";
import { BaseProps, ChildState } from "./types";

export interface GetContainerStyleInput {
  index: number;
  position: number;
  velocity: number;
  rect: DOMRectReadOnly;
}

export interface GetChildStyleInput {
  index: number;
  rect: DOMRectReadOnly;
}

export interface ViewPagerCoreProps extends BaseProps {
  getContainerStyle(input: GetContainerStyleInput): CSSProperties;
  getChildStyle(input: GetChildStyleInput): CSSProperties;
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
  movementThreshold = 0.5,
  resistance = true
}) => {
  function isValidIndex(index: number) {
    return index >= 0 && index < pageCount;
  }

  const ref = useRef<HTMLDivElement>(null);
  const rect = useMeasure(ref);
  const [nextIndex, setNextIndex] = useState(index);

  const getDefaultContainerStyle = useCallback(() => {
    return {
      ...getContainerStyle({ index, position: 0, velocity: 0, rect }),
      immediate: false
    };
  }, [index, rect]);

  const [props, set] = useSpring(() => getDefaultContainerStyle());

  const bind = useDrag(({ movement: [movementX], last, down, velocity }) => {
    const canChangeIndex = isValidIndex(nextIndex);
    const relativeMovement = clamp(movementX / rect.width, -1, 1);
    const position =
      !canChangeIndex && resistance
        ? Math.log(1 + relativeMovement * 0.4)
        : relativeMovement;
    const absPosition = Math.abs(position);

    if (last) {
      const isQuickMovement =
        velocity > velocityThreshold && absPosition > minMovement;
      const shouldChangeIndex =
        absPosition > movementThreshold || isQuickMovement;

      if (shouldChangeIndex && canChangeIndex) {
        onPageChange(nextIndex);
      } else {
        setNextIndex(index);
        set(getDefaultContainerStyle());
      }
    } else if (down && velocity > minVelocity) {
      setNextIndex(position > 0 ? index - 1 : index + 1);

      set({
        ...getContainerStyle({ index, position, velocity, rect }),
        immediate: true
      });
    }
  });

  useEffect(() => {
    set(getDefaultContainerStyle());
  }, [set, index, getDefaultContainerStyle]);

  function getPageState(pageIndex: number) {
    if (pageIndex === index) {
      return pageIndex === nextIndex ? ChildState.Entered : ChildState.Exiting;
    }

    return pageIndex === nextIndex ? ChildState.Entering : ChildState.Exited;
  }

  return (
    <animated.div {...bind()} ref={ref} style={props}>
      {[index - 1, index, index + 1].filter(isValidIndex).map(i => (
        <div key={i} style={getChildStyle({ index: i, rect })}>
          {children({ index: i, state: getPageState(i) })}
        </div>
      ))}
    </animated.div>
  );
};
