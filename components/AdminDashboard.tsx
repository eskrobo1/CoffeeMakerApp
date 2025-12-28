import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import {
  BarChart3,
  Package,
  Coffee,
  Power,
  Wifi,
  Circle,
  TrendingUp,
  Users,
} from "lucide-react-native";
import { useTheme, Shadows } from "../constants/Theme";
import { Button } from "./ui/button";

interface AdminDashboardProps {
  onViewAnalytics: () => void;
  onViewSupplies: () => void;
  onManageDrinks: () => void;
}

export function AdminDashboard({
  onViewAnalytics,
  onViewSupplies,
  onManageDrinks,
}: AdminDashboardProps) {
  const { colors, typography } = useTheme();
  const [devicePower, setDevicePower] = useState(true);
  const [showWifiDialog, setShowWifiDialog] = useState(false);
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiNetwork, setWifiNetwork] = useState("Office-WiFi-5G");

  const handleWifiConnect = () => {
    setShowWifiDialog(false);
    setWifiPassword("");
    Alert.alert("Success", `Connected to ${wifiNetwork}!`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: "#ffffff" }]}>
          Admin Dashboard
        </Text>
        <Text style={styles.headerSubtitle}>Device management & analytics</Text>

        {/* Device Status */}
        <View style={styles.deviceStatus}>
          <View style={styles.deviceStatusRow}>
            <View style={styles.deviceStatusLeft}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: devicePower ? "#4ade80" : "#f87171" },
                ]}
              />
              <Text style={styles.deviceStatusText}>
                {devicePower ? "Device Online" : "Device Offline"}
              </Text>
            </View>
            <View style={styles.powerToggle}>
              <Power size={16} color="#ffffff" />
              <TouchableOpacity
                onPress={() => setDevicePower(!devicePower)}
                style={[
                  styles.switch,
                  { backgroundColor: devicePower ? "#22c55e" : "#6b7280" },
                ]}
              >
                <View
                  style={[
                    styles.switchThumb,
                    { marginLeft: devicePower ? 20 : 2 },
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>

          {devicePower && (
            <View style={styles.deviceInfo}>
              <TouchableOpacity
                onPress={() => setShowWifiDialog(true)}
                style={styles.wifiButton}
              >
                <Wifi size={16} color="#86efac" />
                <Text style={styles.wifiText}>WiFi Connected</Text>
              </TouchableOpacity>
              <View style={styles.readyStatus}>
                <Circle size={16} color="#86efac" fill="#86efac" />
                <Text style={styles.readyText}>Ready to Brew</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Today's Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: "#6F4E37" }]}>
            Today's Overview
          </Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, Shadows.sm]}>
              <View
                style={[
                  styles.statIcon,
                  { backgroundColor: "rgba(111, 78, 55, 0.1)" },
                ]}
              >
                <Coffee size={24} color="#6F4E37" />
              </View>
              <Text style={styles.statValue}>47</Text>
              <Text style={styles.statLabel}>Orders Today</Text>
            </View>
            <View style={[styles.statCard, Shadows.sm]}>
              <View style={[styles.statIcon, { backgroundColor: "#dbeafe" }]}>
                <Users size={24} color="#1d4ed8" />
              </View>
              <Text style={[styles.statValue, { color: "#1d4ed8" }]}>23</Text>
              <Text style={styles.statLabel}>Active Users</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: "#6F4E37" }]}>
            Quick Actions
          </Text>
          <View style={styles.actionsList}>
            <TouchableOpacity
              onPress={onViewAnalytics}
              style={[styles.actionCard, Shadows.sm]}
            >
              <View style={[styles.actionIcon, { backgroundColor: "#22c55e" }]}>
                <BarChart3 size={28} color="#ffffff" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Analytics & Reports</Text>
                <Text style={styles.actionDescription}>
                  View consumption trends & export data
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onViewSupplies}
              style={[styles.actionCard, Shadows.sm]}
            >
              <View style={[styles.actionIcon, { backgroundColor: "#3b82f6" }]}>
                <Package size={28} color="#ffffff" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Supply Management</Text>
                <Text style={styles.actionDescription}>
                  Monitor coffee, milk & sugar levels
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onManageDrinks}
              style={[styles.actionCard, Shadows.sm]}
            >
              <View style={[styles.actionIcon, { backgroundColor: "#a855f7" }]}>
                <Coffee size={28} color="#ffffff" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Drink Availability</Text>
                <Text style={styles.actionDescription}>
                  Enable or disable drink options
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Performance */}
        <View
          style={[
            styles.performanceCard,
            { backgroundColor: "#faf5ff", borderColor: "#e9d5ff" },
          ]}
        >
          <View style={styles.performanceHeader}>
            <TrendingUp size={20} color="#9333ea" />
            <Text style={[styles.performanceTitle, { color: "#581c87" }]}>
              Performance
            </Text>
          </View>
          <View style={styles.performanceList}>
            <Text style={styles.performanceItem}>
              • Average wait time: 2.3 minutes
            </Text>
            <Text style={styles.performanceItem}>
              • Most popular: Cappuccino (34%)
            </Text>
            <Text style={styles.performanceItem}>
              • Peak hours: 9-11 AM, 2-3 PM
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* WiFi Dialog */}
      <Modal
        visible={showWifiDialog}
        transparent
        animationType="fade"
        onRequestClose={() => setShowWifiDialog(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.cardForeground }]}>
              Connect to WiFi
            </Text>

            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Network Name</Text>
              <TextInput
                value={wifiNetwork}
                onChangeText={setWifiNetwork}
                style={[
                  styles.input,
                  { borderColor: colors.border, color: colors.foreground },
                ]}
              />

              <Text style={[styles.inputLabel, { marginTop: 16 }]}>
                Password
              </Text>
              <TextInput
                value={wifiPassword}
                onChangeText={setWifiPassword}
                placeholder="Enter WiFi password"
                placeholderTextColor={colors.mutedForeground}
                secureTextEntry
                style={[
                  styles.input,
                  { borderColor: colors.border, color: colors.foreground },
                ]}
              />
            </View>

            <View style={styles.modalFooter}>
              <Button
                variant="outline"
                onPress={() => setShowWifiDialog(false)}
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button
                onPress={handleWifiConnect}
                style={[styles.modalButton, { backgroundColor: "#3b82f6" }]}
              >
                <Wifi size={16} color="#ffffff" />
                <Text style={styles.connectButtonText}>Connect</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5DC",
  },
  header: {
    backgroundColor: "#7c3aed",
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#e9d5ff",
  },
  deviceStatus: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
  },
  deviceStatusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  deviceStatusLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  deviceStatusText: {
    color: "#ffffff",
    fontSize: 14,
  },
  powerToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  switch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#ffffff",
  },
  deviceInfo: {
    flexDirection: "row",
    gap: 12,
  },
  wifiButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  wifiText: {
    color: "#e9d5ff",
    fontSize: 14,
  },
  readyStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  readyText: {
    color: "#e9d5ff",
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 140,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "600",
    color: "#6F4E37",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#A0826D",
  },
  actionsList: {
    gap: 12,
  },
  actionCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    height: 80,
    alignItems: "center",
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6F4E37",
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    color: "#A0826D",
  },
  performanceCard: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 20,
  },
  performanceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  performanceTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  performanceList: {
    gap: 8,
  },
  performanceItem: {
    fontSize: 14,
    color: "#7c3aed",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  modalBody: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    color: "#6F4E37",
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  modalFooter: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
  connectButtonText: {
    color: "#ffffff",
    marginLeft: 8,
  },
});
