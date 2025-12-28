import * as React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Pressable,
  Animated,
  PanResponder,
  Dimensions,
} from "react-native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

interface DrawerContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  direction: "top" | "bottom" | "left" | "right";
}

const DrawerContext = React.createContext<DrawerContextValue | null>(null);

function useDrawer() {
  const context = React.useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawer must be used within Drawer");
  }
  return context;
}

interface DrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  direction?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
}

export function Drawer({
  open = false,
  onOpenChange,
  direction = "bottom",
  children,
}: DrawerProps) {
  const [internalOpen, setInternalOpen] = React.useState(open);

  const isOpen = open !== undefined ? open : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (open === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  return (
    <DrawerContext.Provider
      value={{ open: isOpen, onOpenChange: handleOpenChange, direction }}
    >
      {children}
    </DrawerContext.Provider>
  );
}

interface DrawerTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export function DrawerTrigger({ children, asChild }: DrawerTriggerProps) {
  const { onOpenChange } = useDrawer();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onPress: () => onOpenChange(true),
    } as any);
  }

  return <View>{children}</View>;
}

interface DrawerContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function DrawerContent({ children, style }: DrawerContentProps) {
  const { open, onOpenChange, direction } = useDrawer();
  const translateValue = React.useRef(new Animated.Value(0)).current;

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (direction === "bottom" && gestureState.dy > 0) {
          translateValue.setValue(gestureState.dy);
        } else if (direction === "top" && gestureState.dy < 0) {
          translateValue.setValue(gestureState.dy);
        } else if (direction === "left" && gestureState.dx < 0) {
          translateValue.setValue(gestureState.dx);
        } else if (direction === "right" && gestureState.dx > 0) {
          translateValue.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const threshold = 50;
        const shouldClose =
          (direction === "bottom" && gestureState.dy > threshold) ||
          (direction === "top" && gestureState.dy < -threshold) ||
          (direction === "left" && gestureState.dx < -threshold) ||
          (direction === "right" && gestureState.dx > threshold);

        if (shouldClose) {
          onOpenChange(false);
        } else {
          Animated.spring(translateValue, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  React.useEffect(() => {
    if (open) {
      translateValue.setValue(0);
    }
  }, [open]);

  const getDrawerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      position: "absolute",
      backgroundColor: "#FFFFFF",
    };

    switch (direction) {
      case "bottom":
        return {
          ...baseStyle,
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: SCREEN_HEIGHT * 0.8,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          transform: [{ translateY: translateValue }],
        };
      case "top":
        return {
          ...baseStyle,
          top: 0,
          left: 0,
          right: 0,
          maxHeight: SCREEN_HEIGHT * 0.8,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          transform: [{ translateY: translateValue }],
        };
      case "left":
        return {
          ...baseStyle,
          top: 0,
          bottom: 0,
          left: 0,
          width: SCREEN_WIDTH * 0.75,
          maxWidth: 384,
          transform: [{ translateX: translateValue }],
        };
      case "right":
        return {
          ...baseStyle,
          top: 0,
          bottom: 0,
          right: 0,
          width: SCREEN_WIDTH * 0.75,
          maxWidth: 384,
          transform: [{ translateX: translateValue }],
        };
    }
  };

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => onOpenChange(false)}
    >
      <Pressable
        style={styles.drawerOverlay}
        onPress={() => onOpenChange(false)}
      >
        <Animated.View
          style={[getDrawerStyle(), style]}
          {...panResponder.panHandlers}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            {direction === "bottom" && <View style={styles.drawerHandle} />}
            {children}
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

interface DrawerHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function DrawerHeader({ children, style }: DrawerHeaderProps) {
  return <View style={[styles.drawerHeader, style]}>{children}</View>;
}

interface DrawerFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function DrawerFooter({ children, style }: DrawerFooterProps) {
  return <View style={[styles.drawerFooter, style]}>{children}</View>;
}

interface DrawerTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export function DrawerTitle({ children, style }: DrawerTitleProps) {
  return <Text style={[styles.drawerTitle, style]}>{children}</Text>;
}

interface DrawerDescriptionProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export function DrawerDescription({ children, style }: DrawerDescriptionProps) {
  return <Text style={[styles.drawerDescription, style]}>{children}</Text>;
}

interface DrawerCloseProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export function DrawerClose({ children, asChild }: DrawerCloseProps) {
  const { onOpenChange } = useDrawer();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onPress: () => onOpenChange(false),
    } as any);
  }

  return <View>{children}</View>;
}

// Aliases
export const DrawerPortal = React.Fragment;
export const DrawerOverlay = React.Fragment;

const styles = StyleSheet.create({
  drawerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  drawerHandle: {
    width: 100,
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    alignSelf: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  drawerHeader: {
    padding: 16,
    gap: 6,
  },
  drawerFooter: {
    marginTop: "auto",
    padding: 16,
    gap: 8,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  drawerDescription: {
    fontSize: 14,
    color: "#6B7280",
  },
});
