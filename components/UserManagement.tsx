// components/UserManagement.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { ArrowLeft, User, Trash2, Shield, Coffee } from "lucide-react-native";
import { useTheme } from "../constants/Theme";
import { useDatabase } from "../contexts/DatabaseContext";

interface UserRecord {
  id: string;
  email: string;
  name: string | null;
  user_type: string;
  created_at: string;
}

interface UserManagementProps {
  onBack: () => void;
}

const formatDate = (iso: string) => {
  const d = new Date(iso.includes("T") ? iso : iso.replace(" ", "T") + "Z");
  if (isNaN(d.getTime())) return iso;
  return `${d.getDate().toString().padStart(2, "0")}.${(d.getMonth() + 1).toString().padStart(2, "0")}.${d.getFullYear()}`;
};

// Korisnici koji se ne smiju obrisati
const isProtectedUser = (user: UserRecord): boolean =>
  user.user_type === "admin" ||
  user.user_type === "guest" ||
  user.id === "guest-001" ||
  user.id?.toLowerCase().includes("guest");

export function UserManagement({ onBack }: UserManagementProps) {
  const { colors } = useTheme();
  const { db, isReady } = useDatabase();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    if (!db || !isReady) return;
    try {
      setLoading(true);
      const result = await db.getAllAsync<UserRecord>(
        `SELECT id, email, name, user_type, created_at
         FROM users
         ORDER BY user_type DESC, created_at ASC`,
      );
      setUsers(result);
    } catch (err) {
      console.error("❌ Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }, [db, isReady]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteUser = (user: UserRecord) => {
    if (isProtectedUser(user)) {
      Alert.alert(
        "Cannot Delete",
        user.user_type === "admin"
          ? "Admin accounts cannot be deleted."
          : "Guest accounts cannot be deleted.",
      );
      return;
    }
    Alert.alert(
      "Delete User",
      `Are you sure you want to delete "${user.name || user.email}"?\n\nThis action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await db?.runAsync(
                `DELETE FROM users WHERE id = ? AND user_type NOT IN ('admin', 'guest')`,
                [user.id],
              );
              console.log("✅ User deleted:", user.email);
              await fetchUsers();
            } catch (err) {
              Alert.alert("Error", "Could not delete user.");
            }
          },
        },
      ],
    );
  };

  const adminCount = users.filter((u) => u.user_type === "admin").length;
  const registeredCount = users.filter(
    (u) => u.user_type === "registered",
  ).length;

  return (
    <View style={[styles.container, { backgroundColor: "#f9fafb" }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={24} color={colors.foreground} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            User Management
          </Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            Manage registered accounts
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View
        style={[
          styles.statsRow,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={[styles.statCard, { backgroundColor: "#f3e8ff" }]}>
          <Shield size={16} color="#9333ea" />
          <Text style={[styles.statValue, { color: "#9333ea" }]}>
            {adminCount}
          </Text>
          <Text style={[styles.statLabel, { color: "#9333ea" }]}>Admin</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#dbeafe" }]}>
          <User size={16} color="#2563eb" />
          <Text style={[styles.statValue, { color: "#2563eb" }]}>
            {registeredCount}
          </Text>
          <Text style={[styles.statLabel, { color: "#2563eb" }]}>
            Registered
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.muted }]}>
          <Coffee size={16} color={colors.mutedForeground} />
          <Text style={[styles.statValue, { color: colors.foreground }]}>
            {users.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
            Total
          </Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000000" />
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
            Loading users...
          </Text>
        </View>
      ) : users.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>👤</Text>
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
            No users found
          </Text>
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
            Registered accounts will appear here.
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {users.map((user) => {
            const protected_ = isProtectedUser(user);
            const isAdmin = user.user_type === "admin";
            return (
              <View
                key={user.id}
                style={[
                  styles.userCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <View
                  style={[
                    styles.avatar,
                    { backgroundColor: isAdmin ? "#1f2937" : "#dbeafe" },
                  ]}
                >
                  {isAdmin ? (
                    <Shield size={20} color="#ffffff" />
                  ) : (
                    <User size={20} color="#2563eb" />
                  )}
                </View>
                <View style={styles.userInfo}>
                  <View style={styles.userNameRow}>
                    <Text
                      style={[styles.userName, { color: colors.foreground }]}
                      numberOfLines={1}
                    >
                      {user.name || "—"}
                    </Text>
                    <View
                      style={[
                        styles.typeBadge,
                        { backgroundColor: isAdmin ? "#000000" : "#eff6ff" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.typeBadgeText,
                          { color: isAdmin ? "#ffffff" : "#2563eb" },
                        ]}
                      >
                        {isAdmin ? "Admin" : "User"}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.userEmail,
                      { color: colors.mutedForeground },
                    ]}
                    numberOfLines={1}
                  >
                    {user.email}
                  </Text>
                  <Text
                    style={[styles.userDate, { color: colors.mutedForeground }]}
                  >
                    Registered {formatDate(user.created_at)}
                  </Text>
                </View>
                {/* Delete — samo za non-protected korisnike */}
                {!protected_ ? (
                  <TouchableOpacity
                    onPress={() => handleDeleteUser(user)}
                    style={styles.deleteButton}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Trash2 size={18} color="#dc2626" />
                  </TouchableOpacity>
                ) : (
                  <View style={styles.deleteButtonPlaceholder} />
                )}
              </View>
            );
          })}

          <View style={[styles.infoNote, { backgroundColor: colors.muted }]}>
            <Text
              style={[styles.infoNoteText, { color: colors.mutedForeground }]}
            >
              ℹ️ Admin and Guest accounts cannot be deleted. Only registered
              user accounts can be removed.
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
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
  headerTitle: { fontSize: 20, fontWeight: "600" },
  headerSub: { fontSize: 13, marginTop: 2 },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  statCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    padding: 12,
  },
  statValue: { fontSize: 18, fontWeight: "700" },
  statLabel: { fontSize: 12, fontWeight: "500" },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: { fontSize: 14 },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  emptyText: { fontSize: 14, textAlign: "center" },
  content: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 60 },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    gap: 14,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  userInfo: { flex: 1, minWidth: 0 },
  userNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  userName: { fontSize: 15, fontWeight: "600", flexShrink: 1 },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    flexShrink: 0,
  },
  typeBadgeText: { fontSize: 11, fontWeight: "600" },
  userEmail: { fontSize: 13, marginBottom: 2 },
  userDate: { fontSize: 12 },
  deleteButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  deleteButtonPlaceholder: { width: 36, flexShrink: 0 },
  infoNote: { borderRadius: 12, padding: 14, marginTop: 8 },
  infoNoteText: { fontSize: 13, lineHeight: 20 },
});
