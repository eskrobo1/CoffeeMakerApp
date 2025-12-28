import React, { createContext, useContext } from "react";
import { View, Pressable, StyleSheet } from "react-native";

interface RadioGroupContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

interface RadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export function RadioGroup({
  value,
  onValueChange,
  children,
}: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <View style={styles.group}>{children}</View>
    </RadioGroupContext.Provider>
  );
}

interface RadioGroupItemProps {
  value: string;
  disabled?: boolean;
}

export function RadioGroupItem({
  value,
  disabled = false,
}: RadioGroupItemProps) {
  const ctx = useContext(RadioGroupContext);
  if (!ctx) {
    throw new Error("RadioGroupItem must be used inside RadioGroup");
  }

  const selected = ctx.value === value;

  return (
    <Pressable
      onPress={() => {
        if (!disabled) {
          ctx.onValueChange?.(value);
        }
      }}
      disabled={disabled}
      style={[
        styles.item,
        selected && styles.itemSelected,
        disabled && styles.itemDisabled,
      ]}
    >
      {selected && <View style={styles.indicator} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  group: {
    flexDirection: "column",
    gap: 12,
  },
  item: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D1D5DB", // gray-300
    alignItems: "center",
    justifyContent: "center",
  },
  itemSelected: {
    borderColor: "#F59E0B", // amber-500
  },
  itemDisabled: {
    opacity: 0.5,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#F59E0B",
  },
});
