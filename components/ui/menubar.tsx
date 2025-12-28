import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Pressable,
} from "react-native";
import { Check, ChevronRight, Circle } from "lucide-react-native";

interface MenubarContextValue {
  openMenu: string | null;
  setOpenMenu: (menu: string | null) => void;
}

const MenubarContext = React.createContext<MenubarContextValue | null>(null);

function useMenubar() {
  const context = React.useContext(MenubarContext);
  if (!context) {
    throw new Error("useMenubar must be used within Menubar");
  }
  return context;
}

interface MenubarProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Menubar({ children, style }: MenubarProps) {
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);

  return (
    <MenubarContext.Provider value={{ openMenu, setOpenMenu }}>
      <View style={[styles.menubar, style]}>{children}</View>
    </MenubarContext.Provider>
  );
}

interface MenubarMenuContextValue {
  menuId: string;
  isOpen: boolean;
  onToggle: () => void;
}

const MenubarMenuContext = React.createContext<MenubarMenuContextValue | null>(
  null
);

function useMenubarMenu() {
  const context = React.useContext(MenubarMenuContext);
  if (!context) {
    throw new Error("useMenubarMenu must be used within MenubarMenu");
  }
  return context;
}

interface MenubarMenuProps {
  children: React.ReactNode;
  value?: string;
}

export function MenubarMenu({ children, value }: MenubarMenuProps) {
  const { openMenu, setOpenMenu } = useMenubar();
  const menuId = value || React.useId();
  const isOpen = openMenu === menuId;

  const onToggle = () => {
    setOpenMenu(isOpen ? null : menuId);
  };

  return (
    <MenubarMenuContext.Provider value={{ menuId, isOpen, onToggle }}>
      {children}
    </MenubarMenuContext.Provider>
  );
}

interface MenubarTriggerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function MenubarTrigger({
  children,
  style,
  textStyle,
}: MenubarTriggerProps) {
  const { onToggle, isOpen } = useMenubarMenu();

  return (
    <TouchableOpacity
      style={[
        styles.menubarTrigger,
        isOpen && styles.menubarTriggerOpen,
        style,
      ]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      {typeof children === "string" ? (
        <Text style={[styles.menubarTriggerText, textStyle]}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

interface MenubarContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function MenubarContent({ children, style }: MenubarContentProps) {
  const { isOpen } = useMenubarMenu();
  const { setOpenMenu } = useMenubar();

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={() => setOpenMenu(null)}
    >
      <Pressable
        style={styles.menubarContentOverlay}
        onPress={() => setOpenMenu(null)}
      >
        <View style={[styles.menubarContent, style]}>{children}</View>
      </Pressable>
    </Modal>
  );
}

interface MenubarItemProps {
  children: React.ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  variant?: "default" | "destructive";
  inset?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function MenubarItem({
  children,
  onSelect,
  disabled = false,
  variant = "default",
  inset = false,
  style,
  textStyle,
}: MenubarItemProps) {
  const { setOpenMenu } = useMenubar();

  const handlePress = () => {
    if (!disabled) {
      onSelect?.();
      setOpenMenu(null);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.menubarItem,
        disabled && styles.menubarItemDisabled,
        variant === "destructive" && styles.menubarItemDestructive,
        inset && styles.menubarItemInset,
        style,
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {typeof children === "string" ? (
        <Text
          style={[
            styles.menubarItemText,
            variant === "destructive" && styles.menubarItemTextDestructive,
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

interface MenubarCheckboxItemProps {
  children: React.ReactNode;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function MenubarCheckboxItem({
  children,
  checked = false,
  onCheckedChange,
  disabled = false,
  style,
  textStyle,
}: MenubarCheckboxItemProps) {
  const { setOpenMenu } = useMenubar();

  const handlePress = () => {
    if (!disabled) {
      onCheckedChange?.(!checked);
      setOpenMenu(null);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.menubarItem,
        styles.menubarCheckboxItem,
        disabled && styles.menubarItemDisabled,
        style,
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.menubarCheckboxIndicator}>
        {checked && <Check size={16} color="#000000" />}
      </View>
      {typeof children === "string" ? (
        <Text style={[styles.menubarItemText, textStyle]}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

interface MenubarRadioItemProps {
  children: React.ReactNode;
  value: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function MenubarRadioItem({
  children,
  value,
  style,
  textStyle,
}: MenubarRadioItemProps) {
  return (
    <TouchableOpacity
      style={[styles.menubarItem, styles.menubarRadioItem, style]}
      activeOpacity={0.7}
    >
      <View style={styles.menubarRadioIndicator}>
        <Circle size={8} color="#000000" fill="#000000" />
      </View>
      {typeof children === "string" ? (
        <Text style={[styles.menubarItemText, textStyle]}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

interface MenubarLabelProps {
  children: React.ReactNode;
  inset?: boolean;
  style?: TextStyle;
}

export function MenubarLabel({
  children,
  inset = false,
  style,
}: MenubarLabelProps) {
  return (
    <Text
      style={[styles.menubarLabel, inset && styles.menubarLabelInset, style]}
    >
      {children}
    </Text>
  );
}

interface MenubarSeparatorProps {
  style?: ViewStyle;
}

export function MenubarSeparator({ style }: MenubarSeparatorProps) {
  return <View style={[styles.menubarSeparator, style]} />;
}

interface MenubarShortcutProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export function MenubarShortcut({ children, style }: MenubarShortcutProps) {
  return <Text style={[styles.menubarShortcut, style]}>{children}</Text>;
}

interface MenubarGroupProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function MenubarGroup({ children, style }: MenubarGroupProps) {
  return <View style={[styles.menubarGroup, style]}>{children}</View>;
}

// Aliases
export const MenubarPortal = React.Fragment;
export const MenubarSub = MenubarMenu;
export const MenubarSubContent = MenubarContent;
export const MenubarSubTrigger = MenubarItem;
export const MenubarRadioGroup = MenubarGroup;

const styles = StyleSheet.create({
  menubar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    height: 36,
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menubarTrigger: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  menubarTriggerOpen: {
    backgroundColor: "#F3F4F6",
  },
  menubarTriggerText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
  },
  menubarContentOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  menubarContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    minWidth: 192,
    padding: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  menubarItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  menubarItemDisabled: {
    opacity: 0.5,
  },
  menubarItemDestructive: {
    backgroundColor: "#FEF2F2",
  },
  menubarItemInset: {
    paddingLeft: 32,
  },
  menubarItemText: {
    fontSize: 14,
    color: "#000000",
  },
  menubarItemTextDestructive: {
    color: "#EF4444",
  },
  menubarCheckboxItem: {
    paddingLeft: 32,
  },
  menubarCheckboxIndicator: {
    position: "absolute",
    left: 8,
    width: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  menubarRadioItem: {
    paddingLeft: 32,
  },
  menubarRadioIndicator: {
    position: "absolute",
    left: 8,
    width: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  menubarLabel: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
  },
  menubarLabelInset: {
    paddingLeft: 32,
  },
  menubarSeparator: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 4,
    marginHorizontal: -4,
  },
  menubarShortcut: {
    marginLeft: "auto",
    fontSize: 12,
    color: "#9CA3AF",
    letterSpacing: 1,
  },
  menubarGroup: {
    // No default styles
  },
});
