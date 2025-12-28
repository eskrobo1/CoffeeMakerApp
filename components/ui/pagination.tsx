import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react-native";

interface PaginationProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Pagination({ children, style }: PaginationProps) {
  return (
    <View style={[styles.pagination, style]} accessibilityLabel="pagination">
      {children}
    </View>
  );
}

interface PaginationContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function PaginationContent({ children, style }: PaginationContentProps) {
  return <View style={[styles.paginationContent, style]}>{children}</View>;
}

interface PaginationItemProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function PaginationItem({ children, style }: PaginationItemProps) {
  return <View style={[styles.paginationItem, style]}>{children}</View>;
}

interface PaginationLinkProps {
  children: React.ReactNode;
  onPress?: () => void;
  isActive?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function PaginationLink({
  children,
  onPress,
  isActive = false,
  disabled = false,
  style,
  textStyle,
}: PaginationLinkProps) {
  return (
    <TouchableOpacity
      style={[
        styles.paginationLink,
        isActive && styles.paginationLinkActive,
        disabled && styles.paginationLinkDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive, disabled }}
    >
      {typeof children === "string" || typeof children === "number" ? (
        <Text
          style={[
            styles.paginationLinkText,
            isActive && styles.paginationLinkTextActive,
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

interface PaginationPreviousProps {
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export function PaginationPrevious({
  onPress,
  disabled = false,
  style,
}: PaginationPreviousProps) {
  return (
    <TouchableOpacity
      style={[
        styles.paginationLink,
        styles.paginationPrevious,
        disabled && styles.paginationLinkDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Go to previous page"
      accessibilityState={{ disabled }}
    >
      <ChevronLeft size={16} color={disabled ? "#9CA3AF" : "#000000"} />
      <Text
        style={[
          styles.paginationNavigationText,
          disabled && styles.disabledText,
        ]}
      >
        Previous
      </Text>
    </TouchableOpacity>
  );
}

interface PaginationNextProps {
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export function PaginationNext({
  onPress,
  disabled = false,
  style,
}: PaginationNextProps) {
  return (
    <TouchableOpacity
      style={[
        styles.paginationLink,
        styles.paginationNext,
        disabled && styles.paginationLinkDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Go to next page"
      accessibilityState={{ disabled }}
    >
      <Text
        style={[
          styles.paginationNavigationText,
          disabled && styles.disabledText,
        ]}
      >
        Next
      </Text>
      <ChevronRight size={16} color={disabled ? "#9CA3AF" : "#000000"} />
    </TouchableOpacity>
  );
}

interface PaginationEllipsisProps {
  style?: ViewStyle;
}

export function PaginationEllipsis({ style }: PaginationEllipsisProps) {
  return (
    <View style={[styles.paginationEllipsis, style]} accessible={false}>
      <MoreHorizontal size={16} color="#6B7280" />
    </View>
  );
}

const styles = StyleSheet.create({
  pagination: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  paginationItem: {
    // No default styles
  },
  paginationLink: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  paginationLinkActive: {
    borderColor: "#000000",
    backgroundColor: "#F9FAFB",
  },
  paginationLinkDisabled: {
    opacity: 0.5,
  },
  paginationLinkText: {
    fontSize: 14,
    color: "#000000",
  },
  paginationLinkTextActive: {
    fontWeight: "500",
  },
  paginationPrevious: {
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 10,
    width: "auto",
  },
  paginationNext: {
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 10,
    width: "auto",
  },
  paginationNavigationText: {
    fontSize: 14,
    color: "#000000",
  },
  disabledText: {
    color: "#9CA3AF",
  },
  paginationEllipsis: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
});
