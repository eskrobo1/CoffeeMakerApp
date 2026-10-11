// components/SignUpScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { User, Mail, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react-native";
import type { UserType } from "../types";

interface SignUpScreenProps {
  onSignUp: (
    type: UserType,
    name: string,
    email: string,
    password: string,
  ) => void;
  onBackToLogin: () => void;
  onGoToSignIn?: () => void;
}

export function SignUpScreen({
  onSignUp,
  onBackToLogin,
  onGoToSignIn,
}: SignUpScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // eye za password
  const [showConfirm, setShowConfirm] = useState(false); // eye za confirm

  const handleSubmit = () => {
    setError("");
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    const userType: UserType = email.toLowerCase().includes("admin")
      ? "admin"
      : "registered";
    onSignUp(userType, name, email, password);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onBackToLogin}
            style={styles.backButton}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ArrowLeft size={20} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Sign up to unlock personalized features
          </Text>
        </View>

        <ScrollView
          style={styles.formContainer}
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputContainer}>
              <User size={20} color="#9ca3af" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor="#9ca3af"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputContainer}>
              <Mail size={20} color="#9ca3af" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="john@example.com"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Password — sa eye ikonom */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <Lock size={20} color="#9ca3af" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Min. 4 characters"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#9ca3af" />
                ) : (
                  <Eye size={20} color="#9ca3af" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password — sa eye ikonom */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputContainer}>
              <Lock size={20} color="#9ca3af" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Re-enter password"
                placeholderTextColor="#9ca3af"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirm}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowConfirm(!showConfirm)}
                style={styles.eyeButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                {showConfirm ? (
                  <EyeOff size={20} color="#9ca3af" />
                ) : (
                  <Eye size={20} color="#9ca3af" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {error !== "" && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.submitButton}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onGoToSignIn || onBackToLogin}
            style={styles.signInContainer}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 20, right: 20 }}
          >
            <Text style={styles.signInText}>Already have an account? </Text>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  innerContainer: { flex: 1 },
  header: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: { fontSize: 24, fontWeight: "700", color: "#111827", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#4b5563" },
  formContainer: { flex: 1 },
  formContent: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    paddingBottom: 40,
  },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, color: "#374151", marginBottom: 8, fontWeight: "500" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 16,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: "#111827" },
  eyeButton: { padding: 4 },
  errorContainer: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  errorText: { fontSize: 14, color: "#dc2626" },
  submitButton: {
    width: "100%",
    height: 48,
    backgroundColor: "#000000",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  submitButtonText: { fontSize: 16, fontWeight: "600", color: "#ffffff" },
  signInContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    paddingVertical: 12,
  },
  signInText: { fontSize: 14, color: "#4b5563" },
  signInLink: { fontSize: 14, color: "#000000", fontWeight: "600" },
});
