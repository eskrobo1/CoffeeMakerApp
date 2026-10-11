// App.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Appearance,
} from "react-native";

// Forsiraj light mode — ignorira sistemski dark mode
Appearance.setColorScheme("light");

import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DatabaseProvider, useDatabase } from "./contexts/DatabaseContext";
import { MachineProvider, useMachine } from "./contexts/MachineContext";
import { useOrders, useQueue, useFavorites } from "./hooks";
import type { Order } from "./hooks/useOrders";
import type { FavoriteConfig } from "./hooks/useFavorites";
import { LoginScreen } from "./components/LoginScreen";
import { SignUpScreen } from "./components/SignUpScreen";
import { GuestHome } from "./components/GuestHome";
import { RegisteredHome } from "./components/RegisteredHome";
import { AdminHome } from "./components/AdminHome";
import { DrinkCustomization } from "./components/DrinkCustomization";
import { CustomDrink } from "./components/CustomDrink";
import { BrewingProgress } from "./components/BrewingProgress";
import { BrewingComplete } from "./components/BrewingComplete";
import { OrderHistory } from "./components/OrderHistory";
import { UserProfile } from "./components/UserProfile";
import { GuestProfile } from "./components/GuestProfile";
import { NewAdminDashboard } from "./components/NewAdminDashboard";
import { AdminProfile } from "./components/AdminProfile";
import { Analytics } from "./components/Analytics";
import { SupplyManagement } from "./components/SupplyManagement";
import { DrinkAvailability } from "./components/DrinkAvailability";
import { Instructions } from "./components/Instructions";
import { ContactSupport } from "./components/ContactSupport";
import { UserManagement } from "./components/UserManagement";
import { ReportProblem } from "./components/ReportProblem";
import { AdminMessages } from "./components/AdminMessages";
import { BottomNavigation } from "./components/BottomNavigation";
import { drinkMeasurements } from "./data/drinkMeasurements";
import {
  SUPPLY_LEVELS_KEY,
  SUPPLY_TOTALS,
  SUPPLY_DEFAULTS,
} from "./components/SupplyManagement";
import type { UserType } from "./types";

const GUEST_USER_ID = "guest-001";
const MAX_ORDERS_PER_USER = 3;
const DISABLED_DRINKS_KEY = "disabledDrinkIds";

// Stvarne potrošene količine za jednu narudžbinu
interface OrderConsumption {
  coffeeG: number; // grama kafe
  milkMl: number; // ml mlijeka (regular ili plant)
  isPlantMilk: boolean;
  waterMl: number; // ml vode
  sugarG: number; // grama šećera
}

const getMeasurementsForComplete = (drinkId: string, size: string) => {
  const drink = drinkMeasurements.find((d) => d.id === drinkId);
  if (!drink) return { water: 0, milk: 0, milkFoam: 0, coffee: 0, sugar: 0 };
  const sizeKey = (size as "small" | "medium" | "large") || "medium";
  const s = drink[sizeKey] || drink.medium;
  return {
    water: s.water || 0,
    milk: s.milk || 0,
    milkFoam: s.milkFoam || 0,
    coffee: s.coffee || 0,
    sugar: 0,
  };
};

// ── Smanji zalihe koristeći stvarne izmjerene vrijednosti ─────────────────────
// Radi za SVE napitke — i standardne i custom.
// Vrijednosti se čitaju iz orderConsumptionRef keyed po orderId.
const applySupplyDecrease = async (c: OrderConsumption) => {
  try {
    const stored = await AsyncStorage.getItem(SUPPLY_LEVELS_KEY);
    const lvl: Record<string, number> = stored
      ? { ...SUPPLY_DEFAULTS, ...JSON.parse(stored) }
      : { ...SUPPLY_DEFAULTS };

    // Coffee beans
    if (c.coffeeG > 0)
      lvl.coffee = Math.max(
        0,
        lvl.coffee - (c.coffeeG / SUPPLY_TOTALS.coffee) * 100,
      );

    // Mlijeko — regular ili plant-based
    if (c.milkMl > 0) {
      if (c.isPlantMilk)
        lvl.plantMilk = Math.max(
          0,
          lvl.plantMilk - (c.milkMl / SUPPLY_TOTALS.plantMilk) * 100,
        );
      else
        lvl.milk = Math.max(
          0,
          lvl.milk - (c.milkMl / SUPPLY_TOTALS.milk) * 100,
        );
    }

    // Šećer
    if (c.sugarG > 0)
      lvl.sugar = Math.max(
        0,
        lvl.sugar - (c.sugarG / SUPPLY_TOTALS.sugar) * 100,
      );

    // Voda
    if (c.waterMl > 0)
      lvl.water = Math.max(
        0,
        lvl.water - (c.waterMl / SUPPLY_TOTALS.water) * 100,
      );

    // Zaokruži na 1 decimalu
    Object.keys(lvl).forEach((k) => {
      lvl[k] = Math.round(lvl[k] * 10) / 10;
    });
    await AsyncStorage.setItem(SUPPLY_LEVELS_KEY, JSON.stringify(lvl));
  } catch (err) {
    console.warn("Supply decrease error:", err);
  }
};
// ─────────────────────────────────────────────────────────────────────────────

function GuestHistoryScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <View style={guestHistStyles.container}>
      <View style={guestHistStyles.header}>
        <Text style={guestHistStyles.headerTitle}>Order History</Text>
      </View>
      <View style={guestHistStyles.content}>
        <View style={guestHistStyles.iconWrap}>
          <Text style={guestHistStyles.icon}>☕</Text>
        </View>
        <Text style={guestHistStyles.title}>No history available</Text>
        <Text style={guestHistStyles.message}>
          Order history is only available for registered users.{"\n"}
          Sign in or create an account to track your orders.
        </Text>
        <TouchableOpacity
          style={guestHistStyles.loginButton}
          onPress={onLogin}
          activeOpacity={0.8}
        >
          <Text style={guestHistStyles.loginButtonText}>
            Sign In / Create Account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const guestHistStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 20, fontWeight: "600", color: "#111827" },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  icon: { fontSize: 40 },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  loginButton: {
    backgroundColor: "#000000",
    borderRadius: 24,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  loginButtonText: { color: "#ffffff", fontSize: 15, fontWeight: "600" },
});

function AppContent() {
  const { db, isReady, error } = useDatabase();
  const machine = useMachine();

  const [userType, setUserType] = useState<UserType | null>(null);
  const [userId, setUserId] = useState<string>(GUEST_USER_ID);
  const [currentScreen, setCurrentScreen] = useState<string>("login");
  const [selectedDrink, setSelectedDrink] = useState<string>("");
  const [selectedFavoriteConfig, setSelectedFavoriteConfig] =
    useState<FavoriteConfig | null>(null);
  const [userName, setUserName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [disabledDrinkIds, setDisabledDrinkIds] = useState<string[]>([]);
  const [userActiveOrders, setUserActiveOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState(true);
  const [saveOrderHistory, setSaveOrderHistory] = useState(true);

  // ── Čuva stvarnu potrošnju za svaku narudžbinu ───────────────────────────
  // Ovo rješava problem custom napitka koji ne smanjuje zalihe:
  // čuvamo točne ml/g vrijednosti u trenutku kreiranja narudžbine,
  // pa ih koristimo kada narudžbina završi — neovisno o drink_id.
  const consumptionRef = useRef<Map<string, OrderConsumption>>(new Map());
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const load = async () => {
      try {
        const n = await AsyncStorage.getItem(`notifications_${userId}`);
        const o = await AsyncStorage.getItem(`saveOrderHistory_${userId}`);
        setNotifications(n !== null ? n === "true" : true);
        setSaveOrderHistory(o !== null ? o === "true" : true);
      } catch {
        setNotifications(true);
        setSaveOrderHistory(true);
      }
    };
    load();
  }, [userId]);

  useEffect(() => {
    AsyncStorage.setItem(
      `notifications_${userId}`,
      String(notifications),
    ).catch(() => {});
  }, [notifications, userId]);
  useEffect(() => {
    AsyncStorage.setItem(
      `saveOrderHistory_${userId}`,
      String(saveOrderHistory),
    ).catch(() => {});
  }, [saveOrderHistory, userId]);

  const {
    orders,
    createOrder,
    cancelOrder,
    getUserActiveOrders,
    fetchOrderHistory,
  } = useOrders(userId);
  const { fetchActiveOrders, getQueuePosition, getTotalInQueue } = useQueue();
  const { favoriteConfigs, addFavorite, removeFavorite } = useFavorites(userId);

  const isOrderingBlocked = userActiveOrders.length >= MAX_ORDERS_PER_USER;
  const hasActiveBrew = userActiveOrders.length > 0;

  useEffect(() => {
    if (!db || !isReady) return;
    const seed = async () => {
      try {
        await db.runAsync(
          `INSERT OR IGNORE INTO users (id, email, password_hash, name, user_type, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))`,
          ["admin@company.com", "admin@company.com", "9999", "Admin", "admin"],
        );
        await db.runAsync(
          `INSERT OR IGNORE INTO users (id, email, password_hash, name, user_type, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))`,
          [
            "user@company.com",
            "user@company.com",
            "1234",
            "Demo User",
            "registered",
          ],
        );
      } catch {}
    };
    seed();
  }, [db, isReady]);

  useEffect(() => {
    AsyncStorage.getItem(DISABLED_DRINKS_KEY)
      .then((val) => {
        if (val) setDisabledDrinkIds(JSON.parse(val));
      })
      .catch(() => {});
  }, []);

  const handleSaveAvailability = useCallback(
    (ids: string[]) => setDisabledDrinkIds(ids),
    [],
  );

  const prevLastCompletedRef = useRef<string | null>(null);
  useEffect(() => {
    if (
      machine.lastCompletedOrderId &&
      machine.lastCompletedOrderId !== prevLastCompletedRef.current
    ) {
      prevLastCompletedRef.current = machine.lastCompletedOrderId;
      const myOrder = userActiveOrders.find(
        (o) => o.id === machine.lastCompletedOrderId,
      );
      if (myOrder) {
        setCompletedOrderId(myOrder.id);
        setUserActiveOrders((prev) =>
          prev.filter((o) => o.id !== machine.lastCompletedOrderId),
        );
        setCurrentScreen("complete");
        fetchOrderHistory(userId);

        // ── Smanji zalihe koristeći stvarnu potrošnju ──────────────────────
        const consumption = consumptionRef.current.get(myOrder.id);
        if (consumption) {
          applySupplyDecrease(consumption);
          consumptionRef.current.delete(myOrder.id); // počisti memoriju
        }
        // ───────────────────────────────────────────────────────────────────
      }
      fetchActiveOrders();
    }
  }, [machine.lastCompletedOrderId]);

  useEffect(() => {
    if (isReady && db) console.log("✅ Database is ready!");
    if (error) console.error("❌ Database error:", error);
  }, [isReady, db, error]);

  const loadUserActiveOrders = useCallback(
    async (uid: string) => {
      const active = await getUserActiveOrders(uid);
      setUserActiveOrders(active);
      if (active.length > 0) setSelectedOrderId(active[0].id);
    },
    [getUserActiveOrders],
  );

  const handleLogin = async (type: UserType, name: string) => {
    const uid = type === "guest" ? GUEST_USER_ID : name;
    setUserType(type);
    setUserName(name);
    setUserId(uid);
    setCurrentScreen("home");
    let dName = name.includes("@") ? name.split("@")[0] : name;
    if (db && isReady && type !== "guest") {
      try {
        const user = await db.getFirstAsync<{ name: string | null }>(
          `SELECT name FROM users WHERE id = ?`,
          [uid],
        );
        if (user?.name) dName = user.name;
      } catch {}
    }
    setDisplayName(dName);
    loadUserActiveOrders(uid);
  };

  const handleSignUp = async (
    type: UserType,
    name: string,
    email: string,
    password: string,
  ) => {
    if (db && isReady) {
      try {
        await db.runAsync(
          `INSERT OR IGNORE INTO users (id, email, password_hash, name, user_type, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))`,
          [email, email, password, name, type],
        );
      } catch {}
    }
    setUserType(type);
    setUserName(email);
    setDisplayName(name);
    setUserId(email);
    setCurrentScreen("home");
    loadUserActiveOrders(email);
  };

  const handleLogout = () => {
    setUserType(null);
    setUserName("");
    setDisplayName("");
    setUserId(GUEST_USER_ID);
    setUserActiveOrders([]);
    setSelectedOrderId(null);
    consumptionRef.current.clear();
    setCurrentScreen("login");
  };

  // ── Kreira narudžbinu i SPREMA STVARNU POTROŠNJU ─────────────────────────
  const createAndAddOrder = async (config: any): Promise<string | null> => {
    const orderId = await createOrder({
      drinkId: config.drinkId,
      drinkName: config.drinkName,
      userId,
      size: config.size,
      strength: config.strength,
      milkType: config.milkType,
      temperature: 92,
      sugarG: config.measurements?.sugar ?? 0,
      milkAmountPercent: 100,
      foamLevelPercent: 100,
    });

    if (orderId) {
      // Izračunaj i spremi stvarnu potrošnju za ovu narudžbinu
      // Ovo radi ispravno i za standardne i za custom napitke.
      let coffeeG = 0,
        milkMl = 0,
        waterMl = 0;

      if (config.drinkId === "custom") {
        // Za custom napitke: koristimo direktno proslijeđene measurements
        coffeeG = config.measurements?.coffee ?? 0;
        milkMl = config.measurements?.milk ?? 0;
        waterMl = config.measurements?.water ?? 0;
      } else {
        // Za standardne napitke: rekonstruiramo iz drinkMeasurements
        const drink = drinkMeasurements.find((d) => d.id === config.drinkId);
        if (drink) {
          const sizeKey =
            (config.size as "small" | "medium" | "large") || "medium";
          const m = drink[sizeKey] || drink.medium;
          const sf =
            config.strength === "light"
              ? 0.8
              : config.strength === "strong"
                ? 1.2
                : 1.0;
          coffeeG = m.coffee * sf;
          // Koristimo stvarni ml iz config.measurements ako je dostupan,
          // inače rekonstruiramo iz baze (već je izračunato u DrinkCustomization)
          milkMl = config.measurements?.milk ?? m.milk;
          waterMl = config.measurements?.water ?? m.water;
        }
      }

      const consumption: OrderConsumption = {
        coffeeG,
        milkMl,
        isPlantMilk: config.milkType === "plant-based",
        waterMl,
        sugarG: config.measurements?.sugar ?? 0,
      };
      consumptionRef.current.set(orderId, consumption);

      const newOrder: Order = {
        id: orderId,
        user_id: userId,
        drink_id: config.drinkId,
        drink_name: config.drinkName,
        size: config.size,
        strength: config.strength,
        milk_type: config.milkType,
        temperature: 92,
        sugar_g: config.measurements?.sugar ?? 0, // ispravno — ne hardkodirano 0
        milk_amount_percent: 100,
        foam_level_percent: 100,
        status: "pending",
        created_at: new Date().toISOString(),
        completed_at: null,
      };
      setUserActiveOrders((prev) => [...prev, newOrder]);
      setSelectedOrderId(orderId);
      await fetchActiveOrders();
      machine.refreshQueue();
    }
    return orderId;
  };
  // ─────────────────────────────────────────────────────────────────────────

  const handleSelectDrink = (drinkId: string) => {
    if (isOrderingBlocked) {
      Alert.alert(
        "Max Orders Reached",
        `You already have ${MAX_ORDERS_PER_USER} orders in progress.`,
        [
          { text: "View Orders", onPress: () => setCurrentScreen("brewing") },
          { text: "OK", style: "cancel" },
        ],
      );
      return;
    }
    setSelectedDrink(drinkId);
    setSelectedFavoriteConfig(null);
    setCurrentScreen(drinkId === "custom" ? "customDrink" : "customize");
  };

  const handleSelectFavorite = (fav: FavoriteConfig) => {
    if (isOrderingBlocked) {
      Alert.alert(
        "Max Orders Reached",
        `You already have ${MAX_ORDERS_PER_USER} orders in progress.`,
        [
          { text: "View Orders", onPress: () => setCurrentScreen("brewing") },
          { text: "OK", style: "cancel" },
        ],
      );
      return;
    }
    setSelectedDrink(fav.drink_id);
    setSelectedFavoriteConfig(fav);
    setCurrentScreen("customize");
  };

  const handleQuickBrewFavorite = async (fav: FavoriteConfig) => {
    if (isOrderingBlocked) {
      Alert.alert(
        "Max Orders Reached",
        `You already have ${MAX_ORDERS_PER_USER} active orders.`,
        [
          { text: "View Orders", onPress: () => setCurrentScreen("brewing") },
          { text: "OK", style: "cancel" },
        ],
      );
      return;
    }
    const drink =
      drinkMeasurements.find((d) => d.id === fav.drink_id) ||
      drinkMeasurements[0];
    const sizeKey = (fav.size as "small" | "medium" | "large") || "medium";
    const base = drink[sizeKey] || drink.medium;
    const milkActual = Math.round(base.milk * (fav.milk_amount_percent / 100));
    const config = {
      drinkId: fav.drink_id,
      drinkName: drink.name,
      size: fav.size,
      strength: fav.strength,
      milkType: fav.milk_type,
      measurements: {
        water: base.water,
        milk: milkActual,
        milkFoam: Math.round(base.milkFoam * (fav.foam_level_percent / 100)),
        coffee:
          base.coffee *
          (fav.strength === "light"
            ? 0.8
            : fav.strength === "strong"
              ? 1.2
              : 1),
        sugar: fav.sugar_g,
      },
    };
    await createAndAddOrder(config);
    setCurrentScreen("brewing");
  };

  const handleStartBrew = async (config: any) => {
    if (isOrderingBlocked) {
      Alert.alert(
        "Max Orders Reached",
        `You already have ${MAX_ORDERS_PER_USER} active orders.`,
      );
      return;
    }
    await createAndAddOrder(config);
    setCurrentScreen("brewing");
  };

  const handleCancelOrder = async (orderId: string) => {
    Alert.alert("Cancel Order", "Are you sure you want to cancel this order?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes, cancel",
        style: "destructive",
        onPress: async () => {
          const success = await cancelOrder(orderId);
          if (success) {
            consumptionRef.current.delete(orderId); // počisti i za cancelled
            setUserActiveOrders((prev) => prev.filter((o) => o.id !== orderId));
            if (selectedOrderId === orderId) {
              const remaining = userActiveOrders.filter(
                (o) => o.id !== orderId,
              );
              setSelectedOrderId(remaining.length > 0 ? remaining[0].id : null);
            }
            if (userActiveOrders.length <= 1) setCurrentScreen("home");
            await fetchActiveOrders();
            machine.refreshQueue();
          }
        },
      },
    ]);
  };

  const handleBrewDone = () => {
    setCompletedOrderId(null);
    if (userActiveOrders.length > 0) setCurrentScreen("brewing");
    else setCurrentScreen("home");
  };

  const handleNavChange = (tab: "home" | "history" | "profile" | "admin") =>
    setCurrentScreen(tab);

  const handleRepeatOrder = (order: Order) => {
    if (isOrderingBlocked) {
      Alert.alert(
        "Max Orders Reached",
        "Please wait for an order to complete.",
      );
      return;
    }
    setSelectedDrink(order.drink_id);
    const repeatConfig: FavoriteConfig = {
      id: -1,
      user_id: userId,
      drink_id: order.drink_id,
      name: order.drink_name,
      size: order.size,
      strength: order.strength as any,
      milk_type: (order.milk_type || "regular") as any,
      milk_amount_percent: order.milk_amount_percent ?? 50,
      foam_level_percent: order.foam_level_percent ?? 50,
      sugar_g: order.sugar_g ?? 0,
      created_at: "",
    };
    setSelectedFavoriteConfig(repeatConfig);
    setCurrentScreen("customize");
  };

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
        <Text style={styles.loadingText}>Initializing database...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Database Error</Text>
        <Text style={styles.errorText}>{error.message}</Text>
      </View>
    );
  }

  const showBottomNav =
    userType !== null && !["login", "signup", "signin"].includes(currentScreen);

  const getActiveTab = (): "home" | "history" | "profile" | "admin" => {
    if (
      [
        "admin",
        "analytics",
        "supplies",
        "availability",
        "instructions",
        "support",
        "users",
        "adminMessages",
      ].includes(currentScreen)
    )
      return "admin";
    if (currentScreen === "history") return "history";
    if (["profile", "reportProblem"].includes(currentScreen)) return "profile";
    return "home";
  };

  const BrewingBadge = () => {
    if (!hasActiveBrew || currentScreen === "brewing") return null;
    const myBrewingOrder = userActiveOrders.find(
      (o) => o.id === machine.currentlyBrewingId,
    );
    const myPlaceCupOrder = userActiveOrders.find(
      (o) => o.id === machine.waitingForCupId,
    );
    let label = "";
    let dotColor = "#6b7280";
    if (myPlaceCupOrder) {
      label = `${myPlaceCupOrder.drink_name} — Place your cup!`;
      dotColor = "#f59e0b";
    } else if (myBrewingOrder) {
      label = `Brewing ${myBrewingOrder.drink_name}... ${machine.brewTimeLeft}s`;
      dotColor = "#10b981";
    } else if (userActiveOrders.length > 0) {
      const first = userActiveOrders[0];
      label = `${first.drink_name} — Waiting (${getQueuePosition(first.id)} of ${getTotalInQueue()})`;
    }
    return (
      <TouchableOpacity
        style={styles.brewingBadge}
        onPress={() => setCurrentScreen("brewing")}
        activeOpacity={0.8}
      >
        <View style={[styles.brewingBadgeDot, { backgroundColor: dotColor }]} />
        <Text style={styles.brewingBadgeText} numberOfLines={1}>
          {label}
        </Text>
        <Text style={styles.brewingBadgeArrow}>→</Text>
      </TouchableOpacity>
    );
  };

  const homeProps = {
    hasActiveOrder: isOrderingBlocked,
    onGoToBrewing: () => setCurrentScreen("brewing"),
    disabledDrinkIds,
  };
  const favProps = {
    favoriteConfigs,
    onSelectFavorite: handleSelectFavorite,
    onQuickBrewFavorite: handleQuickBrewFavorite,
  };
  const completedOrder = completedOrderId
    ? (orders.find((o) => o.id === completedOrderId) as any)
    : null;

  const renderScreen = () => {
    switch (currentScreen) {
      case "login":
        return (
          <LoginScreen
            initialView="welcome"
            onLogin={handleLogin}
            onSignUp={() => setCurrentScreen("signup")}
          />
        );
      case "signin":
        return (
          <LoginScreen
            initialView="signin"
            onLogin={handleLogin}
            onSignUp={() => setCurrentScreen("signup")}
            onBack={() => setCurrentScreen("login")}
          />
        );
      case "signup":
        return (
          <SignUpScreen
            onSignUp={handleSignUp}
            onBackToLogin={() => setCurrentScreen("login")}
            onGoToSignIn={() => setCurrentScreen("signin")}
          />
        );

      case "home":
        if (userType === "guest")
          return (
            <View style={{ flex: 1 }}>
              <BrewingBadge />
              <GuestHome onSelectDrink={handleSelectDrink} {...homeProps} />
            </View>
          );
        if (userType === "registered")
          return (
            <View style={{ flex: 1 }}>
              <BrewingBadge />
              <RegisteredHome
                userName={displayName}
                onSelectDrink={handleSelectDrink}
                {...homeProps}
                {...favProps}
              />
            </View>
          );
        if (userType === "admin")
          return (
            <View style={{ flex: 1 }}>
              <BrewingBadge />
              <AdminHome
                userName={displayName}
                onSelectDrink={handleSelectDrink}
                notifications={notifications}
                onGoToMessages={() => setCurrentScreen("adminMessages")}
                {...homeProps}
                {...favProps}
              />
            </View>
          );
        break;

      case "customDrink":
        return (
          <CustomDrink
            userName={displayName}
            userType={userType || "guest"}
            onBack={() => setCurrentScreen("home")}
            onStartBrew={handleStartBrew}
          />
        );

      case "customize":
        return (
          <DrinkCustomization
            drinkId={selectedDrink}
            userName={displayName}
            onBack={() => setCurrentScreen("home")}
            onStartBrew={handleStartBrew}
            favoriteConfigs={userType !== "guest" ? favoriteConfigs : []}
            onAddFavorite={userType !== "guest" ? addFavorite : undefined}
            onRemoveFavorite={userType !== "guest" ? removeFavorite : undefined}
            initialConfig={selectedFavoriteConfig || undefined}
          />
        );

      case "brewing":
        if (userActiveOrders.length === 0) {
          setCurrentScreen("home");
          return null;
        }
        return (
          <BrewingProgress
            userOrders={userActiveOrders}
            selectedOrderId={selectedOrderId || userActiveOrders[0]?.id}
            onSelectOrder={setSelectedOrderId}
            userName={displayName}
            currentlyBrewingId={machine.currentlyBrewingId}
            waitingForCupId={machine.waitingForCupId}
            brewProgress={machine.brewProgress}
            brewTimeLeft={machine.brewTimeLeft}
            onPlaceCup={machine.placeCup}
            onCancelOrder={handleCancelOrder}
            getQueuePosition={getQueuePosition}
            totalInQueue={getTotalInQueue()}
          />
        );

      case "complete":
        if (completedOrder) {
          const m = getMeasurementsForComplete(
            completedOrder.drink_id,
            completedOrder.size,
          );
          return (
            <BrewingComplete
              drinkId={completedOrder.drink_id}
              drinkName={completedOrder.drink_name}
              measurements={m}
              size={completedOrder.size}
              strength={completedOrder.strength}
              milkType={completedOrder.milk_type || "regular"}
              userName={displayName}
              onDone={handleBrewDone}
            />
          );
        }
        setCurrentScreen("home");
        return null;

      case "history":
        if (userType === "guest")
          return (
            <GuestHistoryScreen onLogin={() => setCurrentScreen("login")} />
          );
        return (
          <OrderHistory
            orders={saveOrderHistory ? orders : []}
            onRepeatOrder={handleRepeatOrder}
            saveOrderHistory={saveOrderHistory}
            userName={displayName}
            onBack={() => setCurrentScreen("home")}
          />
        );

      case "profile":
        if (userType === "guest")
          return (
            <GuestProfile
              onLogin={() => setCurrentScreen("login")}
              onReportProblem={() => setCurrentScreen("reportProblem")}
            />
          );
        if (userType === "admin")
          return (
            <AdminProfile
              userName={userName}
              totalOrders={orders.length}
              favoritesCount={favoriteConfigs.length}
              onBack={() => setCurrentScreen("admin")}
              onLogout={handleLogout}
              saveOrderHistory={saveOrderHistory}
              onToggleOrderHistory={setSaveOrderHistory}
              notifications={notifications}
              onToggleNotifications={setNotifications}
            />
          );
        if (userType)
          return (
            <UserProfile
              userName={userName}
              displayName={displayName}
              userType={userType}
              favoritesCount={favoriteConfigs.length}
              totalOrders={orders.length}
              onLogout={handleLogout}
              onBack={() => setCurrentScreen("home")}
              onReportProblem={() => setCurrentScreen("reportProblem")}
              saveOrderHistory={saveOrderHistory}
              onToggleOrderHistory={setSaveOrderHistory}
              notifications={notifications}
              onToggleNotifications={setNotifications}
            />
          );
        break;

      case "reportProblem":
        return (
          <ReportProblem
            userName={userType === "registered" ? userName : undefined}
            userType={userType === "guest" ? "guest" : "registered"}
            displayName={displayName}
            onBack={() => setCurrentScreen("profile")}
          />
        );

      case "admin":
        return (
          <NewAdminDashboard
            onBack={() => setCurrentScreen("home")}
            onViewAnalytics={() => setCurrentScreen("analytics")}
            onViewSupplies={() => setCurrentScreen("supplies")}
            onManageDrinks={() => setCurrentScreen("availability")}
            onViewInstructions={() => setCurrentScreen("instructions")}
            onContactSupport={() => setCurrentScreen("support")}
            onManageUsers={() => setCurrentScreen("users")}
            onViewMessages={() => setCurrentScreen("adminMessages")}
          />
        );

      case "analytics":
        return (
          <Analytics
            adminEmail={userName}
            onBack={() => setCurrentScreen("admin")}
          />
        );
      case "supplies":
        return <SupplyManagement onBack={() => setCurrentScreen("admin")} />;
      case "availability":
        return (
          <DrinkAvailability
            onBack={() => setCurrentScreen("admin")}
            onSaveAvailability={handleSaveAvailability}
          />
        );
      case "instructions":
        return <Instructions onBack={() => setCurrentScreen("admin")} />;
      case "support":
        return <ContactSupport onBack={() => setCurrentScreen("admin")} />;
      case "users":
        return <UserManagement onBack={() => setCurrentScreen("admin")} />;
      case "adminMessages":
        return <AdminMessages onBack={() => setCurrentScreen("admin")} />;

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <SafeAreaView style={styles.safeContent} edges={["top"]}>
        <View style={styles.content} pointerEvents="box-none">
          {renderScreen()}
        </View>
      </SafeAreaView>
      {showBottomNav && (
        <BottomNavigation
          activeTab={getActiveTab()}
          onTabChange={handleNavChange}
          userType={userType!}
        />
      )}
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <DatabaseProvider>
          <MachineProvider>
            <AppContent />
          </MachineProvider>
        </DatabaseProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  safeContent: { flex: 1 },
  content: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  loadingText: { marginTop: 16, fontSize: 16, color: "#666666" },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#dc2626",
    marginBottom: 8,
  },
  errorText: { fontSize: 14, color: "#666666", textAlign: "center" },
  brewingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000000",
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 4,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  brewingBadgeDot: { width: 8, height: 8, borderRadius: 4 },
  brewingBadgeText: {
    flex: 1,
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
  brewingBadgeArrow: { color: "#ffffff", fontSize: 16 },
});
