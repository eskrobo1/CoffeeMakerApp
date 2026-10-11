# ☕ Coffee Device App

A smart office coffee machine ordering app built with React Native. Employees can remotely order drinks from their mobile device while administrators manage supplies, analytics, and machine maintenance.

---

## Features

**For employees and guests**
- Browse and order from 17 available drink types
- Customise each drink — size, coffee strength, milk type and amount, sugar, foam level
- Real-time calorie estimation while customising
- Build a fully custom drink from scratch
- Save favourite combinations with Quick Brew shortcut
- Track brewing status across up to 3 simultaneous orders
- View and repeat past orders from order history
- Report problems directly to the administrator

**For administrators**
- All employee features plus full admin panel
- Dashboard with daily order count, user stats and unread messages
- Supply management — track and refill 5 supply types with automatic decrease per order
- Analytics with monthly consumption data (2023–2026) and PDF/email export
- Drink availability control — enable or disable individual drinks
- User management — view and remove registered users
- Admin messages — read problem reports submitted by users and guests
- WiFi connection simulation — connect machine to office network
- Rinse and Deep Clean maintenance simulations with step-by-step progress
- Instructions and Contact Support modules

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React Native + Expo SDK |
| Language | TypeScript |
| Local database | expo-sqlite (SQLite) |
| Persistent storage | @react-native-async-storage/async-storage |
| Navigation | Custom state-based routing |
| Icons | lucide-react-native |
| PDF generation | expo-print + expo-sharing |
| Build tool | EAS Build |
| Target platform | Android (APK) |

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or newer
- [Expo CLI](https://docs.expo.dev/get-started/installation/) — `npm install -g expo`
- [EAS CLI](https://docs.expo.dev/build/introduction/) — `npm install -g eas-cli` (for building APK)
- Expo account (free) at [expo.dev](https://expo.dev) — required for EAS Build

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/coffee-device-app.git
cd coffee-device-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run on device or emulator

```bash
npx expo start
```

Scan the QR code with the **Expo Go** app (Android/iOS) to run on your physical device, or press `a` to open in an Android emulator.

---

## Building the APK

```bash
# Log in to your Expo account
eas login

# Build APK for Android
eas build -p android --profile preview
```

The build runs on Expo servers (~5–15 minutes). A download link is provided upon completion.

> **Download the latest release APK** directly from the [Releases](../../releases) section — no build required.

---

## Demo Credentials

| Email | Password | Role |
|---|---|---|
| admin@company.com | 9999 | Administrator |
| user@company.com | 1234 | Registered user |
| — | — | Continue as Guest |

**WiFi simulation:** Network `CoffeeNet` / Password `Coffee2026`

---

## Project Structure

```
coffee-device-app/
├── App.tsx                    # Root component, routing, state management
├── app.json                   # Expo configuration
├── eas.json                   # EAS Build profiles
│
├── assets/
│   ├── drinks/                # Drink images (PNG)
│   ├── icon.png
│   ├── splash-icon.png
│   └── adaptive-icon.png
│
├── contexts/
│   ├── DatabaseContext.tsx    # SQLite database provider
│   └── MachineContext.tsx     # Brewing queue and timer logic
│
├── hooks/
│   ├── useDatabase.ts
│   ├── useDrinks.ts
│   ├── useOrders.ts
│   ├── useFavorites.ts
│   └── useQueue.ts
│
├── database/
│   ├── schema.ts              # Table definitions
│   ├── init.ts                # Database initialisation
│   └── seeds.ts               # Demo data
│
├── data/
│   ├── drinkMeasurements.ts   # ml/g values per drink and size
│   └── drinkCalories.ts       # Calorie calculation constants
│
└── components/
    ├── ui/
    │   ├── AppSlider.tsx      # Custom JS slider (Android production fix)
    │   └── button.tsx
    ├── LoginScreen.tsx
    ├── SignUpScreen.tsx
    ├── GuestHome.tsx
    ├── RegisteredHome.tsx
    ├── AdminHome.tsx
    ├── DrinkCustomization.tsx
    ├── CustomDrink.tsx
    ├── BrewingProgress.tsx
    ├── BrewingComplete.tsx
    ├── OrderHistory.tsx
    ├── UserProfile.tsx
    ├── AdminProfile.tsx
    ├── GuestProfile.tsx
    ├── ReportProblem.tsx
    ├── NewAdminDashboard.tsx
    ├── Analytics.tsx
    ├── SupplyManagement.tsx
    ├── DrinkAvailability.tsx
    ├── UserManagement.tsx
    ├── AdminMessages.tsx
    ├── Instructions.tsx
    └── ContactSupport.tsx
```

---

## Database Schema

| Table | Description |
|---|---|
| `users` | Registered accounts with hashed passwords |
| `orders` | All orders with status: pending / brewing / completed / failed / cancelled |
| `favorites` | Saved drink configurations per user |
| `user_messages` | Problem reports from users and guests |
| `machine_status` | Current machine state |
| `alerts` | System alerts |
| `drinks` | Available drink catalogue |
| `drink_recipes` | Ingredient quantities per drink |
| `user_preferences` | Per-user settings |

---

## Key Implementation Notes

**Supply tracking** — A `consumptionRef` Map in `App.tsx` records exact ingredient amounts when an order is created. On completion, values are read from the Map and applied to supply levels. Cancelled orders do not affect supplies.

**Custom slider** — `@react-native-community/slider` does not respond to touch inside a `ScrollView` in Android production builds. `AppSlider.tsx` is a pure JavaScript replacement using `PanResponder` that works correctly in all builds.

**Dark mode** — `Appearance.setColorScheme("light")` is called at app startup to force light mode regardless of system settings.

**WiFi state** — Connection status is persisted in `AsyncStorage` and restored on next app launch.
