// components/LoginScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ArrowLeft, Eye, EyeOff } from "lucide-react-native";
import { useTheme } from "../constants/Theme";
import { Button } from "./ui/button";

type UserType = "guest" | "registered" | "admin";
type LoginView = "welcome" | "signin" | "privacy" | "terms";

interface LoginScreenProps {
  onLogin: (type: UserType, name: string) => void;
  onSignUp?: () => void;
  initialView?: "welcome" | "signin";
  onBack?: () => void;
}

const PRIVACY_POLICY = `Privacy Policy

Last updated: July 2026

1. Information We Collect
We collect the information you provide when creating an account, including your name and email address. We also collect data about your coffee orders and preferences within this app.

2. How We Use Your Information
Your information is used solely to provide and improve the coffee machine service. We do not sell your data to third parties.

3. Data Storage
All data is stored locally on the device running this application. No data is transmitted to external servers.

4. Order History
If you enable order history, your past orders are stored locally. You may disable this at any time in your profile settings.

5. Account Deletion
You may request account deletion by contacting your machine administrator.

6. Changes to This Policy
We may update this policy from time to time. Changes will be reflected in the app.

7. Contact
For questions about this policy, contact your machine administrator.`;

const TERMS_OF_USE = `Terms of Use

Last updated: July 2026

1. Acceptance of Terms
By using this application, you agree to these Terms of Use. If you do not agree, please do not use the app.

2. Permitted Use
This application is intended solely for ordering beverages from the designated coffee machine. Misuse of the system is prohibited.

3. Account Responsibility
You are responsible for maintaining the confidentiality of your account credentials. Do not share your password with others.

4. Limitations
The service is provided as-is. We do not guarantee uninterrupted availability of the coffee machine or the application.

5. Guest Access
Guest users may use the application without an account but will not have access to order history, favourites, or personalised features.

6. Modifications
We reserve the right to modify or discontinue the service at any time.

7. Governing Law
These terms are governed by applicable local law.`;

