// components/NewAdminDashboard.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  BookOpen,
  Headphones,
  MessageSquare,
  X,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react-native";
import { useTheme, Shadows } from "../constants/Theme";
import { useDatabase } from "../contexts/DatabaseContext";
import { useMachine } from "../contexts/MachineContext";

interface NewAdminDashboardProps {
  onBack: () => void;
  onViewAnalytics: () => void;
  onViewSupplies: () => void;
  onManageDrinks: () => void;
  onViewInstructions: () => void;
  onContactSupport: () => void;
  onManageUsers: () => void;
  onViewMessages: () => void;
}

export const ADMIN_COLORS = {
  analytics: "#22c55e",
  supplies: "#0d9488",
  availability: "#9333ea",
  users: "#f59e0b",
  messages: "#2563eb",
  instructions: "#f97316",
  support: "#f43f5e",
};

const DEMO_NETWORK = "CoffeeNet";
const DEMO_PASSWORD = "Coffee2026";
const DEMO_IP = "192.168.1.142";
const WIFI_STATE_KEY = "wifiConnectionState";

type WifiState = "idle" | "connecting" | "connected" | "error";
type ProcessState = "idle" | "running" | "done";

export function NewAdminDashboard({
  onBack,
  onViewAnalytics,
  onViewSupplies,
  onManageDrinks,
  onViewInstructions,
  onContactSupport,
  onManageUsers,
  onViewMessages,
}: NewAdminDashboardProps) {
  const { colors } = useTheme();
  const machine = useMachine();
  const { db, isReady } = useDatabase();

  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [ordersToday, setOrdersToday] = useState(0);

  // ── WiFi — inicijalizovano kao CONNECTED da nema flickera ─────────────────
  // Razlog: podrazumijevana vrijednost je "connected". AsyncStorage može
  // promijeniti na "disconnected" ako je korisnik ranije diskonektovao.
  // Ovo eliminira connected→disconnected→connected flicker.
  const [wifiState, setWifiState] = useState<WifiState>("connected");
  const [connectedTo, setConnectedTo] = useState<string | null>(DEMO_NETWORK);
  const [showWifi, setShowWifi] = useState(false);
  const [networkName, setNetworkName] = useState("");
  const [networkPassword, setNetworkPassword] = useState("");
  const [showWifiPassword, setShowWifiPassword] = useState(false);

  // Keyboard listener — pomjera WiFi modal gore za visinu tastature
  const [wifiKeyboardOffset, setWifiKeyboardOffset] = useState(0);
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (e) => {
      setWifiKeyboardOffset(e.endCoordinates.height);
    });
    const hide = Keyboard.addListener("keyboardDidHide", () => {
      setWifiKeyboardOffset(0);
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  useEffect(() => {
    // Učitaj perzistentno stanje iz AsyncStorage
    AsyncStorage.getItem(WIFI_STATE_KEY)
      .then((val) => {
        if (val !== null) {
          const saved = JSON.parse(val);
          // Samo promijeni stanje ako je korisnik ranije diskonektovao
          if (!saved.connectedTo) {
            setConnectedTo(null);
            setWifiState("idle");
          }
          // Ako je connected, state je već inicijalizovan kao connected — nema promjene
        } else {
          // Prva posjeta: spremi connected kao default
          AsyncStorage.setItem(
            WIFI_STATE_KEY,
            JSON.stringify({ connectedTo: DEMO_NETWORK }),
          );
        }
      })
      .catch(() => {
        // Greška pri čitanju → ostaje connected (default)
      });
  }, []);

  // ── Rinse ────────────────────────────────────────────────────────────────
  const [showRinse, setShowRinse] = useState(false);
  const [rinseState, setRinseState] = useState<ProcessState>("idle");
  const [rinseStep, setRinseStep] = useState("");
  const [lastRinse, setLastRinse] = useState<string | null>(null);
  const rinseProgress = useRef(new Animated.Value(0)).current;

  // ── Clean ────────────────────────────────────────────────────────────────
  const [showClean, setShowClean] = useState(false);
  const [cleanState, setCleanState] = useState<ProcessState>("idle");
  const [cleanStep, setCleanStep] = useState("");
  const [lastClean, setLastClean] = useState<string | null>(null);
  const [nextCleanDays, setNextCleanDays] = useState(50);
  const cleanProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!db || !isReady) return;
    // Samo COMPLETED narudžbine se broje u Orders Today
    db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM orders WHERE status = 'completed' AND DATE(created_at) = DATE('now')`,
    )
      .then((r) => {
        if (r) setOrdersToday(r.count);
      })
      .catch(() => {});

    db.getFirstAsync<{ count: number }>(`SELECT COUNT(*) as count FROM users`)
      .then((r) => {
        if (r) setTotalUsers(r.count);
      })
      .catch(() => {});

    db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM user_messages WHERE status = 'unread'`,
    )
      .then((r) => {
        if (r) setUnreadMessages(r.count);
      })
      .catch(() => {});
  }, [db, isReady]);

  const timeNow = () =>
    new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

  // ── WiFi handlers ─────────────────────────────────────────────────────────
  const handleWifiConnect = () => {
    setWifiState("connecting");
    setTimeout(() => {
      if (
        networkName.trim() === DEMO_NETWORK &&
        networkPassword === DEMO_PASSWORD
      ) {
        setWifiState("connected");
        setConnectedTo(DEMO_NETWORK);
        AsyncStorage.setItem(
          WIFI_STATE_KEY,
          JSON.stringify({ connectedTo: DEMO_NETWORK }),
        ).catch(() => {});
      } else {
        setWifiState("error");
      }
    }, 2000);
  };

  const handleWifiDisconnect = () => {
    setWifiState("idle");
    setConnectedTo(null);
    setNetworkName("");
    setNetworkPassword("");
    setShowWifiPassword(false);
    AsyncStorage.setItem(
      WIFI_STATE_KEY,
      JSON.stringify({ connectedTo: null }),
    ).catch(() => {});
  };

  // ── Rinse handlers ────────────────────────────────────────────────────────
  const handleStartRinse = () => {
    setRinseState("running");
    rinseProgress.setValue(0);
    Animated.timing(rinseProgress, {
      toValue: 1,
      duration: 8000,
      useNativeDriver: false,
    }).start();
    [
      { text: "Preparing rinse cycle...", delay: 0 },
      { text: "Flushing group head with hot water...", delay: 2500 },
      { text: "Rinsing water lines...", delay: 5000 },
      { text: "✅ Rinse complete!", delay: 7800 },
    ].forEach(({ text, delay }) => {
      setTimeout(() => {
        setRinseStep(text);
        if (delay >= 7800) {
          setRinseState("done");
          setLastRinse(timeNow());
          setTimeout(() => {
            setShowRinse(false);
            setRinseState("idle");
            setRinseStep("");
            rinseProgress.setValue(0);
          }, 2000);
        }
      }, delay);
    });
  };

  // ── Clean handlers ────────────────────────────────────────────────────────
  const handleStartClean = () => {
    setCleanState("running");
    cleanProgress.setValue(0);
    Animated.timing(cleanProgress, {
      toValue: 1,
      duration: 14000,
      useNativeDriver: false,
    }).start();
    [
      { text: "Starting deep clean cycle...", delay: 0 },
      { text: "Dissolving scale with descaling agent...", delay: 3000 },
      { text: "Cleaning heating element & pipes...", delay: 7000 },
      { text: "Final rinse cycle...", delay: 11000 },
      { text: "✅ Deep clean complete!", delay: 13800 },
    ].forEach(({ text, delay }) => {
      setTimeout(() => {
        setCleanStep(text);
        if (delay >= 13800) {
          setCleanState("done");
          setLastClean(timeNow());
          setNextCleanDays(50);
          setTimeout(() => {
            setShowClean(false);
            setCleanState("idle");
            setCleanStep("");
            cleanProgress.setValue(0);
          }, 2000);
        }
      }, delay);
    });
  };

  const cupDetected = machine.currentlyBrewingId !== null;
  const machineStatus =
    machine.currentlyBrewingId !== null || machine.waitingForCupId !== null
      ? "brewing"
      : "ready";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          Admin Dashboard
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Machine */}
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
                  machineStatus === "ready" ? "#dcfce7" : "#fef3c7",
              },
            ]}
          >
            <Text
              style={[
                styles.statusBadgeText,
                { color: machineStatus === "ready" ? "#15803d" : "#92400e" },
              ]}
            >
              {machineStatus === "ready" ? "Ready" : "Brewing..."}
            </Text>
          </View>
        </View>

        {/* Status icons */}
        <View style={styles.statusIconsGrid}>
          <TouchableOpacity
            style={styles.statusIconItem}
            onPress={() => setShowRinse(true)}
            activeOpacity={0.7}
          >
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
            {lastRinse && (
              <Text style={[styles.statusIconSub, { color: "#16a34a" }]}>
                {lastRinse}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statusIconItem}
            onPress={() => setShowWifi(true)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.statusIconCircle,
                { backgroundColor: connectedTo ? "#dcfce7" : "#fee2e2" },
              ]}
            >
              {connectedTo ? (
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
              {connectedTo ? "Connected" : "WiFi Off"}
            </Text>
            {connectedTo && (
              <Text style={[styles.statusIconSub, { color: "#16a34a" }]}>
                {connectedTo}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statusIconItem}
            onPress={() => setShowClean(true)}
            activeOpacity={0.7}
          >
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
            <Text
              style={[styles.statusIconSub, { color: colors.mutedForeground }]}
            >
              {lastClean ? `Done ${lastClean}` : `${nextCleanDays} days`}
            </Text>
          </TouchableOpacity>
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
                  {ordersToday}
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

            <TouchableOpacity
              style={[
                styles.summaryCard,
                Shadows.sm,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={onManageUsers}
            >
              <View
                style={[styles.summaryIcon, { backgroundColor: "#fef3c7" }]}
              >
                <Users size={24} color={ADMIN_COLORS.users} />
              </View>
              <View>
                <Text
                  style={[styles.summaryValue, { color: colors.foreground }]}
                >
                  {totalUsers === null ? "..." : totalUsers}
                </Text>
                <Text
                  style={[
                    styles.summaryLabel,
                    { color: colors.mutedForeground },
                  ]}
                >
                  Total Users
                </Text>
              </View>
            </TouchableOpacity>

            <View
              style={[
                styles.summaryCard,
                Shadows.sm,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View
                style={[
                  styles.summaryIcon,
                  { backgroundColor: cupDetected ? "#dcfce7" : "#fee2e2" },
                ]}
              >
                <Text style={styles.cupIcon}>☕</Text>
              </View>
              <View>
                <Text
                  style={[
                    styles.summaryValue,
                    { color: cupDetected ? "#16a34a" : "#dc2626" },
                  ]}
                >
                  {cupDetected ? "Yes" : "No"}
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

            <TouchableOpacity
              style={[
                styles.summaryCard,
                Shadows.sm,
                {
                  backgroundColor: unreadMessages > 0 ? "#eff6ff" : colors.card,
                  borderColor: unreadMessages > 0 ? "#bfdbfe" : colors.border,
                },
              ]}
              onPress={onViewMessages}
            >
              <View
                style={[
                  styles.summaryIcon,
                  {
                    backgroundColor:
                      unreadMessages > 0 ? "#dbeafe" : colors.muted,
                  },
                ]}
              >
                <MessageSquare
                  size={24}
                  color={
                    unreadMessages > 0
                      ? ADMIN_COLORS.messages
                      : colors.mutedForeground
                  }
                />
              </View>
              <View>
                <Text
                  style={[
                    styles.summaryValue,
                    {
                      color:
                        unreadMessages > 0
                          ? ADMIN_COLORS.messages
                          : colors.foreground,
                    },
                  ]}
                >
                  {unreadMessages}
                </Text>
                <Text
                  style={[
                    styles.summaryLabel,
                    { color: colors.mutedForeground },
                  ]}
                >
                  {unreadMessages === 1 ? "New Message" : "Messages"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Quick Actions
          </Text>
          <View style={styles.actionsList}>
            {[
              {
                label: "Analytics & Reports",
                desc: "View consumption trends & export data",
                color: ADMIN_COLORS.analytics,
                icon: BarChart3,
                onPress: onViewAnalytics,
              },
              {
                label: "Supply Management",
                desc: "Monitor coffee, milk & sugar levels",
                color: ADMIN_COLORS.supplies,
                icon: Package,
                onPress: onViewSupplies,
              },
              {
                label: "Drink Availability",
                desc: "Enable or disable drink options",
                color: ADMIN_COLORS.availability,
                icon: Coffee,
                onPress: onManageDrinks,
              },
              {
                label: "User Management",
                desc: "View and manage registered accounts",
                color: ADMIN_COLORS.users,
                icon: Users,
                onPress: onManageUsers,
              },
              {
                label: `User Messages${unreadMessages > 0 ? ` (${unreadMessages} new)` : ""}`,
                desc: "Problem reports from users & guests",
                color: ADMIN_COLORS.messages,
                icon: MessageSquare,
                onPress: onViewMessages,
                highlight: unreadMessages > 0,
              },
              {
                label: "Instructions",
                desc: "Machine usage guide & best practices",
                color: ADMIN_COLORS.instructions,
                icon: BookOpen,
                onPress: onViewInstructions,
              },
              {
                label: "Contact Support",
                desc: "Message the authorised service team",
                color: ADMIN_COLORS.support,
                icon: Headphones,
                onPress: onContactSupport,
              },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <TouchableOpacity
                  key={action.label}
                  onPress={action.onPress}
                  style={[
                    styles.actionCard,
                    Shadows.sm,
                    {
                      backgroundColor: (action as any).highlight
                        ? "#eff6ff"
                        : colors.card,
                      borderColor: (action as any).highlight
                        ? "#bfdbfe"
                        : colors.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.actionIcon,
                      { backgroundColor: action.color },
                    ]}
                  >
                    <Icon size={24} color="#ffffff" />
                  </View>
                  <View style={styles.actionContent}>
                    <Text
                      style={[styles.actionTitle, { color: colors.foreground }]}
                    >
                      {action.label}
                    </Text>
                    <Text
                      style={[
                        styles.actionDescription,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      {action.desc}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* WiFi Modal — ScrollView unutar da tastatura ne prekrije polja */}
      <Modal
        visible={showWifi}
        transparent
        animationType="slide"
        onRequestClose={() => setShowWifi(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "padding"}
          keyboardVerticalOffset={Platform.OS === "android" ? -200 : 0}
        >
          <View
            style={[
              styles.modalSheet,
              {
                backgroundColor: colors.card,
                marginBottom: wifiKeyboardOffset,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                WiFi Connection
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowWifi(false);
                  setWifiState(connectedTo ? "connected" : "idle");
                }}
                style={styles.modalCloseBtn}
              >
                <X size={20} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>

            {/* ScrollView — sadržaj se skroluje gore kad se tastatura pojavi */}
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.wifiModalContent}
            >
              <View
                style={[
                  styles.wifiExplanation,
                  { backgroundColor: colors.muted },
                ]}
              >
                <Text
                  style={[
                    styles.wifiExplanationText,
                    { color: colors.mutedForeground },
                  ]}
                >
                  📡 All devices in the office communicate with the coffee
                  machine through this WiFi network. Without a connection,
                  orders from the app cannot reach the machine.
                </Text>
              </View>

              {connectedTo ? (
                <View style={styles.connectedView}>
                  <View
                    style={[
                      styles.connectedIcon,
                      { backgroundColor: "#dcfce7" },
                    ]}
                  >
                    <CheckCircle size={32} color="#16a34a" />
                  </View>
                  <Text
                    style={[
                      styles.connectedTitle,
                      { color: colors.foreground },
                    ]}
                  >
                    Connected to {connectedTo}
                  </Text>
                  <Text
                    style={[
                      styles.connectedDetail,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    📶 Signal: Excellent
                  </Text>
                  <Text
                    style={[
                      styles.connectedDetail,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    🌐 IP: {DEMO_IP}
                  </Text>
                  <Text
                    style={[
                      styles.connectedDetail,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    🔒 Security: WPA2
                  </Text>
                  <TouchableOpacity
                    style={styles.disconnectButton}
                    onPress={handleWifiDisconnect}
                  >
                    <Text style={styles.disconnectText}>Disconnect</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <View
                    style={[
                      styles.demoHint,
                      { backgroundColor: "#eff6ff", borderColor: "#bfdbfe" },
                    ]}
                  >
                    <Text style={styles.demoHintText}>
                      🔑 Demo: Network{" "}
                      <Text style={styles.demoHintBold}>{DEMO_NETWORK}</Text> /
                      password{" "}
                      <Text style={styles.demoHintBold}>{DEMO_PASSWORD}</Text>
                    </Text>
                  </View>

                  <Text
                    style={[styles.inputLabel, { color: colors.foreground }]}
                  >
                    Network Name
                  </Text>
                  <TextInput
                    value={networkName}
                    onChangeText={(t) => {
                      setNetworkName(t);
                      setWifiState("idle");
                    }}
                    placeholder="e.g. CoffeeNet"
                    placeholderTextColor={colors.mutedForeground}
                    returnKeyType="next"
                    style={[
                      styles.wifiInput,
                      {
                        color: colors.foreground,
                        borderColor: colors.border,
                        backgroundColor: colors.background,
                      },
                    ]}
                  />

                  <Text
                    style={[styles.inputLabel, { color: colors.foreground }]}
                  >
                    Password
                  </Text>
                  <View
                    style={[
                      styles.passwordRow,
                      {
                        borderColor: colors.border,
                        backgroundColor: colors.background,
                      },
                    ]}
                  >
                    <TextInput
                      value={networkPassword}
                      onChangeText={(t) => {
                        setNetworkPassword(t);
                        setWifiState("idle");
                      }}
                      placeholder="Enter password"
                      placeholderTextColor={colors.mutedForeground}
                      secureTextEntry={!showWifiPassword}
                      autoCapitalize="none"
                      returnKeyType="done"
                      onSubmitEditing={handleWifiConnect}
                      style={[
                        styles.passwordInput,
                        { color: colors.foreground },
                      ]}
                    />
                    <TouchableOpacity
                      onPress={() => setShowWifiPassword(!showWifiPassword)}
                      style={styles.eyeButton}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      {showWifiPassword ? (
                        <EyeOff size={20} color={colors.mutedForeground} />
                      ) : (
                        <Eye size={20} color={colors.mutedForeground} />
                      )}
                    </TouchableOpacity>
                  </View>

                  {wifiState === "error" && (
                    <Text style={styles.wifiError}>
                      ❌ Network not found or incorrect password.
                    </Text>
                  )}

                  <TouchableOpacity
                    style={[
                      styles.connectButton,
                      wifiState === "connecting" &&
                        styles.connectButtonDisabled,
                    ]}
                    onPress={handleWifiConnect}
                    disabled={wifiState === "connecting"}
                  >
                    <Text style={styles.connectButtonText}>
                      {wifiState === "connecting" ? "Connecting..." : "Connect"}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Rinse Modal */}
      <Modal
        visible={showRinse}
        transparent
        animationType="slide"
        onRequestClose={() => rinseState === "idle" && setShowRinse(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                Rinse Cycle
              </Text>
              {rinseState === "idle" && (
                <TouchableOpacity
                  onPress={() => setShowRinse(false)}
                  style={styles.modalCloseBtn}
                >
                  <X size={20} color={colors.mutedForeground} />
                </TouchableOpacity>
              )}
            </View>
            <View
              style={[
                styles.demoHint,
                { backgroundColor: "#fef3c7", borderColor: "#fde68a" },
              ]}
            >
              <Text style={styles.demoHintText}>
                ⚠️ Simulation — Quick flush of the brew group head.
              </Text>
            </View>
            {rinseState === "idle" && (
              <>
                <Text
                  style={[
                    styles.processInfo,
                    { color: colors.mutedForeground },
                  ]}
                >
                  A rinse flushes the group head with hot water, removing coffee
                  oils and residue.{"\n\n"}
                  <Text style={{ fontWeight: "600" }}>When to rinse:</Text>{" "}
                  before first use, after switching coffee types, after idle{" "}
                  {">"} 2h.{"\n\n"}⏱ Duration: ~8 seconds (demo)
                </Text>
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={handleStartRinse}
                >
                  <Droplet size={18} color="#ffffff" />
                  <Text style={styles.startButtonText}>Start Rinse</Text>
                </TouchableOpacity>
              </>
            )}
            {rinseState === "running" && (
              <View style={styles.progressView}>
                <Text
                  style={[styles.processStep, { color: colors.foreground }]}
                >
                  {rinseStep}
                </Text>
                <View
                  style={[
                    styles.progressBar,
                    { backgroundColor: colors.muted },
                  ]}
                >
                  <Animated.View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: "#2563eb",
                        width: rinseProgress.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["0%", "100%"],
                        }),
                      },
                    ]}
                  />
                </View>
              </View>
            )}
            {rinseState === "done" && (
              <View style={styles.doneView}>
                <Text style={styles.doneEmoji}>✅</Text>
                <Text style={[styles.doneText, { color: colors.foreground }]}>
                  Rinse complete at {lastRinse}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Clean Modal */}
      <Modal
        visible={showClean}
        transparent
        animationType="slide"
        onRequestClose={() => cleanState === "idle" && setShowClean(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                Deep Clean
              </Text>
              {cleanState === "idle" && (
                <TouchableOpacity
                  onPress={() => setShowClean(false)}
                  style={styles.modalCloseBtn}
                >
                  <X size={20} color={colors.mutedForeground} />
                </TouchableOpacity>
              )}
            </View>
            <View
              style={[
                styles.demoHint,
                { backgroundColor: "#fef3c7", borderColor: "#fde68a" },
              ]}
            >
              <Text style={styles.demoHintText}>
                ⚠️ Simulation — Full descaling and internal cleaning cycle.
              </Text>
            </View>
            {cleanState === "idle" && (
              <>
                <Text
                  style={[
                    styles.processInfo,
                    { color: colors.mutedForeground },
                  ]}
                >
                  Deep clean removes mineral scale from the heating element and
                  pipes.{"\n\n"}
                  <Text style={{ fontWeight: "600" }}>
                    Difference from Rinse:
                  </Text>{" "}
                  Uses descaling agents, targets scale buildup that water alone
                  cannot remove. Required every 50 days.{"\n\n"}⏱ Duration: ~15
                  seconds (demo) | Real machine: 15–45 min
                </Text>
                <TouchableOpacity
                  style={[styles.startButton, { backgroundColor: "#9333ea" }]}
                  onPress={handleStartClean}
                >
                  <Sparkles size={18} color="#ffffff" />
                  <Text style={styles.startButtonText}>Start Deep Clean</Text>
                </TouchableOpacity>
              </>
            )}
            {cleanState === "running" && (
              <View style={styles.progressView}>
                <Text
                  style={[styles.processStep, { color: colors.foreground }]}
                >
                  {cleanStep}
                </Text>
                <View
                  style={[
                    styles.progressBar,
                    { backgroundColor: colors.muted },
                  ]}
                >
                  <Animated.View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: "#9333ea",
                        width: cleanProgress.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["0%", "100%"],
                        }),
                      },
                    ]}
                  />
                </View>
              </View>
            )}
            {cleanState === "done" && (
              <View style={styles.doneView}>
                <Text style={styles.doneEmoji}>✅</Text>
                <Text style={[styles.doneText, { color: colors.foreground }]}>
                  Deep clean complete at {lastClean}
                </Text>
                <Text
                  style={[
                    styles.processInfo,
                    { color: colors.mutedForeground },
                  ]}
                >
                  Next clean in 50 days.
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  headerTitle: { fontSize: 18, fontWeight: "600" },
  content: { flex: 1 },
  scrollContent: { paddingTop: 24, paddingHorizontal: 24, paddingBottom: 140 },
  machineSection: { alignItems: "center", marginBottom: 24 },
  machineImage: {
    width: 200,
    height: 180,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  machinePlaceholder: { fontSize: 64 },
  statusBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  statusBadgeText: { fontSize: 12, fontWeight: "600" },
  statusIconsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statusIconItem: { alignItems: "center", gap: 6 },
  statusIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  statusIconLabel: { fontSize: 12, fontWeight: "500" },
  statusIconSub: { fontSize: 10 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: "600", marginBottom: 16 },
  summaryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
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
  cupIcon: { fontSize: 24 },
  summaryValue: { fontSize: 24, fontWeight: "600" },
  summaryLabel: { fontSize: 12 },
  actionsList: { gap: 12 },
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
  actionContent: { flex: 1 },
  actionTitle: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
  actionDescription: { fontSize: 12 },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "600" },
  modalCloseBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  wifiExplanation: { borderRadius: 10, padding: 12, marginBottom: 16 },
  wifiExplanationText: { fontSize: 13, lineHeight: 19 },
  wifiModalContent: { paddingBottom: 20 },
  demoHint: { borderRadius: 10, borderWidth: 1, padding: 12, marginBottom: 16 },
  demoHintText: { fontSize: 13, color: "#92400e" },
  demoHintBold: { fontWeight: "700" },
  processInfo: { fontSize: 14, lineHeight: 22, marginBottom: 24 },
  inputLabel: { fontSize: 14, fontWeight: "500", marginBottom: 8 },
  wifiInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 16,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  passwordInput: { flex: 1, paddingVertical: 12, fontSize: 15 },
  eyeButton: { padding: 4 },
  wifiError: { color: "#dc2626", fontSize: 13, marginBottom: 12 },
  connectButton: {
    backgroundColor: "#2563eb",
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  connectButtonDisabled: { backgroundColor: "#9ca3af" },
  connectButtonText: { color: "#ffffff", fontSize: 15, fontWeight: "600" },
  connectedView: { alignItems: "center", paddingVertical: 16 },
  connectedIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  connectedTitle: { fontSize: 17, fontWeight: "600", marginBottom: 12 },
  connectedDetail: { fontSize: 14, marginBottom: 6 },
  disconnectButton: {
    marginTop: 20,
    borderWidth: 1.5,
    borderColor: "#dc2626",
    borderRadius: 22,
    paddingHorizontal: 32,
    paddingVertical: 10,
  },
  disconnectText: { color: "#dc2626", fontSize: 14, fontWeight: "600" },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#2563eb",
    height: 50,
    borderRadius: 25,
  },
  startButtonText: { color: "#ffffff", fontSize: 15, fontWeight: "600" },
  progressView: { gap: 16 },
  processStep: { fontSize: 15, fontWeight: "500", textAlign: "center" },
  progressBar: { height: 8, borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 4 },
  doneView: { alignItems: "center", paddingVertical: 16 },
  doneEmoji: { fontSize: 48, marginBottom: 12 },
  doneText: { fontSize: 16, fontWeight: "600", textAlign: "center" },
});
