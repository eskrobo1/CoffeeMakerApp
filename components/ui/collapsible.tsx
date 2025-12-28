import * as React from "react";
import {
  View,
  Animated,
  StyleSheet,
  ViewStyle,
  LayoutChangeEvent,
} from "react-native";

interface CollapsibleContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(
  null
);

function useCollapsible() {
  const context = React.useContext(CollapsibleContext);
  if (!context) {
    throw new Error("useCollapsible must be used within Collapsible");
  }
  return context;
}

interface CollapsibleProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Collapsible({
  open = false,
  onOpenChange,
  children,
  style,
}: CollapsibleProps) {
  const [internalOpen, setInternalOpen] = React.useState(open);

  const isOpen = open !== undefined ? open : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (open === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  return (
    <CollapsibleContext.Provider
      value={{ open: isOpen, onOpenChange: handleOpenChange }}
    >
      <View style={[styles.collapsible, style]}>{children}</View>
    </CollapsibleContext.Provider>
  );
}

interface CollapsibleTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export function CollapsibleTrigger({
  children,
  asChild,
}: CollapsibleTriggerProps) {
  const { open, onOpenChange } = useCollapsible();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onPress: () => onOpenChange(!open),
    } as any);
  }

  return <View>{children}</View>;
}

interface CollapsibleContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function CollapsibleContent({
  children,
  style,
}: CollapsibleContentProps) {
  const { open } = useCollapsible();
  const [contentHeight, setContentHeight] = React.useState(0);
  const animatedHeight = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: open ? contentHeight : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [open, contentHeight]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (contentHeight === 0) {
      setContentHeight(height);
    }
  };

  return (
    <Animated.View
      style={[
        styles.collapsibleContent,
        { height: animatedHeight, overflow: "hidden" },
      ]}
    >
      <View onLayout={handleLayout} style={style}>
        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  collapsible: {
    width: "100%",
  },
  collapsibleContent: {
    overflow: "hidden",
  },
});
