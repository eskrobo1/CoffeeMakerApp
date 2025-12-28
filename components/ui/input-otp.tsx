import * as React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Minus } from "lucide-react-native";

interface InputOTPProps {
  maxLength: number;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export function InputOTP({
  maxLength,
  value = "",
  onChange,
  disabled = false,
  style,
}: InputOTPProps) {
  const [otp, setOtp] = React.useState(value);
  const inputRefs = React.useRef<(TextInput | null)[]>([]);

  React.useEffect(() => {
    setOtp(value);
  }, [value]);

  const handleChange = (text: string, index: number) => {
    // Only allow single character
    const char = text.slice(-1);

    const newOtp = otp.split("");
    newOtp[index] = char;
    const updatedOtp = newOtp.join("");
    setOtp(updatedOtp);
    onChange?.(updatedOtp);

    // Auto-focus next input
    if (char && index < maxLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (text: string, index: number) => {
    // If text is empty and we're deleting, focus previous input
    if (text === "" && index > 0) {
      const newOtp = otp.split("");
      newOtp[index] = "";
      setOtp(newOtp.join(""));
      onChange?.(newOtp.join(""));
      inputRefs.current[index - 1]?.focus();
    }
  };

  const setRef = (ref: TextInput | null, index: number) => {
    inputRefs.current[index] = ref;
  };

  return (
    <View style={[styles.inputOTP, style]}>
      {Array.from({ length: maxLength }).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => setRef(ref, index)}
          style={[styles.inputOTPSlot, otp[index] && styles.inputOTPSlotFilled]}
          value={otp[index] || ""}
          onChangeText={(text) => {
            if (text.length === 0) {
              handleBackspace(text, index);
            } else {
              handleChange(text, index);
            }
          }}
          maxLength={1}
          keyboardType="number-pad"
          editable={!disabled}
          selectTextOnFocus
        />
      ))}
    </View>
  );
}

interface InputOTPGroupProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function InputOTPGroup({ children, style }: InputOTPGroupProps) {
  return <View style={[styles.inputOTPGroup, style]}>{children}</View>;
}

interface InputOTPSlotProps {
  index: number;
  char?: string;
  isActive?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function InputOTPSlot({
  index,
  char,
  isActive = false,
  style,
  textStyle,
}: InputOTPSlotProps) {
  return (
    <View
      style={[
        styles.inputOTPSlot,
        isActive && styles.inputOTPSlotActive,
        style,
      ]}
    >
      <TextInput
        style={[styles.inputOTPSlotText, textStyle]}
        value={char}
        maxLength={1}
        editable={false}
      />
    </View>
  );
}

interface InputOTPSeparatorProps {
  style?: ViewStyle;
}

export function InputOTPSeparator({ style }: InputOTPSeparatorProps) {
  return (
    <View style={[styles.inputOTPSeparator, style]}>
      <Minus size={16} color="#6B7280" />
    </View>
  );
}

const styles = StyleSheet.create({
  inputOTP: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  inputOTPGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  inputOTPSlot: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#F9FAFB",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 14,
    textAlign: "center",
  },
  inputOTPSlotFilled: {
    borderColor: "#9CA3AF",
  },
  inputOTPSlotActive: {
    borderColor: "#000000",
    borderWidth: 2,
  },
  inputOTPSlotText: {
    fontSize: 14,
    textAlign: "center",
    padding: 0,
  },
  inputOTPSeparator: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
});
