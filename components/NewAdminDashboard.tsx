import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  ArrowLeft,
  Droplet,
  Wifi,
  WifiOff,
  Sparkles,
  BarChart3,
  Package,
  Coffee,
  Users,
} from "lucide-react-native";
import { useTheme, Shadows } from "../constants/Theme";

interface NewAdminDashboardProps {
  onBack: () => void;
  onViewAnalytics: () => void;
  onViewSupplies: () => void;
  onManageDrinks: () => void;
}

export function NewAdminDashboard({
  onBack,
  onViewAnalytics,
  onViewSupplies,
  onManageDrinks,
}: NewAdminDashboardProps) {
  const { colors } = useTheme();
  const machineStatus = "ready"; // 'ready' or 'off'
  const wifiConnected = true;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          Admin Dashboard
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Coffee Machine Visual */}
        <View style={styles.machineSection}>
          <View
            style={[styles.machineImage, { backgroundColor: colors.muted }]}
          >
            <Text style={styles.machinePlaceholder}>☕</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  machineStatus === "ready" ? "#dcfce7" : "#fee2e2",
              },
            ]}
          >
            <Text
              style={[
                styles.statusBadgeText,
                { color: machineStatus === "ready" ? "#15803d" : "#991b1b" },
              ]}
            >
              {machineStatus === "ready" ? "Ready" : "Turned off"}
            </Text>
          </View>
        </View>

        {/* Status Icons */}
        <View style={styles.statusIconsGrid}>
          <View style={styles.statusIconItem}>
            <View
              style={[styles.statusIconCircle, { backgroundColor: "#dbeafe" }]}
            >
              <Droplet size={24} color="#2563eb" />
            </View>
            <Text
              style={[
                styles.statusIconLabel,
                { color: colors.mutedForeground },
              ]}
            >
              Rinse
            </Text>
          </View>

          <View style={styles.statusIconItem}>
            <View
              style={[
                styles.statusIconCircle,
                { backgroundColor: wifiConnected ? "#dcfce7" : "#fee2e2" },
              ]}
            >
              {wifiConnected ? (
                <Wifi size={24} color="#16a34a" />
              ) : (
                <WifiOff size={24} color="#dc2626" />
              )}
            </View>
            <Text
              style={[
                styles.statusIconLabel,
                { color: colors.mutedForeground },
              ]}
            >
              WiFi {wifiConnected ? "Connected" : "Off"}
            </Text>
          </View>

          <View style={styles.statusIconItem}>
            <View
              style={[styles.statusIconCircle, { backgroundColor: "#f3e8ff" }]}
            >
              <Sparkles size={24} color="#9333ea" />
            </View>
            <Text
              style={[
                styles.statusIconLabel,
                { color: colors.mutedForeground },
              ]}
            >
              Clean
            </Text>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Summary
          </Text>
          <View style={styles.summaryGrid}>
            <View
              style={[
                styles.summaryCard,
                Shadows.sm,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View
                style={[styles.summaryIcon, { backgroundColor: "#fed7aa" }]}
              >
                <Coffee size={24} color="#ea580c" />
              </View>
              <View>
                <Text
                  style={[styles.summaryValue, { color: colors.foreground }]}
                >
                  47
                </Text>
                <Text
                  style={[
                    styles.summaryLabel,
                    { color: colors.mutedForeground },
                  ]}
                >
                  Orders Today
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.summaryCard,
                Shadows.sm,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View
                style={[styles.summaryIcon, { backgroundColor: "#bfdbfe" }]}
              >
                <Users size={24} color="#2563eb" />
              </View>
              <View>
                <Text
                  style={[styles.summaryValue, { color: colors.foreground }]}
                >
                  23
                </Text>
                <Text
                  style={[
                    styles.summaryLabel,
                    { color: colors.mutedForeground },
                  ]}
                >
                  Active Users
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.summaryCard,
                Shadows.sm,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View
                style={[styles.summaryIcon, { backgroundColor: "#d1fae5" }]}
              >
                <Text style={styles.cupIcon}>☕</Text>
              </View>
              <View>
                <Text
                  style={[styles.summaryValue, { color: colors.foreground }]}
                >
                  Yes
                </Text>
                <Text
                  style={[
                    styles.summaryLabel,
                    { color: colors.mutedForeground },
                  ]}
                >
                  Cup
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.summaryCard,
                Shadows.sm,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View
                style={[styles.summaryIcon, { backgroundColor: "#e9d5ff" }]}
              >
                <Sparkles size={24} color="#9333ea" />
              </View>
              <View>
                <Text
                  style={[styles.summaryValue, { color: colors.foreground }]}
                >
                  50 days
                </Text>
                <Text
                  style={[
                    styles.summaryLabel,
                    { color: colors.mutedForeground },
                  ]}
                >
                  next clean
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Quick Actions
          </Text>
          <View style={styles.actionsList}>
            <TouchableOpacity
              onPress={onViewAnalytics}
              style={[
                styles.actionCard,
                Shadows.sm,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={[styles.actionIcon, { backgroundColor: "#22c55e" }]}>
                <BarChart3 size={24} color="#ffffff" />
              </View>
              <View style={styles.actionContent}>
                <Text
                  style={[styles.actionTitle, { color: colors.foreground }]}
                >
                  Analytics & Reports
                </Text>
                <Text
                  style={[
                    styles.actionDescription,
                    { color: colors.mutedForeground },
                  ]}
                >
                  View consumption trends & export data
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onViewSupplies}
              style={[
                styles.actionCard,
                Shadows.sm,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={[styles.actionIcon, { backgroundColor: "#3b82f6" }]}>
                <Package size={24} color="#ffffff" />
              </View>
              <View style={styles.actionContent}>
                <Text
                  style={[styles.actionTitle, { color: colors.foreground }]}
                >
                  Supply Management
                </Text>
                <Text
                  style={[
                    styles.actionDescription,
                    { color: colors.mutedForeground },
                  ]}
                >
                  Monitor coffee, milk & sugar levels
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onManageDrinks}
              style={[
                styles.actionCard,
                Shadows.sm,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={[styles.actionIcon, { backgroundColor: "#9333ea" }]}>
                <Coffee size={24} color="#ffffff" />
              </View>
              <View style={styles.actionContent}>
                <Text
                  style={[styles.actionTitle, { color: colors.foreground }]}
                >
                  Drink Availability
                </Text>
                <Text
                  style={[
                    styles.actionDescription,
                    { color: colors.mutedForeground },
                  ]}
                >
                  Enable or disable drink options
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 140,
  },
  machineSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  machineImage: {
    width: 200,
    height: 180,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  machinePlaceholder: {
    fontSize: 64,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statusIconsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statusIconItem: {
    alignItems: "center",
    gap: 8,
  },
  statusIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  statusIconLabel: {
    fontSize: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  summaryCard: {
    width: "48%",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  cupIcon: {
    fontSize: 24,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "600",
  },
  summaryLabel: {
    fontSize: 12,
  },
  actionsList: {
    gap: 12,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderWidth: 1,
    borderRadius: 16,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
  },
});
