// App.tsx
import React, { useState, useEffect } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LoginScreen } from "./components/LoginScreen";
import { SignUpScreen } from "./components/SignUpScreen";
import { GuestHome } from "./components/GuestHome";
import { RegisteredHome } from "./components/RegisteredHome";
import { AdminHome } from "./components/AdminHome";
import { DrinkCustomization } from "./components/DrinkCustomization";
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
import { BottomNavigation } from "./components/BottomNavigation";
import { drinkMeasurements } from "./data/drinkMeasurements";
import type { UserType, Order } from "./types";

export default function App() {
  const [userType, setUserType] = useState<UserType | null>(null);
  const [currentScreen, setCurrentScreen] = useState<string>("login");
  const [selectedDrink, setSelectedDrink] = useState<string>("");
  const [userName, setUserName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [favorites, setFavorites] = useState<string[]>(["cappuccino", "latte"]);
  const [brewConfig, setBrewConfig] = useState<any>(null);
  const [availableDrinks, setAvailableDrinks] = useState<string[]>(
    drinkMeasurements.map((d) => d.id)
  );
  const [notifications, setNotifications] = useState(true);
  const [saveOrderHistory, setSaveOrderHistory] = useState(true);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      drinkName: "Cappuccino",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      size: "medium",
      strength: "medium",
      milkType: "regular",
      customizations: ["Medium strength", "Regular milk", "Extra foam"],
    },
    {
      id: "2",
      drinkName: "Latte",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      size: "large",
      strength: "light",
      milkType: "plant-based",
      customizations: ["Light strength", "Plant-based milk"],
    },
  ]);

  // Load preferences from AsyncStorage
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const savedNotifications = await AsyncStorage.getItem("notifications");
        const savedOrderHistory = await AsyncStorage.getItem(
          "saveOrderHistory"
        );

        if (savedNotifications !== null) {
          setNotifications(savedNotifications === "true");
        }
        if (savedOrderHistory !== null) {
          setSaveOrderHistory(savedOrderHistory === "true");
        }
      } catch (error) {
        console.error("Error loading preferences:", error);
      }
    };

    loadPreferences();
  }, []);

  // Save order history preference
  useEffect(() => {
    const savePreference = async () => {
      try {
        await AsyncStorage.setItem(
          "saveOrderHistory",
          String(saveOrderHistory)
        );
      } catch (error) {
        console.error("Error saving order history preference:", error);
      }
    };

    savePreference();
  }, [saveOrderHistory]);

  // Save notifications preference
  useEffect(() => {
    const savePreference = async () => {
      try {
        await AsyncStorage.setItem("notifications", String(notifications));
      } catch (error) {
        console.error("Error saving notifications preference:", error);
      }
    };

    savePreference();
  }, [notifications]);

  const handleLogin = (type: UserType, name: string) => {
    setUserType(type);
    setUserName(name);
    const displayNameFromEmail = name.includes("@") ? name.split("@")[0] : name;
    setDisplayName(displayNameFromEmail);
    setCurrentScreen("home");
  };

  const handleSignUp = (type: UserType, name: string, email: string) => {
    setUserType(type);
    setUserName(email);
    setDisplayName(name);
    setCurrentScreen("home");
  };

  const handleLogout = () => {
    setUserType(null);
    setUserName("");
    setDisplayName("");
    setCurrentScreen("login");
  };

  const handleSelectDrink = (drinkId: string) => {
    setSelectedDrink(drinkId);
    setCurrentScreen("customize");
  };

  const handleQuickBrew = (drinkId: string) => {
    const drink =
      drinkMeasurements.find((d) => d.id === drinkId) || drinkMeasurements[0];
    const config = {
      drinkId,
      drinkName: drink.name,
      size: "medium",
      strength: "regular",
      milkType: "regular",
      measurements: {
        water: drink.medium.water,
        milk: drink.medium.milk,
        milkFoam: drink.medium.milkFoam,
        coffee: drink.medium.coffee,
        sugar: 0,
      },
    };
    setBrewConfig(config);
    setCurrentScreen("brewing");
  };

  const handleStartBrew = (config: any) => {
    setBrewConfig(config);
    setCurrentScreen("brewing");
  };

  const handleBrewComplete = () => {
    setCurrentScreen("complete");
  };

  const handleBrewDone = () => {
    setCurrentScreen("home");

    if (saveOrderHistory && brewConfig) {
      const newOrder: Order = {
        id: Date.now().toString(),
        drinkName: brewConfig.drinkName,
        timestamp: new Date(),
        size: brewConfig.size,
        strength: brewConfig.strength,
        milkType: brewConfig.milkType,
        customizations: [
          `${brewConfig.strength} strength`,
          `${brewConfig.milkType} milk`,
          `${brewConfig.measurements.sugar}g sugar`,
        ],
      };
      setOrders([newOrder, ...orders]);
    }
  };

  const handleNavChange = (tab: "home" | "history" | "profile" | "admin") => {
    console.log("Navigation tab changed to:", tab); // Debug log
    setCurrentScreen(tab);
  };

  const handleRepeatOrder = (order: Order) => {
    const drinkMap: Record<string, string> = {
      Cappuccino: "cappuccino",
      Latte: "latte",
      Espresso: "espresso",
      Mocha: "mocha",
      "Hot Chocolate": "hotChocolate",
    };
    setSelectedDrink(drinkMap[order.drinkName] || "custom");
    setCurrentScreen("customize");
  };

  const handleToggleFavorite = (drinkId: string) => {
    if (favorites.includes(drinkId)) {
      setFavorites(favorites.filter((id) => id !== drinkId));
    } else {
      setFavorites([...favorites, drinkId]);
    }
  };

  // Determine if we should show bottom nav
  const showBottomNav =
    userType !== null &&
    currentScreen !== "login" &&
    currentScreen !== "signup";

  // Map currentScreen to activeTab for BottomNavigation
  const getActiveTab = (): "home" | "history" | "profile" | "admin" => {
    if (
      currentScreen === "admin" ||
      currentScreen === "analytics" ||
      currentScreen === "supplies" ||
      currentScreen === "availability"
    ) {
      return "admin";
    }
    if (currentScreen === "history") {
      return "history";
    }
    if (currentScreen === "profile") {
      return "profile";
    }
    return "home"; // default to home for all other screens
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "login":
        return (
          <LoginScreen
            onLogin={handleLogin}
            onSignUp={() => setCurrentScreen("signup")}
          />
        );

      case "signup":
        return (
          <SignUpScreen
            onSignUp={handleSignUp}
            onBackToLogin={() => setCurrentScreen("login")}
          />
        );

      case "home":
        if (userType === "guest") {
          return <GuestHome onSelectDrink={handleSelectDrink} />;
        }
        if (userType === "registered") {
          return (
            <RegisteredHome
              userName={displayName}
              favorites={favorites}
              onSelectDrink={handleSelectDrink}
              onToggleFavorite={handleToggleFavorite}
              onQuickBrew={handleQuickBrew}
            />
          );
        }
        if (userType === "admin") {
          return (
            <AdminHome
              userName={displayName}
              favorites={favorites}
              onSelectDrink={handleSelectDrink}
              onToggleFavorite={handleToggleFavorite}
              onQuickBrew={handleQuickBrew}
            />
          );
        }
        break;

      case "customize":
        return (
          <DrinkCustomization
            drinkId={selectedDrink}
            onBack={() => setCurrentScreen("home")}
            onStartBrew={handleStartBrew}
            onToggleFavorite={
              userType !== "guest" ? handleToggleFavorite : undefined
            }
            isFavorite={
              userType !== "guest" ? favorites.includes(selectedDrink) : false
            }
          />
        );

      case "brewing":
        if (brewConfig) {
          return (
            <BrewingProgress
              drinkName={brewConfig.drinkName}
              measurements={brewConfig.measurements}
              size={brewConfig.size}
              strength={brewConfig.strength}
              milkType={brewConfig.milkType}
              onComplete={handleBrewComplete}
            />
          );
        }
        break;

      case "complete":
        if (brewConfig) {
          return (
            <BrewingComplete
              drinkName={brewConfig.drinkName}
              measurements={brewConfig.measurements}
              size={brewConfig.size}
              strength={brewConfig.strength}
              milkType={brewConfig.milkType}
              onDone={handleBrewDone}
            />
          );
        }
        break;

      case "history":
        return (
          <OrderHistory
            orders={orders}
            onRepeatOrder={handleRepeatOrder}
            saveOrderHistory={saveOrderHistory}
            userName={userName}
            onBack={() => setCurrentScreen("home")}
          />
        );

      case "profile":
        if (userType === "guest") {
          return <GuestProfile onLogin={() => setCurrentScreen("login")} />;
        }
        if (userType === "admin") {
          return (
            <AdminProfile
              userName={userName}
              totalOrders={orders.length}
              favoritesCount={favorites.length}
              onBack={() => setCurrentScreen("admin")}
              onLogout={handleLogout}
              saveOrderHistory={saveOrderHistory}
              onToggleOrderHistory={setSaveOrderHistory}
              notifications={notifications}
              onToggleNotifications={setNotifications}
            />
          );
        }
        if (userType) {
          return (
            <UserProfile
              userName={userName}
              userType={userType}
              favoritesCount={favorites.length}
              totalOrders={orders.length}
              onLogout={handleLogout}
              saveOrderHistory={saveOrderHistory}
              onToggleOrderHistory={setSaveOrderHistory}
              notifications={notifications}
              onToggleNotifications={setNotifications}
            />
          );
        }
        break;

      case "admin":
        return (
          <NewAdminDashboard
            onBack={() => setCurrentScreen("home")}
            onViewAnalytics={() => setCurrentScreen("analytics")}
            onViewSupplies={() => setCurrentScreen("supplies")}
            onManageDrinks={() => setCurrentScreen("availability")}
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
        return <DrinkAvailability onBack={() => setCurrentScreen("admin")} />;

      default:
        return null;
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

          {/* Content sa flex: 1 */}
          <View style={styles.content} pointerEvents="box-none">
            {renderScreen()}
          </View>

          {/* Bottom Navigation BEZ position: absolute */}
          {showBottomNav && (
            <BottomNavigation
              activeTab={getActiveTab()}
              onTabChange={handleNavChange}
              userType={userType!}
            />
          )}
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
  },
});
