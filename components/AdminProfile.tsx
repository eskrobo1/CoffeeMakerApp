import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  User,
  Mail,
  Shield,
  Coffee,
  Heart,
  Bell,
  LogOut,
} from "lucide-react-native";
import { useTheme, Shadows } from "../constants/Theme";
import { Button } from "./ui/button";

interface AdminProfileProps {
  userName: string;
  totalOrders: number;
  favoritesCount: number;
  onBack: () => void;
  onLogout: () => void;
  saveOrderHistory?: boolean;
  onToggleOrderHistory?: (value: boolean) => void;
  notifications?: boolean;
  onToggleNotifications?: (value: boolean) => void;
}

export function AdminProfile({
  userName,
  totalOrders,
  favoritesCount,
  onBack,
  onLogout,
  saveOrderHistory = true,
  onToggleOrderHistory,
  notifications = true,
  onToggleNotifications,
}: AdminProfileProps) {
  const { colors } = useTheme();
  const displayName = userName.split("@")[0];

  return (
    <View style={[styles.container, { backgroundColor: "#f9fafb" }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          Profile
        </Text>

        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            <User size={40} color="#ffffff" />
          </View>
          <Text style={[styles.displayName, { color: colors.foreground }]}>
            {displayName}
          </Text>
          <View style={styles.emailRow}>
            <Mail size={16} color={colors.mutedForeground} />
            <Text style={[styles.email, { color: colors.mutedForeground }]}>
              {userName}
            </Text>
          </View>
          <View style={styles.badge}>
            <Shield size={12} color="#ffffff" />
            <Text style={styles.badgeText}>Administrator</Text>
          </View>

          <Button onPress={onLogout} style={styles.logoutButton}>
            <LogOut size={20} color="#ffffff" />
            <Text style={styles.logoutText}>Logout</Text>
          </Button>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats */}
        <View
          style={[styles.card, Shadows.sm, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>
            Your Statistics
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Coffee size={24} color="#ea580c" />
              </View>
              <Text style={styles.statValue}>{totalOrders}</Text>
              <Text style={styles.statLabel}>Total Orders</Text>
            </View>
            <View style={styles.statItem}>
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: "#ffe4e6" },
                ]}
              >
                <Heart size={24} color="#e11d48" />
              </View>
              <Text style={styles.statValue}>{favoritesCount}</Text>
              <Text style={styles.statLabel}>Favorites</Text>
            </View>
          </View>
        </View>

        {/* Preferences */}
        <View
          style={[styles.card, Shadows.sm, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>
            Preferences
          </Text>
          <View style={styles.preferencesList}>
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceLeft}>
                <View
                  style={[
                    styles.preferenceIcon,
                    { backgroundColor: "#dbeafe" },
                  ]}
                >
                  <Bell size={20} color="#2563eb" />
                </View>
                <View>
                  <Text
                    style={[
                      styles.preferenceTitle,
                      { color: colors.foreground },
                    ]}
                  >
                    Push Notifications
                  </Text>
                  <Text
                    style={[
                      styles.preferenceDescription,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    Get notified when ready
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => onToggleNotifications?.(!notifications)}
                style={[
                  styles.switch,
                  { backgroundColor: notifications ? "#22c55e" : "#d1d5db" },
                ]}
              >
                <View
                  style={[
                    styles.switchThumb,
                    { marginLeft: notifications ? 20 : 2 },
                  ]}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.preferenceItem}>
              <View style={styles.preferenceLeft}>
                <View
                  style={[
                    styles.preferenceIcon,
                    { backgroundColor: "#dcfce7" },
                  ]}
                >
                  <Coffee size={20} color="#16a34a" />
                </View>
                <View>
                  <Text
                    style={[
                      styles.preferenceTitle,
                      { color: colors.foreground },
                    ]}
                  >
                    Save Order History
                  </Text>
                  <Text
                    style={[
                      styles.preferenceDescription,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    Track your coffee habits
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => onToggleOrderHistory?.(!saveOrderHistory)}
                style={[
                  styles.switch,
                  { backgroundColor: saveOrderHistory ? "#22c55e" : "#d1d5db" },
                ]}
              >
                <View
                  style={[
                    styles.switchThumb,
                    { marginLeft: saveOrderHistory ? 20 : 2 },
                  ]}
                />
              </TouchableOpacity>
            </View>
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 32,
  },
  profileInfo: {
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: "#1f2937",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  displayName: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  emailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  email: {
    fontSize: 14,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#000000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  logoutButton: {
    width: "100%",
    height: 48,
    backgroundColor: "#000000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  logoutText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 140,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 16,
  },
  statItem: {
    flex: 1,
    backgroundColor: "#fff7ed",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  statIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#ffedd5",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  preferencesList: {
    gap: 16,
  },
  preferenceItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  preferenceLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  preferenceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  preferenceTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  preferenceDescription: {
    fontSize: 12,
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
});
