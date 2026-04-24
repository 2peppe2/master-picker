import { Over } from "@dnd-kit/core";

export interface OnRenderDraggedArgs<T> {
  active: T;
}

export interface OnDragStartArgs<T> {
  active: T | null;
}

export interface OnDragEndArgs {
  over: Over | null;
}

export interface OnDragCancelArgs {
  over: Over | null;
}
