"use client";

import type {
  HTMLAttributes,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  RefObject,
  TouchEvent as ReactTouchEvent,
} from "react";
import { useEffect, useRef } from "react";

const SWIPE_DISTANCE = 48;
const HORIZONTAL_DOMINANCE = 1.2;
const POST_SWIPE_CLICK_BLOCK_MS = 500;

export type SwipeDirection = "left" | "right";

interface SwipeStart {
  id: number;
  x: number;
  y: number;
}

export type HorizontalSwipeBindings = Pick<
  HTMLAttributes<HTMLDivElement>,
  | "onClickCapture"
  | "onPointerCancelCapture"
  | "onPointerDownCapture"
  | "onPointerUpCapture"
  | "onTouchCancelCapture"
  | "onTouchEndCapture"
  | "onTouchStartCapture"
> & {
  ref: RefObject<HTMLDivElement | null>;
};

interface UseHorizontalSwipeArgs {
  enabled: boolean;
  exclusionSelector: string;
  /**
   * Invoked when a horizontal swipe is completed. Return `true` if it caused a
   * navigation so the trailing synthetic click is suppressed.
   */
  onSwipe: (direction: SwipeDirection) => boolean;
}

interface SwipeDirectionArgs {
  deltaX: number;
  deltaY: number;
}

export const getSwipeDirection = ({
  deltaX,
  deltaY,
}: SwipeDirectionArgs): SwipeDirection | null => {
  const horizontalDistance = Math.abs(deltaX);
  const verticalDistance = Math.abs(deltaY);
  const meetsDistanceThreshold = horizontalDistance >= SWIPE_DISTANCE;
  const isHorizontallyDominant =
    horizontalDistance > verticalDistance * HORIZONTAL_DOMINANCE;

  if (!meetsDistanceThreshold || !isHorizontallyDominant) return null;
  return deltaX < 0 ? "left" : "right";
};

const isExcludedTarget = (
  target: EventTarget | null,
  swipeSurface: HTMLDivElement,
  exclusionSelector: string,
) => {
  if (!(target instanceof Node) || !swipeSurface.contains(target)) return true;

  const element = target instanceof Element ? target : target.parentElement;
  return Boolean(element?.closest(exclusionSelector));
};

export const useHorizontalSwipe = ({
  enabled,
  exclusionSelector,
  onSwipe,
}: UseHorizontalSwipeArgs): HorizontalSwipeBindings => {
  const swipeSurfaceRef = useRef<HTMLDivElement>(null);
  const pointerStartRef = useRef<SwipeStart | null>(null);
  const touchStartRef = useRef<SwipeStart | null>(null);
  const suppressClickUntilRef = useRef(0);

  useEffect(() => {
    const swipeSurface = swipeSurfaceRef.current;
    if (!swipeSurface || !enabled) return;

    const preventHorizontalNavigation = (event: TouchEvent) => {
      const start = touchStartRef.current;
      if (!start) return;

      const touch = Array.from(event.touches).find(
        ({ identifier }) => identifier === start.id,
      );
      if (!touch) return;

      const deltaX = Math.abs(touch.clientX - start.x);
      const deltaY = Math.abs(touch.clientY - start.y);
      if (deltaX >= 8 && deltaX > deltaY * HORIZONTAL_DOMINANCE) {
        event.preventDefault();
      }
    };

    swipeSurface.addEventListener("touchmove", preventHorizontalNavigation, {
      capture: true,
      passive: false,
    });

    return () =>
      swipeSurface.removeEventListener(
        "touchmove",
        preventHorizontalNavigation,
        true,
      );
  }, [enabled]);

  const completeSwipe = (start: SwipeStart, x: number, y: number) => {
    const deltaX = x - start.x;
    const deltaY = y - start.y;
    const direction = getSwipeDirection({ deltaX, deltaY });

    if (!direction) return;

    const navigated = onSwipe(direction);
    if (navigated) {
      suppressClickUntilRef.current = Date.now() + POST_SWIPE_CLICK_BLOCK_MS;
    }
  };

  const onTouchStartCapture = (event: ReactTouchEvent<HTMLDivElement>) => {
    touchStartRef.current = null;
    if (
      !enabled ||
      event.touches.length !== 1 ||
      isExcludedTarget(event.target, event.currentTarget, exclusionSelector)
    ) {
      return;
    }

    const touch = event.touches[0];
    touchStartRef.current = {
      id: touch.identifier,
      x: touch.clientX,
      y: touch.clientY,
    };
  };

  const onTouchEndCapture = (event: ReactTouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start) return;

    const touch = Array.from(event.changedTouches).find(
      ({ identifier }) => identifier === start.id,
    );
    if (touch) completeSwipe(start, touch.clientX, touch.clientY);
  };

  const onTouchCancelCapture = () => {
    touchStartRef.current = null;
  };

  const onPointerDownCapture = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointerStartRef.current = null;
    if (
      !enabled ||
      event.pointerType === "touch" ||
      !event.isPrimary ||
      (event.pointerType === "mouse" && event.button !== 0) ||
      isExcludedTarget(event.target, event.currentTarget, exclusionSelector)
    ) {
      return;
    }

    pointerStartRef.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
  };

  const onPointerUpCapture = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = pointerStartRef.current;
    pointerStartRef.current = null;
    if (!start || start.id !== event.pointerId) return;
    completeSwipe(start, event.clientX, event.clientY);
  };

  const onPointerCancelCapture = () => {
    pointerStartRef.current = null;
  };

  const onClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (Date.now() > suppressClickUntilRef.current) return;
    suppressClickUntilRef.current = 0;
    event.preventDefault();
    event.stopPropagation();
  };

  return {
    ref: swipeSurfaceRef,
    onClickCapture,
    onPointerCancelCapture,
    onPointerDownCapture,
    onPointerUpCapture,
    onTouchCancelCapture,
    onTouchEndCapture,
    onTouchStartCapture,
  };
};
