import React, { createContext, useContext, useState } from "react";
import {
  Modal,
  View,
  Pressable,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

export function Popover({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      {children}
    </PopoverContext.Provider>
  );
}

export function PopoverTrigger({ children }: { children: React.ReactNode }) {
  const ctx = useContext(PopoverContext);
  if (!ctx) throw new Error("PopoverTrigger must be used inside Popover");

  return <Pressable onPress={() => ctx.setOpen(true)}>{children}</Pressable>;
}

interface PopoverContentProps {
  children: React.ReactNode;
  onClose?: () => void;
}

export function PopoverContent({ children, onClose }: PopoverContentProps) {
  const ctx = useContext(PopoverContext);
  if (!ctx) throw new Error("PopoverContent must be used inside Popover");

  return (
    <Modal
      transparent
      visible={ctx.open}
      animationType="fade"
      onRequestClose={() => {
        ctx.setOpen(false);
        onClose?.();
      }}
    >
      <Pressable
        style={styles.overlay}
        onPress={() => {
          ctx.setOpen(false);
          onClose?.();
        }}
      >
        <View style={styles.content}>{children}</View>
      </Pressable>
    </Modal>
  );
}

/**
 * U React Native nema anchor koncept kao na webu.
 * Ovdje je samo "passthrough" radi kompatibilnosti API-ja.
 */
export function PopoverAnchor({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: 280,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 6, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
});
