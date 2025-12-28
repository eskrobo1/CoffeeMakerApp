import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { User, LogIn, Heart, Coffee } from "lucide-react-native";
import { useTheme } from "../constants/Theme";
import { Button } from "./ui/button";

interface GuestProfileProps {
  onLogin: () => void;
}

export function GuestProfile({ onLogin }: GuestProfileProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: "#f9fafb" }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.card, borderBottomColor: "#f3f4f6" },
        ]}
      >
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: colors.muted }]}>
            <User size={48} color={colors.mutedForeground} />
          </View>
          <Text style={[styles.userName, { color: colors.foreground }]}>
            Guest User
          </Text>
          <Text
            style={[styles.userSubtitle, { color: colors.mutedForeground }]}
          >
            You're browsing as a guest
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Sign In Card */}
        <View style={[styles.signInCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.signInTitle, { color: colors.foreground }]}>
            Create Your Profile
          </Text>
          <Text
            style={[
              styles.signInDescription,
              { color: colors.mutedForeground },
            ]}
          >
            Sign in to unlock personalized features and save your preferences
          </Text>
          <Button onPress={onLogin} style={styles.signInButton}>
            <LogIn size={20} color="#ffffff" />
            <Text style={styles.signInButtonText}>Sign In Now</Text>
          </Button>
        </View>

        {/* Features */}
        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>Sign In Benefits</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Heart size={16} color="#2563eb" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureName}>Save Favorite Drinks</Text>
                <Text style={styles.featureDescription}>
                  Quick access to your go-to beverages
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Coffee size={16} color="#2563eb" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureName}>Order History</Text>
                <Text style={styles.featureDescription}>
                  Track and repeat your orders
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureEmoji}>⚡</Text>
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureName}>Faster Ordering</Text>
                <Text style={styles.featureDescription}>
                  One-tap ordering with saved preferences
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureEmoji}>🔔</Text>
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureName}>Notifications</Text>
                <Text style={styles.featureDescription}>
                  Get notified when your drink is ready
                </Text>
              </View>
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
    paddingVertical: 48,
    borderBottomWidth: 1,
  },
  avatarContainer: {
    alignItems: "center",
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  userSubtitle: {
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 140,
  },
  signInCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  signInTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  signInDescription: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  signInButton: {
    width: "100%",
    height: 48,
    backgroundColor: "#000000",
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  signInButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  featuresCard: {
    backgroundColor: "#dbeafe",
    borderWidth: 2,
    borderColor: "#93c5fd",
    borderRadius: 16,
    padding: 24,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e3a8a",
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: "row",
    gap: 12,
  },
  featureIcon: {
    width: 32,
    height: 32,
    backgroundColor: "#bfdbfe",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  featureEmoji: {
    fontSize: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e3a8a",
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 12,
    color: "#1d4ed8",
  },
});
