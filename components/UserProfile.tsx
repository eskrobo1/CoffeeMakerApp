import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import {
  User,
  Mail,
  Coffee,
  Heart,
  LogOut,
  Shield,
  Bell,
} from "lucide-react-native";
import { Switch } from "./ui/switch";
import { LinearGradient } from "expo-linear-gradient";
import type { UserType } from "../types";

interface UserProfileProps {
  userName: string;
  userType: UserType;
  favoritesCount: number;
  totalOrders: number;
  onLogout: () => void;
  saveOrderHistory?: boolean;
  onToggleOrderHistory?: (value: boolean) => void;
  notifications?: boolean;
  onToggleNotifications?: (value: boolean) => void;
}

export function UserProfile({
  userName,
  userType,
  favoritesCount,
  totalOrders,
  onLogout,
  saveOrderHistory = true,
  onToggleOrderHistory,
  notifications = true,
  onToggleNotifications,
}: UserProfileProps) {
  const displayName = userName.split("@")[0];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>

        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <User size={40} color="#4b5563" />
          </View>
          <Text style={styles.displayName}>{displayName}</Text>
          <View style={styles.emailContainer}>
            <Mail size={16} color="#6b7280" />
            <Text style={styles.emailText}>{userName}</Text>
          </View>

          {userType === "admin" && (
            <View style={styles.adminBadge}>
              <Shield size={12} color="#ffffff" style={styles.badgeIcon} />
              <Text style={styles.adminBadgeText}>Administrator</Text>
            </View>
          )}

          {/* Logout Button */}
          <TouchableOpacity
            onPress={onLogout}
            style={styles.logoutButton}
            activeOpacity={0.8}
          >
            <LogOut size={20} color="#ffffff" style={styles.logoutIcon} />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Your Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Coffee size={24} color="#b45309" />
              </View>
              <Text style={styles.statValue}>{totalOrders}</Text>
              <Text style={styles.statLabel}>Total Orders</Text>
            </View>

            <View style={styles.statItemRose}>
              <View style={styles.statIconContainerRose}>
                <Heart size={24} color="#e11d48" />
              </View>
              <Text style={styles.statValue}>{favoritesCount}</Text>
              <Text style={styles.statLabel}>Favorites</Text>
            </View>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.preferencesCard}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <View style={styles.preferenceIconBlue}>
                <Bell size={20} color="#2563eb" />
              </View>
              <View style={styles.preferenceText}>
                <Text style={styles.preferenceName}>Push Notifications</Text>
                <Text style={styles.preferenceDescription}>
                  Get notified when ready
                </Text>
              </View>
            </View>
            <Switch
              checked={notifications}
              onCheckedChange={onToggleNotifications}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <View style={styles.preferenceIconGreen}>
                <Coffee size={20} color="#16a34a" />
              </View>
              <View style={styles.preferenceText}>
                <Text style={styles.preferenceName}>Save Order History</Text>
                <Text style={styles.preferenceDescription}>
                  Track your coffee habits
                </Text>
              </View>
            </View>
            <Switch
              checked={saveOrderHistory}
              onCheckedChange={onToggleOrderHistory}
            />
          </View>
        </View>

        {/* Admin Info */}
        {userType === "admin" && (
          <LinearGradient
            colors={["#faf5ff", "#eff6ff"]}
            style={styles.adminCard}
          >
            <View style={styles.adminHeader}>
              <Shield size={20} color="#7c3aed" />
              <Text style={styles.adminTitle}>Admin Access</Text>
            </View>
            <Text style={styles.adminDescription}>
              You have full administrative access to device management,
              analytics, supply monitoring, and drink availability settings.
            </Text>
          </LinearGradient>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 20,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 32,
  },
  profileInfo: {
    alignItems: "center",
  },
  avatarContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#f3f4f6",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  displayName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  emailText: {
    fontSize: 14,
    color: "#6b7280",
  },
  adminBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
  },
  badgeIcon: {
    marginRight: 4,
  },
  adminBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
  },
  logoutButton: {
    width: "100%",
    height: 48,
    backgroundColor: "#000000",
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    paddingBottom: 140,
  },
  statsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fffbeb",
    borderRadius: 12,
  },
  statItemRose: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff1f2",
    borderRadius: 12,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#fef3c7",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statIconContainerRose: {
    width: 48,
    height: 48,
    backgroundColor: "#fecdd3",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#4b5563",
  },
  preferencesCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 24,
  },
  preferenceItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    marginBottom: 16,
  },
  preferenceInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  preferenceIconBlue: {
    width: 40,
    height: 40,
    backgroundColor: "#dbeafe",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  preferenceIconGreen: {
    width: 40,
    height: 40,
    backgroundColor: "#dcfce7",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  preferenceText: {
    flex: 1,
  },
  preferenceName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 2,
  },
  preferenceDescription: {
    fontSize: 12,
    color: "#6b7280",
  },
  adminCard: {
    borderWidth: 2,
    borderColor: "#e9d5ff",
    borderRadius: 16,
    padding: 24,
  },
  adminHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  adminTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#581c87",
  },
  adminDescription: {
    fontSize: 14,
    color: "#6b21a8",
    lineHeight: 20,
  },
});
