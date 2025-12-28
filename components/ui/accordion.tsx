import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ViewStyle,
  TextStyle,
} from "react-native";
import { ChevronDown } from "lucide-react-native";

interface AccordionProps {
  type?: "single" | "multiple";
  collapsible?: boolean;
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

interface AccordionContextValue {
  value: string | string[];
  onValueChange: (itemValue: string) => void;
  type: "single" | "multiple";
}

const AccordionContext = React.createContext<AccordionContextValue | null>(
  null
);

export function Accordion({
  type = "single",
  collapsible = false,
  value,
  onValueChange,
  children,
  style,
}: AccordionProps) {
  const [internalValue, setInternalValue] = React.useState<string | string[]>(
    type === "single" ? "" : []
  );

  const currentValue = value !== undefined ? value : internalValue;

  const handleValueChange = (itemValue: string) => {
    let newValue: string | string[];

    if (type === "single") {
      newValue = currentValue === itemValue && collapsible ? "" : itemValue;
    } else {
      const currentArray = currentValue as string[];
      newValue = currentArray.includes(itemValue)
        ? currentArray.filter((v) => v !== itemValue)
        : [...currentArray, itemValue];
    }

    if (value === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <AccordionContext.Provider
      value={{ value: currentValue, onValueChange: handleValueChange, type }}
    >
      <View style={[styles.accordion, style]}>{children}</View>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  value: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function AccordionItem({ value, children, style }: AccordionItemProps) {
  return (
    <View style={[styles.accordionItem, style]}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { itemValue: value } as any)
          : child
      )}
    </View>
  );
}

interface AccordionTriggerProps {
  children: React.ReactNode;
  itemValue?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function AccordionTrigger({
  children,
  itemValue,
  style,
  textStyle,
}: AccordionTriggerProps) {
  const context = React.useContext(AccordionContext);
  const [rotateAnim] = React.useState(new Animated.Value(0));

  if (!context) {
    throw new Error("AccordionTrigger must be used within Accordion");
  }

  const isOpen =
    context.type === "single"
      ? context.value === itemValue
      : (context.value as string[]).includes(itemValue || "");

  React.useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <TouchableOpacity
      style={[styles.accordionTrigger, style]}
      onPress={() => itemValue && context.onValueChange(itemValue)}
      activeOpacity={0.7}
    >
      <Text style={[styles.accordionTriggerText, textStyle]}>{children}</Text>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <ChevronDown size={16} color="#6B7280" />
      </Animated.View>
    </TouchableOpacity>
  );
}

interface AccordionContentProps {
  children: React.ReactNode;
  itemValue?: string;
  style?: ViewStyle;
}

export function AccordionContent({
  children,
  itemValue,
  style,
}: AccordionContentProps) {
  const context = React.useContext(AccordionContext);
  const [heightAnim] = React.useState(new Animated.Value(0));
  const [contentHeight, setContentHeight] = React.useState(0);

  if (!context) {
    throw new Error("AccordionContent must be used within Accordion");
  }

  const isOpen =
    context.type === "single"
      ? context.value === itemValue
      : (context.value as string[]).includes(itemValue || "");

  React.useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: isOpen ? contentHeight : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isOpen, contentHeight]);

  return (
    <Animated.View style={[styles.accordionContent, { height: heightAnim }]}>
      <View
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          setContentHeight(height);
        }}
        style={style}
      >
        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  accordion: {
    width: "100%",
  },
  accordionItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  accordionTrigger: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingVertical: 16,
    gap: 16,
  },
  accordionTriggerText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "left",
  },
  accordionContent: {
    overflow: "hidden",
  },
});
