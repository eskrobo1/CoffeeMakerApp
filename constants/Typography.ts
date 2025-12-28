export const Typography = {
  // Font sizes (converted from CSS vars)
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16, // --font-size: 16px
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
  },

  // Font weights
  fontWeight: {
    normal: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Border radius (converted from --radius: 0.625rem = 10px)
  borderRadius: {
    sm: 6, // --radius-sm: calc(var(--radius) - 4px)
    md: 8, // --radius-md: calc(var(--radius) - 2px)
    lg: 10, // --radius-lg: var(--radius)
    xl: 14, // --radius-xl: calc(var(--radius) + 4px)
    full: 9999,
  },

  // Spacing scale
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    "2xl": 48,
  },
};

// Text style presets matching your CSS
export const TextStyles = {
  h1: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.medium,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize["2xl"],
  },
  h2: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.xl,
  },
  h3: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.lg,
  },
  h4: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.base,
  },
  body: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.normal,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.base,
  },
  label: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.base,
  },
  button: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.base,
  },
  small: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.normal,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.sm,
  },
};
