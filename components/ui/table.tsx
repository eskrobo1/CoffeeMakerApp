import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from "react-native";

interface TableProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface TableHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface TableBodyProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface TableFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface TableRowProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  selected?: boolean;
}

interface TableHeadProps {
  children: React.ReactNode;
  style?: ViewStyle | TextStyle;
  flex?: number;
}

interface TableCellProps {
  children: React.ReactNode;
  style?: ViewStyle | TextStyle;
  flex?: number;
}

interface TableCaptionProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export function Table({ children, style }: TableProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.tableContainer}
    >
      <View style={[styles.table, style]}>{children}</View>
    </ScrollView>
  );
}

export function TableHeader({ children, style }: TableHeaderProps) {
  return <View style={[styles.tableHeader, style]}>{children}</View>;
}

export function TableBody({ children, style }: TableBodyProps) {
  return <View style={[styles.tableBody, style]}>{children}</View>;
}

export function TableFooter({ children, style }: TableFooterProps) {
  return <View style={[styles.tableFooter, style]}>{children}</View>;
}

export function TableRow({
  children,
  style,
  onPress,
  selected,
}: TableRowProps) {
  const RowComponent = onPress ? TouchableOpacity : View;

  return (
    <RowComponent
      style={[styles.tableRow, selected && styles.tableRowSelected, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {children}
    </RowComponent>
  );
}

export function TableHead({ children, style, flex = 1 }: TableHeadProps) {
  return (
    <View style={[styles.tableHead, { flex }, style]}>
      {typeof children === "string" ? (
        <Text style={styles.tableHeadText}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

export function TableCell({ children, style, flex = 1 }: TableCellProps) {
  return (
    <View style={[styles.tableCell, { flex }, style]}>
      {typeof children === "string" ? (
        <Text style={styles.tableCellText}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

export function TableCaption({ children, style }: TableCaptionProps) {
  return <Text style={[styles.tableCaption, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  tableContainer: {
    width: "100%",
  },
  table: {
    width: "100%",
    minWidth: "100%",
  },
  tableHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tableBody: {
    width: "100%",
  },
  tableFooter: {
    backgroundColor: "rgba(249, 250, 251, 0.5)",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    minHeight: 40,
  },
  tableRowSelected: {
    backgroundColor: "rgba(249, 250, 251, 0.5)",
  },
  tableHead: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    justifyContent: "center",
  },
  tableHeadText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  tableCell: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: "center",
  },
  tableCellText: {
    fontSize: 14,
    color: "#374151",
  },
  tableCaption: {
    marginTop: 16,
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
});
