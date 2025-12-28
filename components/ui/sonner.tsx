import React from "react";
import Toast from "react-native-toast-message";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

// Konfiguracija custom toast komponenti
export const toastConfig = {
  success: ({ text1, text2, props }: any) => (
    <View style={[styles.toastContainer, styles.successToast]}>
      <View style={styles.toastContent}>
        {text1 && <Text style={styles.toastTitle}>{text1}</Text>}
        {text2 && <Text style={styles.toastDescription}>{text2}</Text>}
      </View>
      {props?.onPress && (
        <TouchableOpacity onPress={props.onPress} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>
            {props.actionText || "OK"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  ),
  error: ({ text1, text2, props }: any) => (
    <View style={[styles.toastContainer, styles.errorToast]}>
      <View style={styles.toastContent}>
        {text1 && <Text style={styles.toastTitle}>{text1}</Text>}
        {text2 && <Text style={styles.toastDescription}>{text2}</Text>}
      </View>
      {props?.onPress && (
        <TouchableOpacity onPress={props.onPress} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>
            {props.actionText || "OK"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  ),
  info: ({ text1, text2, props }: any) => (
    <View style={[styles.toastContainer, styles.infoToast]}>
      <View style={styles.toastContent}>
        {text1 && <Text style={styles.toastTitle}>{text1}</Text>}
        {text2 && <Text style={styles.toastDescription}>{text2}</Text>}
      </View>
      {props?.onPress && (
        <TouchableOpacity onPress={props.onPress} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>
            {props.actionText || "OK"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  ),
};

// Toaster komponenta koja se stavlja u root aplikacije
function ToasterComponent() {
  return <Toast config={toastConfig} />;
}

// Helper funkcije za prikazivanje toast-ova
export const toast = {
  success: (message: string, description?: string, options?: any) => {
    Toast.show({
      type: "success",
      text1: message,
      text2: description,
      props: options,
      position: "top",
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 50,
    });
  },
  error: (message: string, description?: string, options?: any) => {
    Toast.show({
      type: "error",
      text1: message,
      text2: description,
      props: options,
      position: "top",
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 50,
    });
  },
  info: (message: string, description?: string, options?: any) => {
    Toast.show({
      type: "info",
      text1: message,
      text2: description,
      props: options,
      position: "top",
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 50,
    });
  },
  dismiss: () => {
    Toast.hide();
  },
};

// Export kao Toaster da se ne mijenjaju ostali fileovi
export const Toaster = ToasterComponent;

const styles = StyleSheet.create({
  toastContainer: {
    width: "90%",
    minHeight: 60,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  successToast: {
    borderLeftWidth: 4,
    borderLeftColor: "#10b981",
  },
  errorToast: {
    borderLeftWidth: 4,
    borderLeftColor: "#ef4444",
  },
  infoToast: {
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },
  toastContent: {
    flex: 1,
  },
  toastTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6F4E37",
    marginBottom: 4,
  },
  toastDescription: {
    fontSize: 14,
    color: "#A0826D",
  },
  actionButton: {
    backgroundColor: "#D97706",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 12,
  },
  actionButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});