export function LoginScreen({
  onLogin,
  onSignUp,
  initialView = "welcome",
  onBack,
}: LoginScreenProps) {
  const { colors } = useTheme();
  const [view, setView] = useState<LoginView>(initialView);
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false); // eye toggle za Sign In

  const handleSubmit = () => {
    if (email === "admin@company.com" && pin === "9999") {
      onLogin("admin", email);
    } else if (email === "user@company.com" && pin === "1234") {
      onLogin("registered", email);
    } else if (email && pin) {
      Alert.alert(
        "Invalid credentials",
        "Please check your email and password.",
      );
    } else {
      Alert.alert("Missing fields", "Please enter both email and password.");
    }
  };

  const handleBack = () => {
    if (view === "signin") {
      if (initialView === "signin" && onBack) onBack();
      else setView("welcome");
    } else if (view === "privacy" || view === "terms") {
      setView("welcome");
    }
  };

  // ── Privacy / Terms ──────────────────────────────────────────────────────
  if (view === "privacy" || view === "terms") {
    const title = view === "privacy" ? "Privacy Policy" : "Terms of Use";
    const body = view === "privacy" ? PRIVACY_POLICY : TERMS_OF_USE;
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.legalHeader}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ArrowLeft size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={[styles.legalTitle, { color: colors.foreground }]}>
            {title}
          </Text>
        </View>
        <ScrollView
          style={styles.legalContent}
          contentContainerStyle={styles.legalBody}
        >
          <Text style={[styles.legalText, { color: colors.foreground }]}>
            {body}
          </Text>
        </ScrollView>
      </View>
    );
  }

  // ── Sign In — sa eye ikonom za password ──────────────────────────────────
  if (view === "signin") {
    return (
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.signinScrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            onPress={handleBack}
            style={[styles.backBtn, { backgroundColor: colors.muted }]}
          >
            <ArrowLeft size={20} color={colors.foreground} />
          </TouchableOpacity>

          <View style={styles.signinHeader}>
            <Text style={[styles.signinTitle, { color: colors.foreground }]}>
              Sign in
            </Text>
            <Text
              style={[styles.signinSubtitle, { color: colors.mutedForeground }]}
            >
              Access your coffee preferences
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.foreground }]}>
                Email
              </Text>
              <TextInput
                placeholder="name@mail.com"
                placeholderTextColor={colors.mutedForeground}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={[
                  styles.input,
                  { backgroundColor: colors.muted, color: colors.foreground },
                ]}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.foreground }]}>
                Password
              </Text>
              {/* Password polje sa eye ikonom */}
              <View
                style={[styles.passwordRow, { backgroundColor: colors.muted }]}
              >
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor={colors.mutedForeground}
                  value={pin}
                  onChangeText={setPin}
                  secureTextEntry={!showPin}
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                  style={[styles.passwordInput, { color: colors.foreground }]}
                />
                <TouchableOpacity
                  onPress={() => setShowPin(!showPin)}
                  style={styles.eyeBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  {showPin ? (
                    <EyeOff size={20} color={colors.mutedForeground} />
                  ) : (
                    <Eye size={20} color={colors.mutedForeground} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <Button onPress={handleSubmit} style={styles.signInButton}>
              Sign in
            </Button>
          </View>

          <View style={styles.demoCredentials}>
            <Text style={[styles.demoTitle, { color: colors.mutedForeground }]}>
              Demo Credentials:
            </Text>
            <Text style={[styles.demoText, { color: colors.mutedForeground }]}>
              Admin: admin@company.com / 9999
            </Text>
            <Text style={[styles.demoText, { color: colors.mutedForeground }]}>
              User: user@company.com / 1234
            </Text>
          </View>

          <View style={styles.signUpRow}>
            <Text
              style={[styles.signUpText, { color: colors.mutedForeground }]}
            >
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity
              onPress={onSignUp}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={[styles.signUpLink, { color: colors.foreground }]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // ── Welcome — scrollabilan da se vidi Privacy/Terms na malim ekranima ────
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.backgroundImageContainer}>
        <Image
          source={require("../assets/coffee-machine.png")}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.contentOverlay}>
        <View style={[styles.welcomeCard, { backgroundColor: colors.card }]}>
          {/* ScrollView unutar kartice — sadržaj skroluje ako je ekran mali */}
          <ScrollView
            contentContainerStyle={styles.welcomeCardContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.welcomeContent}>
              <Text style={[styles.welcomeTitle, { color: colors.foreground }]}>
                Welcome
              </Text>
              <Text
                style={[
                  styles.welcomeSubtitle,
                  { color: colors.mutedForeground },
                ]}
              >
                Unlock the power of automation in your{"\n"}daily coffee
                routine.
              </Text>
            </View>

            <View style={styles.buttonGroup}>
              <Button
                onPress={() => setView("signin")}
                style={styles.primaryButton}
              >
                Sign in
              </Button>
              <Button
                onPress={() => onLogin("guest", "Guest User")}
                variant="outline"
                style={[styles.guestButton, { backgroundColor: colors.muted }]}
              >
                Continue as guest
              </Button>
            </View>

            <Text style={[styles.termsText, { color: colors.mutedForeground }]}>
              By using this app, you agree to our{" "}
              <Text style={styles.termsLink} onPress={() => setView("privacy")}>
                Privacy policy
              </Text>
              {"\n"}and{" "}
              <Text style={styles.termsLink} onPress={() => setView("terms")}>
                Terms of use
              </Text>
            </Text>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "60%",
    overflow: "hidden",
  },
  backgroundImage: {
    width: "160%",
    height: "100%",
    position: "absolute",
    left: 0,
  },
  contentOverlay: { flex: 1, justifyContent: "flex-end" },
  welcomeCard: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: "60%", // ne prelazi 60% ekrana
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
  },
  welcomeCardContent: {
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 64, // dovoljno za Android navigacijsku traku na dnu
  },
  welcomeContent: { alignItems: "center", marginBottom: 32 },
  welcomeTitle: { fontSize: 30, fontWeight: "600", marginBottom: 12 },
  welcomeSubtitle: { fontSize: 16, textAlign: "center", lineHeight: 24 },
  buttonGroup: { gap: 16, marginBottom: 24 },
  primaryButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#000000",
    borderRadius: 28,
  },
  guestButton: { width: "100%", height: 56, borderRadius: 28, borderWidth: 0 },
  termsText: { fontSize: 12, textAlign: "center", lineHeight: 20 },
  termsLink: {
    color: "#000000",
    fontWeight: "600",
    textDecorationLine: "underline",
  },

  // Sign In
  signinScrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingTop: 24,
    paddingBottom: 60,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  signinHeader: { alignItems: "center", marginBottom: 40 },
  signinTitle: { fontSize: 30, fontWeight: "600", marginBottom: 12 },
  signinSubtitle: { fontSize: 16 },
  form: { gap: 24 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: "500" },
  input: { height: 56, borderRadius: 12, paddingHorizontal: 16, fontSize: 16 },
  // Password row sa eye ikonom
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  passwordInput: { flex: 1, fontSize: 16 },
  eyeBtn: { padding: 4 },
  signInButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#000000",
    borderRadius: 28,
    marginTop: 8,
  },
  demoCredentials: { alignItems: "center", marginTop: 32, gap: 4 },
  demoTitle: { fontSize: 12 },
  demoText: { fontSize: 12 },
  signUpRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingVertical: 8,
  },
  signUpText: { fontSize: 14 },
  signUpLink: {
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },

  // Legal
  legalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  legalTitle: { fontSize: 20, fontWeight: "600" },
  legalContent: { flex: 1 },
  legalBody: { padding: 24, paddingBottom: 60 },
  legalText: { fontSize: 14, lineHeight: 24 },
});
