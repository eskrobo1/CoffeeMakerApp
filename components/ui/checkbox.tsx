import * as React from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ViewStyle,
  AccessibilityState,
} from "react-native";
import { Check } from "lucide-react-native";

interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export function Checkbox({
  checked = false,
  onCheckedChange,
  disabled = false,
  style,
  accessibilityLabel,
}: CheckboxProps) {
  const handlePress = () => {
    if (!disabled) {
      onCheckedChange?.(!checked);
    }
  };

  const accessibilityState: AccessibilityState = {
    checked,
    disabled,
  };

  return (
    <TouchableOpacity
      style={[
        styles.checkbox,
        checked && styles.checkboxChecked,
        disabled && styles.checkboxDisabled,
        style,
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole="checkbox"
      accessibilityState={accessibilityState}
      accessibilityLabel={accessibilityLabel}
    >
      {checked && (
        <View style={styles.checkboxIndicator}>
          <Check size={14} color="#FFFFFF" strokeWidth={3} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  checkboxChecked: {
    backgroundColor: "#000000",
    borderColor: "#000000",
  },
  checkboxDisabled: {
    opacity: 0.5,
  },
  checkboxIndicator: {
    justifyContent: "center",
    alignItems: "center",
  },
});
