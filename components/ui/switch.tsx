import React, { useState } from "react";
import {
  Switch as RNSwitch,
  Platform,
  StyleSheet,
  ViewStyle,
} from "react-native";

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  defaultChecked?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Switch({
  checked,
  onCheckedChange,
  defaultChecked = false,
  disabled = false,
  style,
}: SwitchProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  const isChecked = checked !== undefined ? checked : internalChecked;

  const handleValueChange = (value: boolean) => {
    if (checked === undefined) {
      setInternalChecked(value);
    }
    onCheckedChange?.(value);
  };

  return (
    <RNSwitch
      value={isChecked}
      onValueChange={handleValueChange}
      disabled={disabled}
      trackColor={{
        false: "#d1d5db", // bg-switch-background
        true: "#D97706",
      }}
      thumbColor={
        Platform.OS === "ios" ? "#ffffff" : isChecked ? "#ffffff" : "#f4f3f4"
      }
      ios_backgroundColor="#d1d5db"
      style={[styles.switch, style]}
    />
  );
}

const styles = StyleSheet.create({
  switch: {
    transform: [{ scaleX: 1 }, { scaleY: 1 }],
  },
});
