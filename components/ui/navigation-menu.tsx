import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { ChevronDown } from "lucide-react-native";

interface NavigationMenuContextValue {
  activeItem: string | null;
  setActiveItem: (item: string | null) => void;
}

const NavigationMenuContext =
  React.createContext<NavigationMenuContextValue | null>(null);

function useNavigationMenu() {
  const context = React.useContext(NavigationMenuContext);
  if (!context) {
    throw new Error("useNavigationMenu must be used within NavigationMenu");
  }
  return context;
}

interface NavigationMenuProps {
  children: React.ReactNode;
  viewport?: boolean;
  style?: ViewStyle;
}

export function NavigationMenu({
  children,
  viewport = true,
  style,
}: NavigationMenuProps) {
  const [activeItem, setActiveItem] = React.useState<string | null>(null);

  return (
    <NavigationMenuContext.Provider value={{ activeItem, setActiveItem }}>
      <View style={[styles.navigationMenu, style]}>{children}</View>
    </NavigationMenuContext.Provider>
  );
}

interface NavigationMenuListProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function NavigationMenuList({
  children,
  style,
}: NavigationMenuListProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.navigationMenuList, style]}
      contentContainerStyle={styles.navigationMenuListContent}
    >
      {children}
    </ScrollView>
  );
}

interface NavigationMenuItemProps {
  children: React.ReactNode;
  value?: string;
  style?: ViewStyle;
}

export function NavigationMenuItem({
  children,
  value,
  style,
}: NavigationMenuItemProps) {
  return <View style={[styles.navigationMenuItem, style]}>{children}</View>;
}

interface NavigationMenuTriggerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function NavigationMenuTrigger({
  children,
  style,
  textStyle,
}: NavigationMenuTriggerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <TouchableOpacity
      style={[
        styles.navigationMenuTrigger,
        isOpen && styles.navigationMenuTriggerOpen,
        style,
      ]}
      onPress={() => setIsOpen(!isOpen)}
      activeOpacity={0.7}
    >
      {typeof children === "string" ? (
        <Text style={[styles.navigationMenuTriggerText, textStyle]}>
          {children}
        </Text>
      ) : (
        children
      )}
      <ChevronDown
        size={12}
        color="#6B7280"
        style={{
          transform: [{ rotate: isOpen ? "180deg" : "0deg" }],
        }}
      />
    </TouchableOpacity>
  );
}

interface NavigationMenuContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function NavigationMenuContent({
  children,
  style,
}: NavigationMenuContentProps) {
  return <View style={[styles.navigationMenuContent, style]}>{children}</View>;
}

interface NavigationMenuLinkProps {
  children: React.ReactNode;
  onPress?: () => void;
  active?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function NavigationMenuLink({
  children,
  onPress,
  active = false,
  style,
  textStyle,
}: NavigationMenuLinkProps) {
  return (
    <TouchableOpacity
      style={[
        styles.navigationMenuLink,
        active && styles.navigationMenuLinkActive,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {typeof children === "string" ? (
        <Text style={[styles.navigationMenuLinkText, textStyle]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

interface NavigationMenuViewportProps {
  style?: ViewStyle;
}

export function NavigationMenuViewport({ style }: NavigationMenuViewportProps) {
  return <View style={[styles.navigationMenuViewport, style]} />;
}

interface NavigationMenuIndicatorProps {
  style?: ViewStyle;
}

export function NavigationMenuIndicator({
  style,
}: NavigationMenuIndicatorProps) {
  return <View style={[styles.navigationMenuIndicator, style]} />;
}

export const navigationMenuTriggerStyle = {
  height: 36,
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 6,
  backgroundColor: "#FFFFFF",
};

const styles = StyleSheet.create({
  navigationMenu: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "100%",
  },
  navigationMenuList: {
    flexDirection: "row",
  },
  navigationMenuListContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  navigationMenuItem: {
    position: "relative",
  },
  navigationMenuTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    gap: 4,
  },
  navigationMenuTriggerOpen: {
    backgroundColor: "#F3F4F6",
  },
  navigationMenuTriggerText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
  },
  navigationMenuContent: {
    position: "absolute",
    top: "100%",
    left: 0,
    width: "100%",
    padding: 8,
  },
  navigationMenuLink: {
    flexDirection: "column",
    gap: 4,
    borderRadius: 4,
    padding: 8,
  },
  navigationMenuLinkActive: {
    backgroundColor: "#F3F4F6",
  },
  navigationMenuLinkText: {
    fontSize: 14,
    color: "#000000",
  },
  navigationMenuViewport: {
    position: "absolute",
    top: "100%",
    left: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  navigationMenuIndicator: {
    position: "absolute",
    top: "100%",
    height: 6,
    justifyContent: "flex-end",
    alignItems: "center",
    overflow: "hidden",
  },
});
