import * as React from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Modal,
} from "react-native";
import { Search } from "lucide-react-native";

interface CommandContextValue {
  search: string;
  setSearch: (search: string) => void;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}

const CommandContext = React.createContext<CommandContextValue | null>(null);

function useCommand() {
  const context = React.useContext(CommandContext);
  if (!context) {
    throw new Error("useCommand must be used within Command");
  }
  return context;
}

interface CommandProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Command({ children, style }: CommandProps) {
  const [search, setSearch] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  return (
    <CommandContext.Provider
      value={{ search, setSearch, selectedIndex, setSelectedIndex }}
    >
      <View style={[styles.command, style]}>{children}</View>
    </CommandContext.Provider>
  );
}

interface CommandDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function CommandDialog({
  open = false,
  onOpenChange,
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  style,
}: CommandDialogProps) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => onOpenChange?.(false)}
    >
      <View style={styles.commandDialogOverlay}>
        <View style={[styles.commandDialogContent, style]}>
          <View style={styles.commandDialogHeader}>
            <Text style={styles.commandDialogTitle}>{title}</Text>
            <Text style={styles.commandDialogDescription}>{description}</Text>
          </View>
          <Command>{children}</Command>
        </View>
      </View>
    </Modal>
  );
}

interface CommandInputProps {
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  style?: ViewStyle;
  inputStyle?: TextStyle;
}

export function CommandInput({
  placeholder = "Type a command or search...",
  value,
  onValueChange,
  style,
  inputStyle,
}: CommandInputProps) {
  const { search, setSearch } = useCommand();

  const currentValue = value !== undefined ? value : search;

  const handleChange = (text: string) => {
    if (value === undefined) {
      setSearch(text);
    }
    onValueChange?.(text);
  };

  return (
    <View style={[styles.commandInputWrapper, style]}>
      <Search size={16} color="#9CA3AF" />
      <TextInput
        style={[styles.commandInput, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={currentValue}
        onChangeText={handleChange}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}

interface CommandListProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function CommandList({ children, style }: CommandListProps) {
  return (
    <ScrollView
      style={[styles.commandList, style]}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}

interface CommandEmptyProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export function CommandEmpty({ children, style }: CommandEmptyProps) {
  return <Text style={[styles.commandEmpty, style]}>{children}</Text>;
}

interface CommandGroupProps {
  heading?: string;
  children: React.ReactNode;
  style?: ViewStyle;
  headingStyle?: TextStyle;
}

export function CommandGroup({
  heading,
  children,
  style,
  headingStyle,
}: CommandGroupProps) {
  return (
    <View style={[styles.commandGroup, style]}>
      {heading && (
        <Text style={[styles.commandGroupHeading, headingStyle]}>
          {heading}
        </Text>
      )}
      {children}
    </View>
  );
}

interface CommandSeparatorProps {
  style?: ViewStyle;
}

export function CommandSeparator({ style }: CommandSeparatorProps) {
  return <View style={[styles.commandSeparator, style]} />;
}

interface CommandItemProps {
  children: React.ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function CommandItem({
  children,
  onSelect,
  disabled = false,
  style,
  textStyle,
}: CommandItemProps) {
  return (
    <TouchableOpacity
      style={[
        styles.commandItem,
        disabled && styles.commandItemDisabled,
        style,
      ]}
      onPress={onSelect}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {typeof children === "string" ? (
        <Text style={[styles.commandItemText, textStyle]}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

interface CommandShortcutProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export function CommandShortcut({ children, style }: CommandShortcutProps) {
  return <Text style={[styles.commandShortcut, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  command: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    overflow: "hidden",
  },
  commandDialogOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  commandDialogContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    width: "100%",
    maxWidth: 500,
    maxHeight: "80%",
    overflow: "hidden",
  },
  commandDialogHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  commandDialogTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  commandDialogDescription: {
    fontSize: 14,
    color: "#6B7280",
  },
  commandInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingHorizontal: 12,
  },
  commandInput: {
    flex: 1,
    fontSize: 14,
    color: "#000000",
    padding: 0,
  },
  commandList: {
    maxHeight: 300,
    paddingVertical: 4,
  },
  commandEmpty: {
    paddingVertical: 24,
    textAlign: "center",
    fontSize: 14,
    color: "#6B7280",
  },
  commandGroup: {
    paddingVertical: 4,
  },
  commandGroupHeading: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
  },
  commandSeparator: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginHorizontal: -4,
    marginVertical: 4,
  },
  commandItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  commandItemDisabled: {
    opacity: 0.5,
  },
  commandItemText: {
    fontSize: 14,
    color: "#000000",
  },
  commandShortcut: {
    marginLeft: "auto",
    fontSize: 12,
    color: "#9CA3AF",
    letterSpacing: 1,
  },
});
