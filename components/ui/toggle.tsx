import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

type ToggleVariant = "default" | "outline";
type ToggleSize = "default" | "sm" | "lg";

interface ToggleProps {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  defaultPressed?: boolean;
  variant?: ToggleVariant;
  size?: ToggleSize;
  disabled?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Toggle({
  pressed: controlledPressed,
  onPressedChange,
  defaultPressed = false,
  variant = "default",
  size = "default",
  disabled = false,
  children,
  style,
  textStyle,
}: ToggleProps) {
  const [internalPressed, setInternalPressed] = useState(defaultPressed);

  const pressed =
    controlledPressed !== undefined ? controlledPressed : internalPressed;

  const handlePress = () => {
    if (disabled) return;

    const newPressed = !pressed;
    if (controlledPressed === undefined) {
      setInternalPressed(newPressed);
    }
    onPressedChange?.(newPressed);
  };

  const variantStyles = {
    default: pressed ? styles.variantDefaultPressed : styles.variantDefault,
    outline: pressed ? styles.variantOutlinePressed : styles.variantOutline,
  }[variant];

  const sizeStyles = {
    sm: styles.sizeSm,
    default: styles.sizeDefault,
    lg: styles.sizeLg,
  }[size];

  const textSizeStyles = {
    sm: styles.textSizeSm,
    default: styles.textSizeDefault,
    lg: styles.textSizeLg,
  }[size];

  return (
    <TouchableOpacity
      style={[
        styles.toggle,
        variantStyles,
        sizeStyles,
        disabled && styles.toggleDisabled,
        style,
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {typeof children === "string" ? (
        <Text
          style={[
            styles.toggleText,
            textSizeStyles,
            pressed && styles.toggleTextPressed,
            disabled && styles.toggleTextDisabled,
            textStyle,
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  toggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 6,
    backgroundColor: "transparent",
  },
  variantDefault: {
    backgroundColor: "transparent",
  },
  variantDefaultPressed: {
    backgroundColor: "#f3f4f6",
  },
  variantOutline: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "transparent",
  },
  variantOutlinePressed: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f3f4f6",
  },
  sizeSm: {
    height: 32,
    paddingHorizontal: 6,
    minWidth: 32,
  },
  sizeDefault: {
    height: 36,
    paddingHorizontal: 8,
    minWidth: 36,
  },
  sizeLg: {
    height: 40,
    paddingHorizontal: 10,
    minWidth: 40,
  },
  toggleDisabled: {
    opacity: 0.5,
  },
  toggleText: {
    fontWeight: "500",
    color: "#6b7280",
  },
  textSizeSm: {
    fontSize: 12,
  },
  textSizeDefault: {
    fontSize: 14,
  },
  textSizeLg: {
    fontSize: 16,
  },
  toggleTextPressed: {
    color: "#111827",
  },
  toggleTextDisabled: {
    color: "#9ca3af",
  },
});

// Export za kompatibilnost sa toggle-group
export const toggleVariants = {
  variant: {
    default: "default",
    outline: "outline",
  },
  size: {
    default: "default",
    sm: "sm",
    lg: "lg",
  },
};
