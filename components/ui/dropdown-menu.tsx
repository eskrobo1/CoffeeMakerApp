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

interface DropdownMenuContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DropdownMenuContext =
  React.createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenu() {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("useDropdownMenu must be used within DropdownMenu");
  }
  return context;
}

interface DropdownMenuProps {
  children: React.ReactNode;
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenuContext.Provider value={{ open, onOpenChange: setOpen }}>
      {children}
    </DropdownMenuContext.Provider>
  );
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export function DropdownMenuTrigger({
  children,
  asChild,
}: DropdownMenuTriggerProps) {
  const { onOpenChange } = useDropdownMenu();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onPress: () => onOpenChange(true),
    } as any);
  }

  return (
    <TouchableOpacity onPress={() => onOpenChange(true)}>
      {children}
    </TouchableOpacity>
  );
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function DropdownMenuContent({
  children,
  style,
}: DropdownMenuContentProps) {
  const { open, onOpenChange } = useDropdownMenu();

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => onOpenChange(false)}
    >
      <Pressable
        style={styles.dropdownMenuOverlay}
        onPress={() => onOpenChange(false)}
      >
        <View style={[styles.dropdownMenuContent, style]}>{children}</View>
      </Pressable>
    </Modal>
  );
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  variant?: "default" | "destructive";
  inset?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function DropdownMenuItem({
  children,
  onSelect,
  disabled = false,
  variant = "default",
  inset = false,
  style,
  textStyle,
}: DropdownMenuItemProps) {
  const { onOpenChange } = useDropdownMenu();

  const handlePress = () => {
    if (!disabled) {
      onSelect?.();
      onOpenChange(false);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.dropdownMenuItem,
        disabled && styles.dropdownMenuItemDisabled,
        variant === "destructive" && styles.dropdownMenuItemDestructive,
        inset && styles.dropdownMenuItemInset,
        style,
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {typeof children === "string" ? (
        <Text
          style={[
            styles.dropdownMenuItemText,
            variant === "destructive" && styles.dropdownMenuItemTextDestructive,
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

interface DropdownMenuCheckboxItemProps {
  children: React.ReactNode;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function DropdownMenuCheckboxItem({
  children,
  checked = false,
  onCheckedChange,
  disabled = false,
  style,
  textStyle,
}: DropdownMenuCheckboxItemProps) {
  const { onOpenChange } = useDropdownMenu();

  const handlePress = () => {
    if (!disabled) {
      onCheckedChange?.(!checked);
      onOpenChange(false);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.dropdownMenuItem,
        styles.dropdownMenuCheckboxItem,
        disabled && styles.dropdownMenuItemDisabled,
        style,
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.dropdownMenuCheckboxIndicator}>
        {checked && <Check size={16} color="#000000" />}
      </View>
      {typeof children === "string" ? (
        <Text style={[styles.dropdownMenuItemText, textStyle]}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

interface DropdownMenuRadioItemProps {
  children: React.ReactNode;
  value: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function DropdownMenuRadioItem({
  children,
  value,
  style,
  textStyle,
}: DropdownMenuRadioItemProps) {
  return (
    <TouchableOpacity
      style={[styles.dropdownMenuItem, styles.dropdownMenuRadioItem, style]}
      activeOpacity={0.7}
    >
      <View style={styles.dropdownMenuRadioIndicator}>
        <Circle size={8} color="#000000" fill="#000000" />
      </View>
      {typeof children === "string" ? (
        <Text style={[styles.dropdownMenuItemText, textStyle]}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

interface DropdownMenuLabelProps {
  children: React.ReactNode;
  inset?: boolean;
  style?: TextStyle;
}

export function DropdownMenuLabel({
  children,
  inset = false,
  style,
}: DropdownMenuLabelProps) {
  return (
    <Text
      style={[
        styles.dropdownMenuLabel,
        inset && styles.dropdownMenuLabelInset,
        style,
      ]}
    >
      {children}
    </Text>
  );
}

interface DropdownMenuSeparatorProps {
  style?: ViewStyle;
}

export function DropdownMenuSeparator({ style }: DropdownMenuSeparatorProps) {
  return <View style={[styles.dropdownMenuSeparator, style]} />;
}

interface DropdownMenuShortcutProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export function DropdownMenuShortcut({
  children,
  style,
}: DropdownMenuShortcutProps) {
  return <Text style={[styles.dropdownMenuShortcut, style]}>{children}</Text>;
}

interface DropdownMenuGroupProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function DropdownMenuGroup({ children, style }: DropdownMenuGroupProps) {
  return <View style={[styles.dropdownMenuGroup, style]}>{children}</View>;
}

interface DropdownMenuSubTriggerProps {
  children: React.ReactNode;
  inset?: boolean;
  style?: ViewStyle;
}

export function DropdownMenuSubTrigger({
  children,
  inset = false,
  style,
}: DropdownMenuSubTriggerProps) {
  return (
    <TouchableOpacity
      style={[
        styles.dropdownMenuItem,
        inset && styles.dropdownMenuItemInset,
        style,
      ]}
      activeOpacity={0.7}
    >
      {children}
      <ChevronRight size={16} color="#6B7280" style={{ marginLeft: "auto" }} />
    </TouchableOpacity>
  );
}

// Aliases
export const DropdownMenuPortal = React.Fragment;
export const DropdownMenuSub = DropdownMenu;
export const DropdownMenuSubContent = DropdownMenuContent;
export const DropdownMenuRadioGroup = DropdownMenuGroup;

const styles = StyleSheet.create({
  dropdownMenuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownMenuContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    minWidth: 128,
    maxHeight: "80%",
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  dropdownMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  dropdownMenuItemDisabled: {
    opacity: 0.5,
  },
  dropdownMenuItemDestructive: {
    backgroundColor: "#FEF2F2",
  },
  dropdownMenuItemInset: {
    paddingLeft: 32,
  },
  dropdownMenuItemText: {
    fontSize: 14,
    color: "#000000",
  },
  dropdownMenuItemTextDestructive: {
    color: "#EF4444",
  },
  dropdownMenuCheckboxItem: {
    paddingLeft: 32,
  },
  dropdownMenuCheckboxIndicator: {
    position: "absolute",
    left: 8,
    width: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownMenuRadioItem: {
    paddingLeft: 32,
  },
  dropdownMenuRadioIndicator: {
    position: "absolute",
    left: 8,
    width: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownMenuLabel: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
  },
  dropdownMenuLabelInset: {
    paddingLeft: 32,
  },
  dropdownMenuSeparator: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 4,
    marginHorizontal: -4,
  },
  dropdownMenuShortcut: {
    marginLeft: "auto",
    fontSize: 12,
    color: "#9CA3AF",
    letterSpacing: 1,
  },
  dropdownMenuGroup: {
    // No default styles
  },
});
