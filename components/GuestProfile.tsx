// components/GuestProfile.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LogIn, User, AlertCircle } from "lucide-react-native";
import { useTheme } from "../constants/Theme";

interface GuestProfileProps {
  onLogin: () => void;
  onReportProblem?: () => void; // NOVO
}

export function GuestProfile({ onLogin, onReportProblem }: GuestProfileProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: "#f9fafb" }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          Profile
        </Text>
      </View>

      <View style={styles.content}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatar, { backgroundColor: colors.muted }]}>
            <User size={40} color={colors.mutedForeground} />
          </View>
          <Text style={[styles.guestTitle, { color: colors.foreground }]}>
            Guest
          </Text>
          <Text
            style={[styles.guestSubtitle, { color: colors.mutedForeground }]}
          >
            You are browsing as a guest
          </Text>
        </View>

        {/* Benefits card */}
        <View
          style={[
            styles.benefitsCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.benefitsTitle, { color: colors.foreground }]}>
            Create an account to unlock:
          </Text>
          {[
            "☕  Save favourite drink combinations",
            "📋  View your order history",
            "⚡  Quick brew from favourites",
            "🔔  Get notified when your drink is ready",
          ].map((item, idx) => (
            <Text
              key={idx}
              style={[styles.benefitItem, { color: colors.mutedForeground }]}
            >
              {item}
            </Text>
          ))}
        </View>

        {/* Sign in button */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={onLogin}
          activeOpacity={0.8}
        >
          <LogIn size={20} color="#ffffff" />
          <Text style={styles.loginButtonText}>Sign In / Create Account</Text>
        </TouchableOpacity>

        {/* ── Report a Problem ───────────────────────────────────────────── */}
        {onReportProblem && (
          <TouchableOpacity
            style={[
              styles.reportButton,
              { backgroundColor: colors.card, borderColor: "#fecaca" },
            ]}
            onPress={onReportProblem}
            activeOpacity={0.8}
          >
            <View style={styles.reportIconWrap}>
              <AlertCircle size={20} color="#dc2626" />
            </View>
            <View style={styles.reportTextWrap}>
              <Text style={styles.reportTitle}>Report a Problem</Text>
              <Text
                style={[styles.reportSub, { color: colors.mutedForeground }]}
              >
                Send a message to the administrator
              </Text>
            </View>
            <Text style={styles.reportArrow}>→</Text>
          </TouchableOpacity>
        )}
        {/* ────────────────────────────────────────────────────────────────── */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 20, fontWeight: "600" },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 140,
  },
  avatarSection: { alignItems: "center", marginBottom: 28 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  guestTitle: { fontSize: 22, fontWeight: "700", marginBottom: 6 },
  guestSubtitle: { fontSize: 14 },
  benefitsCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 20,
  },
  benefitsTitle: { fontSize: 15, fontWeight: "600", marginBottom: 14 },
  benefitItem: { fontSize: 14, marginBottom: 8, lineHeight: 20 },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#000000",
    height: 52,
    borderRadius: 26,
    marginBottom: 16,
  },
  loginButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
  // Report a Problem
  reportButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
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
  reportSub: { fontSize: 12 },
  reportArrow: { fontSize: 18, color: "#dc2626" },
});
