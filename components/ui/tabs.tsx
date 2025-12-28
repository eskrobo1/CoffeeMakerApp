import React, { createContext, useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

interface TabsContextProps {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextProps | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider");
  }
  return context;
}

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  style,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || "");

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleValueChange = (newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <View style={[styles.tabs, style]}>{children}</View>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function TabsList({ children, style }: TabsListProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabsListContent}
      style={[styles.tabsList, style]}
    >
      {children}
    </ScrollView>
  );
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export function TabsTrigger({
  value: triggerValue,
  children,
  style,
  textStyle,
  disabled = false,
}: TabsTriggerProps) {
  const { value: activeValue, onValueChange } = useTabsContext();
  const isActive = activeValue === triggerValue;

  const handlePress = () => {
    if (!disabled) {
      onValueChange(triggerValue);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.tabsTrigger,
        isActive && styles.tabsTriggerActive,
        disabled && styles.tabsTriggerDisabled,
        style,
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {typeof children === "string" ? (
        <Text
          style={[
            styles.tabsTriggerText,
            isActive && styles.tabsTriggerTextActive,
            disabled && styles.tabsTriggerTextDisabled,
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

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function TabsContent({
  value: contentValue,
  children,
  style,
}: TabsContentProps) {
  const { value: activeValue } = useTabsContext();

  if (activeValue !== contentValue) {
    return null;
  }

  return <View style={[styles.tabsContent, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  tabs: {
    gap: 8,
  },
  tabsList: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 3,
    height: 44,
  },
  tabsListContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  tabsTrigger: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 36,
  },
  tabsTriggerActive: {
    backgroundColor: "#ffffff",
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
  tabsTriggerDisabled: {
    opacity: 0.5,
  },
  tabsTriggerText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  tabsTriggerTextActive: {
    color: "#111827",
  },
  tabsTriggerTextDisabled: {
    color: "#9ca3af",
  },
  tabsContent: {
    flex: 1,
  },
});
