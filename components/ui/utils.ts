// Utility funkcije za React Native aplikaciju

/**
 * Kombinuje više stilova u jedan niz
 * Koristi se umjesto cn() funkcije iz web verzije
 */
export function combineStyles(...styles: any[]) {
  return styles.filter(Boolean);
}

/**
 * Provjerava da li je string validan email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Formatira broj u currency format
 */
export function formatCurrency(
  amount: number,
  currency: string = "BAM"
): string {
  return new Intl.NumberFormat("bs-BA", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

/**
 * Skraćuje tekst na određeni broj karaktera
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}
