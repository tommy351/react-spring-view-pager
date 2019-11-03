import { ReactNode } from "react";

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

export interface BaseProps {
  index: number;
  pageCount: number;
  onPageChange(index: number): void;
  children(props: ChildProps): ReactNode;
  minVelocity?: number;
  velocityThreshold?: number;
  minMovement?: number;
  movementThreshold?: number;
  resistance?: boolean;
}
