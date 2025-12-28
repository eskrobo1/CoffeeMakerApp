import React, { useState } from "react";
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from "react-native";

interface TextareaProps extends Omit<TextInputProps, "style"> {
  style?: ViewStyle | TextStyle;
  error?: boolean;
  minHeight?: number;
}

export function Textarea({
  style,
  error = false,
  minHeight = 80,
  editable = true,
  ...props
}: TextareaProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextInput
      multiline
      numberOfLines={4}
      textAlignVertical="top"
      style={[
        styles.textarea,
        { minHeight },
        isFocused && styles.textareaFocused,
        error && styles.textareaError,
        !editable && styles.textareaDisabled,
        style,
      ]}
      onFocus={(e) => {
        setIsFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setIsFocused(false);
        props.onBlur?.(e);
      }}
      editable={editable}
      placeholderTextColor="#9ca3af"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  textarea: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: "#111827",
    lineHeight: 24,
  },
  textareaFocused: {
    borderColor: "#D97706",
    borderWidth: 2,
    shadowColor: "#D97706",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  textareaError: {
    borderColor: "#ef4444",
    shadowColor: "#ef4444",
    shadowOpacity: 0.1,
  },
  textareaDisabled: {
    opacity: 0.5,
    backgroundColor: "#f9fafb",
  },
});
