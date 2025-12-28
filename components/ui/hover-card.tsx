import * as React from "react";
import {
  View,
  Modal,
  StyleSheet,
  ViewStyle,
  Pressable,
  TouchableOpacity,
} from "react-native";

interface HoverCardContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HoverCardContext = React.createContext<HoverCardContextValue | null>(
  null
);

function useHoverCard() {
  const context = React.useContext(HoverCardContext);
  if (!context) {
    throw new Error("useHoverCard must be used within HoverCard");
  }
  return context;
}

interface HoverCardProps {
  children: React.ReactNode;
  openDelay?: number;
  closeDelay?: number;
}

export function HoverCard({
  children,
  openDelay = 200,
  closeDelay = 300,
}: HoverCardProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <HoverCardContext.Provider value={{ open, onOpenChange: setOpen }}>
      {children}
    </HoverCardContext.Provider>
  );
}

interface HoverCardTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export function HoverCardTrigger({ children, asChild }: HoverCardTriggerProps) {
  const { onOpenChange } = useHoverCard();

  // In React Native, we use long press instead of hover
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onLongPress: () => onOpenChange(true),
    } as any);
  }

  return (
    <TouchableOpacity
      onLongPress={() => onOpenChange(true)}
      delayLongPress={200}
    >
      {children}
    </TouchableOpacity>
  );
}

interface HoverCardContentProps {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  sideOffset?: number;
  style?: ViewStyle;
}

export function HoverCardContent({
  children,
  align = "center",
  sideOffset = 4,
  style,
}: HoverCardContentProps) {
  const { open, onOpenChange } = useHoverCard();

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => onOpenChange(false)}
    >
      <Pressable
        style={styles.hoverCardOverlay}
        onPress={() => onOpenChange(false)}
      >
        <View style={[styles.hoverCardContent, style]}>{children}</View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  hoverCardOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  hoverCardContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    width: 256,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
});
