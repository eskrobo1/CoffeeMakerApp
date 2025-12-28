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
  ImageBackground,
} from "react-native";
import { X } from "lucide-react-native";
import { useTheme } from "../constants/Theme";
import { Button } from "./ui/button";

type UserType = "guest" | "registered" | "admin";

interface LoginScreenProps {
  onLogin: (type: UserType, name: string) => void;
  onSignUp?: () => void;
}

export function LoginScreen({ onLogin, onSignUp }: LoginScreenProps) {
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [showSignIn, setShowSignIn] = useState(false);

  const handleSubmit = () => {
    if (email === "admin@company.com" && pin === "9999") {
      onLogin("admin", email);
    } else if (email === "user@company.com" && pin === "1234") {
      onLogin("registered", email);
    } else if (email && pin) {
      Alert.alert("Error", "Invalid credentials");
    }
  };

  const handleGuestLogin = () => {
    onLogin("guest", "Guest User");
  };

  if (showSignIn) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Sign In Form - kao što je bilo */}
        <View style={styles.formContainer}>
          <TouchableOpacity
            onPress={() => setShowSignIn(false)}
            style={[styles.closeButton, { backgroundColor: colors.muted }]}
          >
            <X size={20} color={colors.foreground} />
          </TouchableOpacity>

          <View style={styles.formHeader}>
            <Text style={[styles.formTitle, { color: colors.foreground }]}>
              Sign in
            </Text>
            <Text
              style={[styles.formSubtitle, { color: colors.mutedForeground }]}
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
              <TextInput
                placeholder="Enter your PIN"
                placeholderTextColor={colors.mutedForeground}
                value={pin}
                onChangeText={setPin}
                secureTextEntry
                maxLength={4}
                keyboardType="number-pad"
                style={[
                  styles.input,
                  { backgroundColor: colors.muted, color: colors.foreground },
                ]}
              />
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
              Admin: admin@company.com / PIN: 9999
            </Text>
            <Text style={[styles.demoText, { color: colors.mutedForeground }]}>
              User: user@company.com / PIN: 1234
            </Text>
          </View>

          <View style={styles.signUpSection}>
            <Text
              style={[styles.signUpText, { color: colors.mutedForeground }]}
            >
              Don't have an account?{" "}
              <Text
                onPress={onSignUp}
                style={[styles.signUpLink, { color: colors.foreground }]}
              >
                Sign Up
              </Text>
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Background Image - 80% ekrana po visini */}
      <View style={styles.backgroundImageContainer}>
        <Image
          source={require("../assets/coffee-machine.png")} // ← Tvoja slika
          style={styles.backgroundImage}
          resizeMode="cover" // Pokriva prostor, crop-uje desno
        />
      </View>

      {/* Content iznad slike */}
      <View style={styles.contentOverlay}>
        {/* Welcome Card */}
        <View style={[styles.welcomeCard, { backgroundColor: colors.card }]}>
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
              Unlock the power of automation in your{"\n"}daily coffee routine.
            </Text>
          </View>

          <View style={styles.buttonGroup}>
            <Button
              onPress={() => setShowSignIn(true)}
              style={styles.primaryButton}
            >
              Sign in
            </Button>

            <Button
              onPress={handleGuestLogin}
              variant="outline"
              style={[styles.guestButton, { backgroundColor: colors.muted }]}
            >
              Continue as guest
            </Button>
          </View>

          <Text style={[styles.termsText, { color: colors.mutedForeground }]}>
            By using this app, you agree to our{" "}
            <Text style={styles.termsLink}>Privacy policy</Text>
            {"\n"}and <Text style={styles.termsLink}>Terms of use</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    resizeMode: "cover",
    position: "absolute",
    left: 0,
  },

  contentOverlay: {
    flex: 1,
    justifyContent: "flex-end", // Gurne welcome card na dno
  },
  welcomeCard: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
  },
  welcomeContent: {
    alignItems: "center",
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 30,
    fontWeight: "600",
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  buttonGroup: {
    gap: 16,
    marginBottom: 24,
  },
  primaryButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#000000",
    borderRadius: 28,
  },
  guestButton: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    borderWidth: 0,
  },
  termsText: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
  termsLink: {
    textDecorationLine: "underline",
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 24,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 48,
  },
  formHeader: {
    alignItems: "center",
    marginBottom: 40,
  },
  formTitle: {
    fontSize: 30,
    fontWeight: "600",
    marginBottom: 12,
  },
  formSubtitle: {
    fontSize: 16,
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  input: {
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  signInButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#000000",
    borderRadius: 28,
    marginTop: 8,
  },
  demoCredentials: {
    alignItems: "center",
    marginTop: 40,
    gap: 4,
  },
  demoTitle: {
    fontSize: 12,
  },
  demoText: {
    fontSize: 12,
  },
  signUpSection: {
    alignItems: "center",
    marginTop: 24,
  },
  signUpText: {
    fontSize: 14,
  },
  signUpLink: {
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
