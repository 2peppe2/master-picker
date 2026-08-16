"use client";

import * as React from "react";
import { Drawer } from "vaul";

import { COURSE_CARD_INTERACTION_BARRIER_ATTRIBUTE } from "@/common/components/CourseCard/interactionBarrier";
import { cn } from "@/lib/utils";

const BottomSheetTrigger = Drawer.Trigger;
const BottomSheetClose = Drawer.Close;
const BottomSheetTitle = Drawer.Title;
const BottomSheetDescription = Drawer.Description;

const NATIVE_SNAP_POINTS: (number | string)[] = [0.5, 1];
const SWIPE_STEP_DISTANCE = 48;

interface BottomSheetContextValue {
  stepDownOrDismiss: () => void;
}

const BottomSheetContext = React.createContext<BottomSheetContextValue | null>(
  null,
);

type BottomSheetProps = Omit<
  React.ComponentProps<typeof Drawer.Root>,
  "activeSnapPoint" | "setActiveSnapPoint"
> & {
  initialSnapPoint?: number | string;
};

function BottomSheet({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  initialSnapPoint = NATIVE_SNAP_POINTS[0],
  snapPoints = NATIVE_SNAP_POINTS,
  closeThreshold = 0.25,
  fadeFromIndex = 0,
  snapToSequentialPoint = true,
  ...props
}: BottomSheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const [activeSnapPoint, setActiveSnapPoint] = React.useState<
    number | string | null
  >(initialSnapPoint);
  const open = controlledOpen ?? uncontrolledOpen;
  const wasOpen = React.useRef(open);

  React.useEffect(() => {
    if (open && !wasOpen.current) {
      setActiveSnapPoint(initialSnapPoint);
    }
    wasOpen.current = open;
  }, [initialSnapPoint, open]);

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        setActiveSnapPoint(initialSnapPoint);
      }
      if (controlledOpen === undefined) {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [controlledOpen, initialSnapPoint, onOpenChange],
  );

  const contextValue = React.useMemo(
    () => ({
      stepDownOrDismiss: () => {
        const activeIndex = snapPoints.indexOf(activeSnapPoint ?? initialSnapPoint);

        if (activeIndex > 0) {
          setActiveSnapPoint(snapPoints[activeIndex - 1]);
          return;
        }

        handleOpenChange(false);
      },
    }),
    [activeSnapPoint, handleOpenChange, initialSnapPoint, snapPoints],
  );

  return (
    <Drawer.Root
      {...props}
      open={open}
      onOpenChange={handleOpenChange}
      snapPoints={snapPoints}
      activeSnapPoint={activeSnapPoint}
      setActiveSnapPoint={setActiveSnapPoint}
      closeThreshold={closeThreshold}
      fadeFromIndex={fadeFromIndex}
      snapToSequentialPoint={snapToSequentialPoint}
    >
      <BottomSheetContext value={contextValue}>{children}</BottomSheetContext>
    </Drawer.Root>
  );
}

function BottomSheetContent({
  className,
  children,
  showHandle = true,
  onClickCapture,
  onPointerCancel,
  onPointerDown,
  onPointerUp,
  ...props
}: React.ComponentPropsWithoutRef<typeof Drawer.Content> & {
  showHandle?: boolean;
}) {
  const bottomSheet = React.useContext(BottomSheetContext);
  const dragStartRef = React.useRef<{ id: number; y: number } | null>(null);
  const suppressClickUntilRef = React.useRef(0);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerDown?.(event);

    if (event.pointerType === "touch") {
      dragStartRef.current = { id: event.pointerId, y: event.clientY };
    }
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerUp?.(event);

    const dragStart = dragStartRef.current;
    dragStartRef.current = null;
    if (
      dragStart?.id === event.pointerId &&
      event.clientY - dragStart.y >= SWIPE_STEP_DISTANCE
    ) {
      suppressClickUntilRef.current = Date.now() + 500;
      bottomSheet?.stepDownOrDismiss();
    }
  };

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    dragStartRef.current = null;
    onPointerCancel?.(event);
  };

  const handleClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (Date.now() <= suppressClickUntilRef.current) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onClickCapture?.(event);
  };

  return (
    <Drawer.Portal>
      <Drawer.Overlay
        data-no-swipe="true"
        {...{ [COURSE_CARD_INTERACTION_BARRIER_ATTRIBUTE]: "" }}
        className="pointer-events-auto fixed inset-0 z-50 bg-black/55 backdrop-blur-[1px]"
      />
      <Drawer.Content
        {...{ [COURSE_CARD_INTERACTION_BARRIER_ATTRIBUTE]: "" }}
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 flex h-[100dvh] max-h-[100dvh] flex-col rounded-t-2xl border border-b-0 bg-background shadow-2xl outline-none",
          className,
        )}
        onClickCapture={handleClickCapture}
        onPointerCancel={handlePointerCancel}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        {...props}
      >
        {showHandle && (
          <Drawer.Handle className="mx-auto mt-2.5 h-1.5 w-12 shrink-0 rounded-full bg-muted-foreground/35" />
        )}
        {children}
      </Drawer.Content>
    </Drawer.Portal>
  );
}

export {
  BottomSheet,
  BottomSheetTrigger,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetTitle,
  BottomSheetDescription,
};
