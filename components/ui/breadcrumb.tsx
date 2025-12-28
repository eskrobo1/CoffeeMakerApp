import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { ChevronRight, MoreHorizontal } from "lucide-react-native";

interface BreadcrumbProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Breadcrumb({ children, style }: BreadcrumbProps) {
  return (
    <View
      style={[styles.breadcrumb, style]}
      accessible
      accessibilityLabel="breadcrumb"
    >
      {children}
    </View>
  );
}

interface BreadcrumbListProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function BreadcrumbList({ children, style }: BreadcrumbListProps) {
  return <View style={[styles.breadcrumbList, style]}>{children}</View>;
}

interface BreadcrumbItemProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function BreadcrumbItem({ children, style }: BreadcrumbItemProps) {
  return <View style={[styles.breadcrumbItem, style]}>{children}</View>;
}

interface BreadcrumbLinkProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function BreadcrumbLink({
  children,
  onPress,
  style,
  textStyle,
}: BreadcrumbLinkProps) {
  return (
    <TouchableOpacity
      style={[styles.breadcrumbLink, style]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="link"
    >
      {typeof children === "string" ? (
        <Text style={[styles.breadcrumbLinkText, textStyle]}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

interface BreadcrumbPageProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export function BreadcrumbPage({ children, style }: BreadcrumbPageProps) {
  return (
    <Text
      style={[styles.breadcrumbPage, style]}
      accessible
      accessibilityRole="text"
    >
      {children}
    </Text>
  );
}

interface BreadcrumbSeparatorProps {
  children?: React.ReactNode;
  style?: ViewStyle;
}

export function BreadcrumbSeparator({
  children,
  style,
}: BreadcrumbSeparatorProps) {
  return (
    <View
      style={[styles.breadcrumbSeparator, style]}
      accessible={false}
      importantForAccessibility="no"
    >
      {children || <ChevronRight size={14} color="#6B7280" />}
    </View>
  );
}

interface BreadcrumbEllipsisProps {
  style?: ViewStyle;
}

export function BreadcrumbEllipsis({ style }: BreadcrumbEllipsisProps) {
  return (
    <View
      style={[styles.breadcrumbEllipsis, style]}
      accessible={false}
      importantForAccessibility="no"
    >
      <MoreHorizontal size={16} color="#6B7280" />
    </View>
  );
}

const styles = StyleSheet.create({
  breadcrumb: {
    width: "100%",
  },
  breadcrumbList: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
  },
  breadcrumbItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  breadcrumbLink: {
    // No default styles needed
  },
  breadcrumbLinkText: {
    fontSize: 14,
    color: "#6B7280",
  },
  breadcrumbPage: {
    fontSize: 14,
    color: "#000000",
    fontWeight: "400",
  },
  breadcrumbSeparator: {
    justifyContent: "center",
    alignItems: "center",
  },
  breadcrumbEllipsis: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
});
