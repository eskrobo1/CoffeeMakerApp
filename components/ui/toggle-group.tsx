import React, { createContext, useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

type ToggleGroupType = "single" | "multiple";
type ToggleGroupVariant = "default" | "outline";
type ToggleGroupSize = "default" | "sm" | "lg";

interface ToggleGroupContextProps {
  value: string | string[];
  onValueChange: (value: string) => void;
  type: ToggleGroupType;
  variant?: ToggleGroupVariant;
  size?: ToggleGroupSize;
}

const ToggleGroupContext = createContext<ToggleGroupContextProps | null>(null);

function useToggleGroupContext() {
  const context = useContext(ToggleGroupContext);
  if (!context) {
    throw new Error("ToggleGroupItem must be used within a ToggleGroup");
  }
  return context;
}

interface ToggleGroupProps {
  type: ToggleGroupType;
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  defaultValue?: string | string[];
  variant?: ToggleGroupVariant;
  size?: ToggleGroupSize;
  children: React.ReactNode;
  style?: ViewStyle;
  disabled?: boolean;
}

export function ToggleGroup({
  type,
  value: controlledValue,
  onValueChange,
  defaultValue,
  variant = "default",
  size = "default",
  children,
  style,
  disabled = false,
}: ToggleGroupProps) {
  const [internalValue, setInternalValue] = useState<string | string[]>(
    defaultValue || (type === "multiple" ? [] : "")
  );

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleValueChange = (itemValue: string) => {
    if (disabled) return;

    let newValue: string | string[];

    if (type === "multiple") {
      const currentValues = Array.isArray(value) ? value : [];
      newValue = currentValues.includes(itemValue)
        ? currentValues.filter((v) => v !== itemValue)
        : [...currentValues, itemValue];
    } else {
      newValue = value === itemValue ? "" : itemValue;
    }

    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <ToggleGroupContext.Provider
      value={{ value, onValueChange: handleValueChange, type, variant, size }}
    >
      <View
        style={[
          styles.toggleGroup,
          variant === "outline" && styles.toggleGroupOutline,
          style,
        ]}
      >
        {children}
      </View>
    </ToggleGroupContext.Provider>
  );
}

interface ToggleGroupItemProps {
  value: string;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export function ToggleGroupItem({
  value: itemValue,
  children,
  style,
  textStyle,
  disabled = false,
}: ToggleGroupItemProps) {
  const { value, onValueChange, type, variant, size } = useToggleGroupContext();

  const isActive =
    type === "multiple"
      ? Array.isArray(value) && value.includes(itemValue)
      : value === itemValue;

  const handlePress = () => {
    if (!disabled) {
      onValueChange(itemValue);
    }
  };

  const sizeStyles = {
    sm: styles.itemSm,
    default: styles.itemDefault,
    lg: styles.itemLg,
  }[size || "default"];

  const textSizeStyles = {
    sm: styles.itemTextSm,
    default: styles.itemTextDefault,
    lg: styles.itemTextLg,
  }[size || "default"];

  return (
    <TouchableOpacity
      style={[
        styles.toggleGroupItem,
        sizeStyles,
        variant === "outline" && styles.toggleGroupItemOutline,
        isActive && styles.toggleGroupItemActive,
        isActive &&
          variant === "outline" &&
          styles.toggleGroupItemActiveOutline,
        disabled && styles.toggleGroupItemDisabled,
        style,
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {typeof children === "string" ? (
        <Text
          style={[
            styles.itemText,
            textSizeStyles,
            isActive && styles.itemTextActive,
            disabled && styles.itemTextDisabled,
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
  toggleGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 6,
    overflow: "hidden",
  },
  toggleGroupOutline: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  toggleGroupItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
  },
  toggleGroupItemOutline: {
    backgroundColor: "#ffffff",
  },
  toggleGroupItemActive: {
    backgroundColor: "#f3f4f6",
  },
  toggleGroupItemActiveOutline: {
    backgroundColor: "#f9fafb",
  },
  toggleGroupItemDisabled: {
    opacity: 0.5,
  },
  itemSm: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 32,
  },
  itemDefault: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 40,
  },
  itemLg: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    minHeight: 48,
  },
  itemText: {
    fontWeight: "500",
    color: "#6b7280",
  },
  itemTextSm: {
    fontSize: 12,
  },
  itemTextDefault: {
    fontSize: 14,
  },
  itemTextLg: {
    fontSize: 16,
  },
  itemTextActive: {
    color: "#111827",
  },
  itemTextDisabled: {
    color: "#9ca3af",
  },
});
