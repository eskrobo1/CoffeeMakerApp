export const Colors = {
  light: {
    background: "#ffffff",
    foreground: "#252525", // oklch(0.145 0 0) approximation
    card: "#ffffff",
    cardForeground: "#252525",
    popover: "#ffffff",
    popoverForeground: "#252525",
    primary: "#030213",
    primaryForeground: "#ffffff",
    secondary: "#f2f2f5", // oklch(0.95 0.0058 264.53) approximation
    secondaryForeground: "#030213",
    muted: "#ececf0",
    mutedForeground: "#717182",
    accent: "#e9ebef",
    accentForeground: "#030213",
    destructive: "#d4183d",
    destructiveForeground: "#ffffff",
    border: "rgba(0, 0, 0, 0.1)",
    input: "transparent",
    inputBackground: "#f3f3f5",
    switchBackground: "#cbced4",
    ring: "#b5b5b5", // oklch(0.708 0 0) approximation

    // Chart colors
    chart1: "#e89b52",
    chart2: "#6db3c4",
    chart3: "#4d5d7a",
    chart4: "#e6d86f",
    chart5: "#d9a75a",

    // Sidebar
    sidebar: "#fafafa",
    sidebarForeground: "#252525",
    sidebarPrimary: "#030213",
    sidebarPrimaryForeground: "#fafafa",
    sidebarAccent: "#f7f7f7",
    sidebarAccentForeground: "#363636",
    sidebarBorder: "#ebebeb",
    sidebarRing: "#b5b5b5",
  },

  dark: {
    background: "#252525",
    foreground: "#fafafa",
    card: "#252525",
    cardForeground: "#fafafa",
    popover: "#252525",
    popoverForeground: "#fafafa",
    primary: "#fafafa",
    primaryForeground: "#363636",
    secondary: "#454545",
    secondaryForeground: "#fafafa",
    muted: "#454545",
    mutedForeground: "#b5b5b5",
    accent: "#454545",
    accentForeground: "#fafafa",
    destructive: "#8b3a4a",
    destructiveForeground: "#d98e9b",
    border: "#454545",
    input: "#454545",
    inputBackground: "#3a3a3a",
    switchBackground: "#5a5a5a",
    ring: "#707070",

    // Chart colors
    chart1: "#7b6fd9",
    chart2: "#98d4b8",
    chart3: "#d9a75a",
    chart4: "#c88bcc",
    chart5: "#d98870",

    // Sidebar
    sidebar: "#363636",
    sidebarForeground: "#fafafa",
    sidebarPrimary: "#7b6fd9",
    sidebarPrimaryForeground: "#fafafa",
    sidebarAccent: "#454545",
    sidebarAccentForeground: "#fafafa",
    sidebarBorder: "#454545",
    sidebarRing: "#707070",
  },
};

// Helper type for theme colors
export type ColorScheme = typeof Colors.light;
