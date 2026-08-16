import {
  KeyboardSensor as LibKeyboardSensor,
  MouseSensor as LibMouseSensor,
  TouchSensor as LibTouchSensor,
} from "@dnd-kit/core";

const shouldSkip = (element: HTMLElement | null) => {
  return !!element?.closest('[data-no-drag="true"]');
};

export class MouseSensor extends LibMouseSensor {
  static activators = [
    {
      eventName: "onMouseDown" as const,
      handler: ({ nativeEvent: event }: { nativeEvent: MouseEvent }) => {
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

export class KeyboardSensor extends LibKeyboardSensor {
  static activators = [
    {
      eventName: "onKeyDown" as const,
      handler: ({ nativeEvent: event }: { nativeEvent: KeyboardEvent }) =>
        !shouldSkip(event.target as HTMLElement),
    },
  ];
}
