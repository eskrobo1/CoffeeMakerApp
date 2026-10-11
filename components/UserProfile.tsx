// components/UserProfile.tsx
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  ArrowLeft,
  User,
  Mail,
  Coffee,
  Heart,
  LogOut,
  Shield,
  Bell,
  AlertCircle,
} from "lucide-react-native";
import type { UserType } from "../types";

interface UserProfileProps {
  userName: string; // email
  displayName?: string; // puno ime (Emina Skrobo) — prikazuje se u headeru
  userType: UserType;
  favoritesCount: number;
  totalOrders: number;
  onLogout: () => void;
  onBack?: () => void;
  onReportProblem?: () => void;
  saveOrderHistory?: boolean;
  onToggleOrderHistory?: (value: boolean) => void;
  notifications?: boolean;
  onToggleNotifications?: (value: boolean) => void;
}

export function UserProfile({
  userName,
  displayName,
  userType,
  favoritesCount,
  totalOrders,
  onLogout,
  onBack,
  onReportProblem,
  saveOrderHistory = true,
  onToggleOrderHistory,
  notifications = true,
  onToggleNotifications,
}: UserProfileProps) {
  // Koristi displayName (puno ime) ako postoji, inače dio emaila
  const headerName = displayName || userName.split("@")[0];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Profile info */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <User size={40} color="#4b5563" />
        </View>
        {/* Puno ime */}
        <Text style={styles.displayName}>{headerName}</Text>
        <View style={styles.emailContainer}>
          <Mail size={16} color="#6b7280" />
          <Text style={styles.emailText}>{userName}</Text>
        </View>
        {userType === "admin" && (
          <View style={styles.adminBadge}>
            <Shield size={12} color="#ffffff" />
            <Text style={styles.adminBadgeText}>Administrator</Text>
          </View>
        )}
        <TouchableOpacity
          onPress={onLogout}
          style={styles.logoutButton}
          activeOpacity={0.8}
        >
          <LogOut size={20} color="#ffffff" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

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
              <Text style={styles.statLabel}>Favourites</Text>
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
              <View>
                <Text style={styles.preferenceName}>Push Notifications</Text>
                <Text style={styles.preferenceDescription}>
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
            <View style={styles.preferenceInfo}>
              <View style={styles.preferenceIconGreen}>
                <Coffee size={20} color="#16a34a" />
              </View>
              <View>
                <Text style={styles.preferenceName}>Save Order History</Text>
                <Text style={styles.preferenceDescription}>
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

        {/* Report a Problem */}
        {onReportProblem && (
          <TouchableOpacity
            style={styles.reportButton}
            onPress={onReportProblem}
            activeOpacity={0.8}
          >
            <View style={styles.reportIconWrap}>
              <AlertCircle size={20} color="#dc2626" />
            </View>
            <View style={styles.reportTextWrap}>
              <Text style={styles.reportTitle}>Report a Problem</Text>
              <Text style={styles.reportSub}>
                Send a message to the administrator
              </Text>
            </View>
            <Text style={styles.reportArrow}>→</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "600", color: "#111827" },
  profileSection: {
    backgroundColor: "#ffffff",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  avatarContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#f3f4f6",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    marginTop: 16,
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
  emailText: { fontSize: 14, color: "#6b7280" },
  adminBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#000000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
  },
  adminBadgeText: { fontSize: 12, fontWeight: "600", color: "#ffffff" },
  logoutButton: {
    width: "100%",
    height: 48,
    backgroundColor: "#000000",
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  logoutButtonText: { fontSize: 16, fontWeight: "600", color: "#ffffff" },
  content: { flex: 1 },
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
    shadowOffset: { width: 0, height: 1 },
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
  statsGrid: { flexDirection: "row", gap: 16 },
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
  statLabel: { fontSize: 14, color: "#4b5563" },
  preferencesCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 16,
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
  preferenceName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 2,
  },
  preferenceDescription: { fontSize: 12, color: "#6b7280" },
  switch: { width: 44, height: 24, borderRadius: 12, padding: 2 },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#ffffff",
  },
  reportButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#fecaca",
    padding: 16,
    marginBottom: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  reportIconWrap: {
    width: 40,
    height: 40,
    backgroundColor: "#fee2e2",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  reportTextWrap: { flex: 1 },
  reportTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#dc2626",
    marginBottom: 2,
  },
  reportSub: { fontSize: 12, color: "#6b7280" },
  reportArrow: { fontSize: 18, color: "#dc2626" },
});
