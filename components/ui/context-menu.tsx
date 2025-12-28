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

interface ContextMenuContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  position: { x: number; y: number };
  setPosition: (position: { x: number; y: number }) => void;
}

const ContextMenuContext = React.createContext<ContextMenuContextValue | null>(
  null
);

function useContextMenu() {
  const context = React.useContext(ContextMenuContext);
  if (!context) {
    throw new Error("useContextMenu must be used within ContextMenu");
  }
  return context;
}

interface ContextMenuProps {
  children: React.ReactNode;
}

export function ContextMenu({ children }: ContextMenuProps) {
  const [open, setOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  return (
    <ContextMenuContext.Provider
      value={{ open, onOpenChange: setOpen, position, setPosition }}
    >
      {children}
    </ContextMenuContext.Provider>
  );
}

interface ContextMenuTriggerProps {
  children: React.ReactNode;
}

export function ContextMenuTrigger({ children }: ContextMenuTriggerProps) {
  const { onOpenChange, setPosition } = useContextMenu();

  const handleLongPress = (event: any) => {
    const { pageX, pageY } = event.nativeEvent;
    setPosition({ x: pageX, y: pageY });
    onOpenChange(true);
  };

  return (
    <Pressable onLongPress={handleLongPress} delayLongPress={500}>
      {children}
    </Pressable>
  );
}

interface ContextMenuContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function ContextMenuContent({
  children,
  style,
}: ContextMenuContentProps) {
  const { open, onOpenChange } = useContextMenu();

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => onOpenChange(false)}
    >
      <Pressable
        style={styles.contextMenuOverlay}
        onPress={() => onOpenChange(false)}
      >
        <View style={[styles.contextMenuContent, style]}>{children}</View>
      </Pressable>
    </Modal>
  );
}

interface ContextMenuItemProps {
  children: React.ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  variant?: "default" | "destructive";
  inset?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function ContextMenuItem({
  children,
  onSelect,
  disabled = false,
  variant = "default",
  inset = false,
  style,
  textStyle,
}: ContextMenuItemProps) {
  const { onOpenChange } = useContextMenu();

  const handlePress = () => {
    if (!disabled) {
      onSelect?.();
      onOpenChange(false);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.contextMenuItem,
        disabled && styles.contextMenuItemDisabled,
        variant === "destructive" && styles.contextMenuItemDestructive,
        inset && styles.contextMenuItemInset,
        style,
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {typeof children === "string" ? (
        <Text
          style={[
            styles.contextMenuItemText,
            variant === "destructive" && styles.contextMenuItemTextDestructive,
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

interface ContextMenuCheckboxItemProps {
  children: React.ReactNode;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function ContextMenuCheckboxItem({
  children,
  checked = false,
  onCheckedChange,
  disabled = false,
  style,
  textStyle,
}: ContextMenuCheckboxItemProps) {
  const { onOpenChange } = useContextMenu();

  const handlePress = () => {
    if (!disabled) {
      onCheckedChange?.(!checked);
      onOpenChange(false);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.contextMenuItem,
        styles.contextMenuCheckboxItem,
        disabled && styles.contextMenuItemDisabled,
        style,
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.contextMenuCheckboxIndicator}>
        {checked && <Check size={16} color="#000000" />}
      </View>
      {typeof children === "string" ? (
        <Text style={[styles.contextMenuItemText, textStyle]}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

interface ContextMenuRadioItemProps {
  children: React.ReactNode;
  value: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function ContextMenuRadioItem({
  children,
  value,
  style,
  textStyle,
}: ContextMenuRadioItemProps) {
  return (
    <TouchableOpacity
      style={[styles.contextMenuItem, styles.contextMenuRadioItem, style]}
      activeOpacity={0.7}
    >
      <View style={styles.contextMenuRadioIndicator}>
        <Circle size={8} color="#000000" fill="#000000" />
      </View>
      {typeof children === "string" ? (
        <Text style={[styles.contextMenuItemText, textStyle]}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

interface ContextMenuLabelProps {
  children: React.ReactNode;
  inset?: boolean;
  style?: TextStyle;
}

export function ContextMenuLabel({
  children,
  inset = false,
  style,
}: ContextMenuLabelProps) {
  return (
    <Text
      style={[
        styles.contextMenuLabel,
        inset && styles.contextMenuLabelInset,
        style,
      ]}
    >
      {children}
    </Text>
  );
}

interface ContextMenuSeparatorProps {
  style?: ViewStyle;
}

export function ContextMenuSeparator({ style }: ContextMenuSeparatorProps) {
  return <View style={[styles.contextMenuSeparator, style]} />;
}

interface ContextMenuShortcutProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export function ContextMenuShortcut({
  children,
  style,
}: ContextMenuShortcutProps) {
  return <Text style={[styles.contextMenuShortcut, style]}>{children}</Text>;
}

interface ContextMenuGroupProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function ContextMenuGroup({ children, style }: ContextMenuGroupProps) {
  return <View style={[styles.contextMenuGroup, style]}>{children}</View>;
}

// Aliases for compatibility
export const ContextMenuPortal = React.Fragment;
export const ContextMenuSub = ContextMenu;
export const ContextMenuSubContent = ContextMenuContent;
export const ContextMenuSubTrigger = ContextMenuItem;
export const ContextMenuRadioGroup = ContextMenuGroup;

const styles = StyleSheet.create({
  contextMenuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  contextMenuContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    minWidth: 128,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  contextMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  contextMenuItemDisabled: {
    opacity: 0.5,
  },
  contextMenuItemDestructive: {
    backgroundColor: "#FEF2F2",
  },
  contextMenuItemInset: {
    paddingLeft: 32,
  },
  contextMenuItemText: {
    fontSize: 14,
    color: "#000000",
  },
  contextMenuItemTextDestructive: {
    color: "#EF4444",
  },
  contextMenuCheckboxItem: {
    paddingLeft: 32,
  },
  contextMenuCheckboxIndicator: {
    position: "absolute",
    left: 8,
    width: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  contextMenuRadioItem: {
    paddingLeft: 32,
  },
  contextMenuRadioIndicator: {
    position: "absolute",
    left: 8,
    width: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  contextMenuLabel: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
  },
  contextMenuLabelInset: {
    paddingLeft: 32,
  },
  contextMenuSeparator: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 4,
    marginHorizontal: -4,
  },
  contextMenuShortcut: {
    marginLeft: "auto",
    fontSize: 12,
    color: "#9CA3AF",
    letterSpacing: 1,
  },
  contextMenuGroup: {
    // No default styles
  },
});
