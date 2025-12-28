import React, { createContext, useContext, useRef, useState } from "react";
import {
  View,
  PanResponder,
  StyleSheet,
  LayoutChangeEvent,
} from "react-native";

type Direction = "horizontal" | "vertical";

interface ResizableContextValue {
  direction: Direction;
  size: number;
  setSize: (size: number) => void;
  containerSize: number;
}

const ResizableContext = createContext<ResizableContextValue | null>(null);

interface ResizablePanelGroupProps {
  direction?: Direction;
  initialSize?: number; // percentage (0–1)
  children: React.ReactNode;
}

export function ResizablePanelGroup({
  direction = "horizontal",
  initialSize = 0.5,
  children,
}: ResizablePanelGroupProps) {
  const [containerSize, setContainerSize] = useState(0);
  const [size, setSize] = useState(initialSize);

  return (
    <View
      style={[styles.group, direction === "vertical" && styles.vertical]}
      onLayout={(e: LayoutChangeEvent) => {
        setContainerSize(
          direction === "horizontal"
            ? e.nativeEvent.layout.width
            : e.nativeEvent.layout.height
        );
      }}
    >
      <ResizableContext.Provider
        value={{ direction, size, setSize, containerSize }}
      >
        {children}
      </ResizableContext.Provider>
    </View>
  );
}

interface ResizablePanelProps {
  children: React.ReactNode;
  minSize?: number; // percentage
}

export function ResizablePanel({
  children,
  minSize = 0.1,
}: ResizablePanelProps) {
  const ctx = useContext(ResizableContext);
  if (!ctx)
    throw new Error("ResizablePanel must be used inside ResizablePanelGroup");

  const flexValue = ctx.size;

  return <View style={{ flex: flexValue }}>{children}</View>;
}

interface ResizableHandleProps {
  withHandle?: boolean;
}

export function ResizableHandle({ withHandle = true }: ResizableHandleProps) {
  const ctx = useContext(ResizableContext);
  if (!ctx)
    throw new Error("ResizableHandle must be used inside ResizablePanelGroup");

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        if (!ctx.containerSize) return;

        const delta = ctx.direction === "horizontal" ? gesture.dx : gesture.dy;

        const newSize = ctx.size + delta / ctx.containerSize;

        ctx.setSize(Math.min(0.9, Math.max(0.1, newSize)));
      },
    })
  ).current;

  return (
    <View
      {...panResponder.panHandlers}
      style={[
        styles.handle,
        ctx.direction === "vertical" && styles.handleVertical,
      ]}
    >
      {withHandle && <View style={styles.grip} />}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    flex: 1,
    flexDirection: "row",
  },
  vertical: {
    flexDirection: "column",
  },
  handle: {
    width: 12,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  handleVertical: {
    width: "100%",
    height: 12,
  },
  grip: {
    width: 4,
    height: 24,
    borderRadius: 2,
    backgroundColor: "#9CA3AF",
  },
});
