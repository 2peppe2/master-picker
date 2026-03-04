import {
  PointerSensor as LibPointerSensor,
  TouchSensor as LibTouchSensor,
} from "@dnd-kit/core";

const shouldSkip = (element: HTMLElement | null) => {
  return !!element?.closest('[data-no-drag="true"]');
};

export class PointerSensor extends LibPointerSensor {
  static activators = [
    {
      eventName: "onPointerDown" as const,
      handler: ({ nativeEvent: event }: { nativeEvent: PointerEvent }) => {
        return !shouldSkip(event.target as HTMLElement);
      },
    },
  ];
}

export class TouchSensor extends LibTouchSensor {
  static activators = [
    {
      eventName: "onTouchStart" as const,
      handler: ({ nativeEvent: event }: { nativeEvent: TouchEvent }) => {
        return !shouldSkip(event.target as HTMLElement);
      },
    },
  ];
}
