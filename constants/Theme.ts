import { Colors, ColorScheme } from "./Colors";
import { Typography, TextStyles } from "./Typography";
import { useColorScheme } from "react-native";

// Hook to get current theme
export const useTheme = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return {
    colors: isDark ? Colors.dark : Colors.light,
    typography: Typography,
    textStyles: TextStyles,
    isDark,
  };
};

// Static theme objects for use outside components
export const LightTheme = {
  colors: Colors.light,
  typography: Typography,
  textStyles: TextStyles,
};

export const DarkTheme = {
  colors: Colors.dark,
  typography: Typography,
  textStyles: TextStyles,
};

// Shadow presets (matching your box-shadow from CSS)
export const Shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Export everything
export { Colors, Typography, TextStyles };

// Type exports
export type Theme = typeof LightTheme;
export type ThemeColors = ColorScheme;
