import React, { createContext, useContext, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  ScrollView,
} from "react-native";
import { ChevronDown } from "lucide-react-native";

interface SelectContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const SelectContext = createContext<SelectContextValue | null>(null);

/* ------------------ Select ------------------ */

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export function Select({ value, onValueChange, children }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen }}>
      <View>{children}</View>
    </SelectContext.Provider>
  );
}

/* ------------------ Trigger ------------------ */

interface SelectTriggerProps {
  children?: React.ReactNode;
}

export function SelectTrigger({ children }: SelectTriggerProps) {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("SelectTrigger must be used inside Select");

  return (
    <Pressable style={styles.trigger} onPress={() => ctx.setIsOpen(true)}>
      <View style={styles.triggerContent}>
        {children}
        <ChevronDown size={16} color="#6B7280" />
      </View>
    </Pressable>
  );
}

/* ------------------ Value ------------------ */

interface SelectValueProps {
  placeholder?: string;
}

export function SelectValue({ placeholder }: SelectValueProps) {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("SelectValue must be used inside Select");

  return <Text style={styles.valueText}>{ctx.value ?? placeholder}</Text>;
}

/* ------------------ Content ------------------ */

interface SelectContentProps {
  children: React.ReactNode;
}

export function SelectContent({ children }: SelectContentProps) {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("SelectContent must be used inside Select");

  return (
    <Modal
      visible={ctx.isOpen}
      transparent
      animationType="fade"
      onRequestClose={() => ctx.setIsOpen(false)}
    >
      <Pressable style={styles.overlay} onPress={() => ctx.setIsOpen(false)}>
        <View style={styles.content}>
          <ScrollView>{children}</ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}

/* ------------------ Item ------------------ */

interface SelectItemProps {
  value: string;
  children?: React.ReactNode;
}

export function SelectItem({ value, children }: SelectItemProps) {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("SelectItem must be used inside Select");

  const selected = ctx.value === value;

  return (
    <Pressable
      onPress={() => {
        ctx.onValueChange?.(value);
        ctx.setIsOpen(false);
      }}
      style={[styles.item, selected && styles.itemSelected]}
    >
      <Text style={styles.itemText}>{children}</Text>
    </Pressable>
  );
}

/* ------------------ Styles ------------------ */

const styles = StyleSheet.create({
  trigger: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
  },
  triggerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  valueText: {
    fontSize: 14,
    color: "#111827",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 24,
  },
  content: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 8,
    maxHeight: "60%",
    elevation: 8,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  itemSelected: {
    backgroundColor: "#F3F4F6",
  },
  itemText: {
    fontSize: 14,
    color: "#111827",
  },
});
