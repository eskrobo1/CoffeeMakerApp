import * as React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Pressable,
} from "react-native";

interface AlertDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface AlertDialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AlertDialogContext = React.createContext<AlertDialogContextValue | null>(
  null
);

export function AlertDialog({
  open = false,
  onOpenChange,
  children,
}: AlertDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isOpen = open !== undefined ? open : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (open === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  return (
    <AlertDialogContext.Provider
      value={{ open: isOpen, onOpenChange: handleOpenChange }}
    >
      {children}
    </AlertDialogContext.Provider>
  );
}

interface AlertDialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export function AlertDialogTrigger({
  children,
  asChild,
}: AlertDialogTriggerProps) {
  const context = React.useContext(AlertDialogContext);

  if (!context) {
    throw new Error("AlertDialogTrigger must be used within AlertDialog");
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onPress: () => context.onOpenChange(true),
    } as any);
  }

  return (
    <TouchableOpacity onPress={() => context.onOpenChange(true)}>
      {children}
    </TouchableOpacity>
  );
}

interface AlertDialogContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function AlertDialogContent({
  children,
  style,
}: AlertDialogContentProps) {
  const context = React.useContext(AlertDialogContext);

  if (!context) {
    throw new Error("AlertDialogContent must be used within AlertDialog");
  }

  return (
    <Modal
      visible={context.open}
      transparent
      animationType="fade"
      onRequestClose={() => context.onOpenChange(false)}
    >
      <Pressable
        style={styles.overlay}
        onPress={() => context.onOpenChange(false)}
      >
        <Pressable
          style={[styles.content, style]}
          onPress={(e) => e.stopPropagation()}
        >
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

interface AlertDialogHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function AlertDialogHeader({ children, style }: AlertDialogHeaderProps) {
  return <View style={[styles.header, style]}>{children}</View>;
}

interface AlertDialogFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function AlertDialogFooter({ children, style }: AlertDialogFooterProps) {
  return <View style={[styles.footer, style]}>{children}</View>;
}

interface AlertDialogTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export function AlertDialogTitle({ children, style }: AlertDialogTitleProps) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

interface AlertDialogDescriptionProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export function AlertDialogDescription({
  children,
  style,
}: AlertDialogDescriptionProps) {
  return <Text style={[styles.description, style]}>{children}</Text>;
}

interface AlertDialogActionProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function AlertDialogAction({
  children,
  onPress,
  style,
  textStyle,
}: AlertDialogActionProps) {
  const context = React.useContext(AlertDialogContext);

  const handlePress = () => {
    onPress?.();
    context?.onOpenChange(false);
  };

  return (
    <TouchableOpacity
      style={[styles.actionButton, style]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={[styles.actionButtonText, textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
}

interface AlertDialogCancelProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function AlertDialogCancel({
  children,
  onPress,
  style,
  textStyle,
}: AlertDialogCancelProps) {
  const context = React.useContext(AlertDialogContext);

  const handlePress = () => {
    onPress?.();
    context?.onOpenChange(false);
  };

  return (
    <TouchableOpacity
      style={[styles.cancelButton, style]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={[styles.cancelButtonText, textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
}

// Alias exports
export const AlertDialogPortal = React.Fragment;
export const AlertDialogOverlay = React.Fragment;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 24,
    width: "90%",
    maxWidth: 500,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: "#000000",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "transparent",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cancelButtonText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});
