import React, {
  FunctionComponent,
  useEffect,
  useState,
  useRef,
  CSSProperties
} from "react";
import { animated, useSpring, AnimatedValue } from "react-spring";
import { useDrag } from "react-use-gesture";
import useMeasure, { DOMRectReadOnly } from "use-measure";
import clamp from "lodash.clamp";
import { BaseProps, ChildState } from "./types";

function noop() {
  //
}

interface GetStyleAnimatedValue {
  x: number;
}

export interface GetContainerStyleInput
  extends AnimatedValue<GetStyleAnimatedValue> {
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
  const [currentIndex, setCurrentIndex] = useState(index);
  const [nextIndex, setNextIndex] = useState(index);

  const [props, set] = useSpring(() => ({
    x: currentIndex
  }));

  const bind = useDrag(
    ({ movement: [movementX], first, last, down, velocity }) => {
      const canChangeIndex = isValidIndex(nextIndex);
      const relativeMovement = clamp(movementX / rect.width, -1, 1);
      const position =
        !canChangeIndex && resistance
          ? Math.log(1 + relativeMovement * 0.4)
          : relativeMovement;
      const absPosition = Math.abs(position);

      if (first) {
        setCurrentIndex(index);
      }

      if (last) {
        const isQuickMovement =
          velocity > velocityThreshold && absPosition > minMovement;
        const shouldChangeIndex =
          absPosition > movementThreshold || isQuickMovement;

        if (shouldChangeIndex && canChangeIndex) {
          onPageChange(nextIndex);
        } else {
          set({
            x: currentIndex,
            immediate: false,
            onStart: noop,
            onRest() {
              setNextIndex(currentIndex);
            }
          });
        }
      } else if (down && velocity > minVelocity) {
        set({
          x: currentIndex - position,
          immediate: true,
          onStart() {
            setNextIndex(position > 0 ? currentIndex - 1 : currentIndex + 1);
          },
          onRest: noop
        });
      }
    }
  );

  useEffect(() => {
    set({
      x: index,
      immediate: false,
      onStart() {
        setNextIndex(index);
      },
      onRest() {
        setCurrentIndex(index);
      }
    });
  }, [set, index]);

  useEffect(() => {
    if (index !== currentIndex && index !== nextIndex) {
      setCurrentIndex(nextIndex);
    }
  }, [index, currentIndex, nextIndex]);

  function getPageState(pageIndex: number) {
    if (pageIndex === currentIndex) {
      return pageIndex === nextIndex ? ChildState.Entered : ChildState.Exiting;
    }

    return pageIndex === nextIndex ? ChildState.Entering : ChildState.Exited;
  }

  return (
    <animated.div
      {...bind()}
      ref={ref}
      style={getContainerStyle({ ...props, rect })}
    >
      {[currentIndex - 1, currentIndex, currentIndex + 1]
        .filter(isValidIndex)
        .map(i => (
          <div key={i} style={getChildStyle({ rect, index: i })}>
            {children({ index: i, state: getPageState(i) })}
          </div>
        ))}
    </animated.div>
  );
};
