import * as React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Pressable,
} from "react-native";

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open = false, onOpenChange, children }: DialogProps) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => onOpenChange?.(false)}
    >
      <Pressable
        style={styles.dialogOverlay}
        onPress={() => onOpenChange?.(false)}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>{children}</Pressable>
      </Pressable>
    </Modal>
  );
}

interface DialogContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function DialogContent({ children, style }: DialogContentProps) {
  return <View style={[styles.dialogContent, style]}>{children}</View>;
}

interface DialogHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function DialogHeader({ children, style }: DialogHeaderProps) {
  return <View style={[styles.dialogHeader, style]}>{children}</View>;
}

interface DialogTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export function DialogTitle({ children, style }: DialogTitleProps) {
  return <Text style={[styles.dialogTitle, style]}>{children}</Text>;
}

interface DialogDescriptionProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export function DialogDescription({ children, style }: DialogDescriptionProps) {
  return <Text style={[styles.dialogDescription, style]}>{children}</Text>;
}

interface DialogFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function DialogFooter({ children, style }: DialogFooterProps) {
  return <View style={[styles.dialogFooter, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  dialogOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dialogContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxWidth: 448,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  dialogHeader: {
    marginBottom: 16,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6F4E37",
    marginBottom: 8,
  },
  dialogDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  dialogFooter: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-end",
    marginTop: 24,
  },
});
