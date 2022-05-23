import React, {
  useEffect,
  useState,
  CSSProperties,
  ComponentProps
} from "react";
import { animated, useSpring, SpringValue } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import useMeasure, { RectReadOnly } from "react-use-measure";
import clamp from "lodash.clamp";
import { BaseProps, ChildState } from "./types";

function noop() {
  //
}

interface GetStyleAnimatedValue {
  x: SpringValue<number>;
}

export interface GetContainerStyleInput extends GetStyleAnimatedValue {
  rect: RectReadOnly;
}

export interface GetChildStyleInput {
  index: number;
  rect: RectReadOnly;
}

export interface ViewPagerCoreProps extends BaseProps {
  getContainerStyle(
    input: GetContainerStyleInput
  ): ComponentProps<typeof animated.div>["style"];
  getChildStyle(input: GetChildStyleInput): CSSProperties;
}

export const ViewPagerCore = ({
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
}: ViewPagerCoreProps) => {
  function isValidIndex(index: number) {
    return index >= 0 && index < pageCount;
  }

  const [ref, rect] = useMeasure();
  const [currentIndex, setCurrentIndex] = useState(index);
  const [nextIndex, setNextIndex] = useState(index);

  const [props, api] = useSpring(() => ({
    x: currentIndex,
    // Disable initial animation
    immediate: true
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

      // Set the current index when drag started
      if (first) {
        setCurrentIndex(index);
      }

      if (last) {
        const isQuickMovement =
          velocity[0] > velocityThreshold && absPosition > minMovement;
        const shouldChangeIndex =
          absPosition > movementThreshold || isQuickMovement;

        if (shouldChangeIndex && canChangeIndex) {
          onPageChange(nextIndex);
        } else {
          api.start({
            x: currentIndex,
            immediate: false,
            onStart: noop,
            onRest() {
              setNextIndex(currentIndex);
            }
          });
        }
      } else if (down && velocity[0] > minVelocity) {
        api.start({
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

  // Set props when the index changed
  useEffect(() => {
    api.start({
      x: index,
      immediate: false,
      onStart() {
        setNextIndex(index);
      },
      onRest() {
        setCurrentIndex(index);
      }
    });
  }, [api, index]);

  // Set immediate to true when resized
  useEffect(() => {
    api.start({
      immediate: true
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rect]);

  // Force update currentIndex when the index changed too fast
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
      style={{
        ...getContainerStyle({ ...props, rect }),
        touchAction: "pan-y"
      }}
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
