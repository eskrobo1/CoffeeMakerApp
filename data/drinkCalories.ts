// data/drinkCalories.ts
// Bazne kalorije za svaki napitak - samo coffee/water komponenta (bez mlijeka i šećera)
// Mlijeko, pjena i šećer se računaju dinamički u DrinkCustomization

export interface DrinkBaseCalories {
  small: number;
  medium: number;
  large: number;
}

// Kalorije od same kafe/vode (bez mlijeka i šećera)
export const drinkBaseCalories: Record<string, DrinkBaseCalories> = {
  "caffe-latte": { small: 8, medium: 12, large: 16 },
  espresso: { small: 3, medium: 5, large: 8 },
  ristretto: { small: 3, medium: 5, large: 7 },
  cortado: { small: 5, medium: 8, large: 12 },
  "latte-macchiato": { small: 8, medium: 12, large: 16 },
  coffee: { small: 5, medium: 8, large: 12 },
  cappuccino: { small: 8, medium: 12, large: 16 },
  "cold-brew-coffee": { small: 5, medium: 8, large: 12 },
  "espresso-macchiato": { small: 5, medium: 8, large: 12 },
  "flat-white": { small: 8, medium: 12, large: 16 },
  americano: { small: 5, medium: 8, large: 12 },
  "lungo-barista": { small: 6, medium: 9, large: 13 },
  "sweet-latte": { small: 8, medium: 12, large: 16 },
  "espresso-doppio": { small: 6, medium: 10, large: 14 },
  "hot-water": { small: 0, medium: 0, large: 0 },
  "portion-of-milk": { small: 0, medium: 0, large: 0 },
  "portion-of-milk-foam": { small: 0, medium: 0, large: 0 },
  custom: { small: 8, medium: 12, large: 16 },
};

// Kalorije po ml mlijeka
export const MILK_KCAL_PER_ML = {
  regular: 0.62, // punomasno mlijeko ~62 kcal/100ml
  "plant-based": 0.4, // prosjek biljnih mlijeka ~40 kcal/100ml
};

// Kalorije po sekundi pjene (aproks. ~5ml pjene/s, pjena ima ~50% gustoće mlijeka)
export const FOAM_KCAL_PER_SECOND = {
  regular: 1.5,
  "plant-based": 1.0,
};

// Šećer: 4 kcal po gramu
export const SUGAR_KCAL_PER_GRAM = 4;

// Faktor jacine (primjenjuje se na coffee bazu)
export const STRENGTH_FACTOR = {
  light: 0.85,
  regular: 1.0,
  strong: 1.15,
};
