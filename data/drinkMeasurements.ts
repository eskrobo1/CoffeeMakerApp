export interface DrinkMeasurement {
  id: string;
  name: string;
  description?: string;
  small: { water: number; milk: number; milkFoam: number; coffee: number };
  medium: { water: number; milk: number; milkFoam: number; coffee: number };
  large: { water: number; milk: number; milkFoam: number; coffee: number };
}

export const drinkMeasurements: DrinkMeasurement[] = [
  {
    id: 'espresso',
    name: 'Espresso',
    description: 'Pure and intense coffee shot.',
    small: { water: 30, milk: 0, milkFoam: 0, coffee: 7 },
    medium: { water: 40, milk: 0, milkFoam: 0, coffee: 9 },
    large: { water: 50, milk: 0, milkFoam: 0, coffee: 11 }
  },
  {
    id: 'ristretto',
    name: 'Ristretto',
    description: 'Concentrated espresso with less water.',
    small: { water: 20, milk: 0, milkFoam: 0, coffee: 7 },
    medium: { water: 25, milk: 0, milkFoam: 0, coffee: 9 },
    large: { water: 30, milk: 0, milkFoam: 0, coffee: 11 }
  },
  {
    id: 'espresso-doppio',
    name: 'Espresso doppio',
    description: 'Double shot of espresso.',
    small: { water: 60, milk: 0, milkFoam: 0, coffee: 14 },
    medium: { water: 80, milk: 0, milkFoam: 0, coffee: 18 },
    large: { water: 100, milk: 0, milkFoam: 0, coffee: 22 }
  },
  {
    id: 'lungo-barista',
    name: 'Lungo Barista',
    description: 'Long espresso with more water.',
    small: { water: 90, milk: 0, milkFoam: 0, coffee: 7 },
    medium: { water: 110, milk: 0, milkFoam: 0, coffee: 9 },
    large: { water: 130, milk: 0, milkFoam: 0, coffee: 11 }
  },
  {
    id: 'americano',
    name: 'Americano',
    description: 'Espresso diluted with hot water.',
    small: { water: 150, milk: 0, milkFoam: 0, coffee: 7 },
    medium: { water: 200, milk: 0, milkFoam: 0, coffee: 9 },
    large: { water: 250, milk: 0, milkFoam: 0, coffee: 11 }
  },
  {
    id: 'coffee',
    name: 'Coffee',
    description: 'Classic brewed coffee.',
    small: { water: 120, milk: 0, milkFoam: 0, coffee: 8 },
    medium: { water: 180, milk: 0, milkFoam: 0, coffee: 12 },
    large: { water: 240, milk: 0, milkFoam: 0, coffee: 16 }
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    description: 'Espresso with steamed milk and foam.',
    small: { water: 30, milk: 100, milkFoam: 8, coffee: 7 },
    medium: { water: 40, milk: 130, milkFoam: 10, coffee: 9 },
    large: { water: 50, milk: 160, milkFoam: 12, coffee: 11 }
  },
  {
    id: 'caffe-latte',
    name: 'Caffè latte',
    description: 'Espresso mixed with steamed milk.',
    small: { water: 30, milk: 150, milkFoam: 5, coffee: 7 },
    medium: { water: 40, milk: 200, milkFoam: 7, coffee: 9 },
    large: { water: 50, milk: 250, milkFoam: 9, coffee: 11 }
  },
  {
    id: 'latte-macchiato',
    name: 'Latte macchiato',
    description: 'Layered milk with espresso mark.',
    small: { water: 30, milk: 180, milkFoam: 6, coffee: 7 },
    medium: { water: 40, milk: 240, milkFoam: 8, coffee: 9 },
    large: { water: 50, milk: 300, milkFoam: 10, coffee: 11 }
  },
  {
    id: 'flat-white',
    name: 'Flat White',
    description: 'Double espresso with microfoam milk.',
    small: { water: 30, milk: 120, milkFoam: 3, coffee: 14 },
    medium: { water: 40, milk: 160, milkFoam: 4, coffee: 18 },
    large: { water: 50, milk: 200, milkFoam: 5, coffee: 22 }
  },
  {
    id: 'cortado',
    name: 'Cortado',
    description: 'Equal parts espresso and milk.',
    small: { water: 30, milk: 30, milkFoam: 2, coffee: 7 },
    medium: { water: 40, milk: 40, milkFoam: 3, coffee: 9 },
    large: { water: 50, milk: 50, milkFoam: 4, coffee: 11 }
  },
  {
    id: 'espresso-macchiato',
    name: 'Espresso macchiato',
    description: 'Espresso marked with foam.',
    small: { water: 30, milk: 15, milkFoam: 4, coffee: 7 },
    medium: { water: 40, milk: 20, milkFoam: 5, coffee: 9 },
    large: { water: 50, milk: 25, milkFoam: 6, coffee: 11 }
  },
  {
    id: 'sweet-latte',
    name: 'Sweet latte',
    description: 'Sweetened latte with sugar.',
    small: { water: 30, milk: 150, milkFoam: 5, coffee: 7 },
    medium: { water: 40, milk: 200, milkFoam: 7, coffee: 9 },
    large: { water: 50, milk: 250, milkFoam: 9, coffee: 11 }
  },
  {
    id: 'cold-brew-coffee',
    name: 'Cold Brew Coffee',
    description: 'Smooth cold-extracted coffee.',
    small: { water: 150, milk: 0, milkFoam: 0, coffee: 20 },
    medium: { water: 200, milk: 0, milkFoam: 0, coffee: 25 },
    large: { water: 250, milk: 0, milkFoam: 0, coffee: 30 }
  },
  {
    id: 'hot-water',
    name: 'Hot water',
    description: 'Pure hot water.',
    small: { water: 150, milk: 0, milkFoam: 0, coffee: 0 },
    medium: { water: 200, milk: 0, milkFoam: 0, coffee: 0 },
    large: { water: 250, milk: 0, milkFoam: 0, coffee: 0 }
  },
  {
    id: 'hot-water-green-tea',
    name: 'Hot water green tea',
    description: 'Hot water for green tea.',
    small: { water: 150, milk: 0, milkFoam: 0, coffee: 0 },
    medium: { water: 200, milk: 0, milkFoam: 0, coffee: 0 },
    large: { water: 250, milk: 0, milkFoam: 0, coffee: 0 }
  },
  {
    id: 'portion-of-milk',
    name: 'Portion of milk',
    description: 'Steamed milk portion.',
    small: { water: 0, milk: 100, milkFoam: 0, coffee: 0 },
    medium: { water: 0, milk: 150, milkFoam: 0, coffee: 0 },
    large: { water: 0, milk: 200, milkFoam: 0, coffee: 0 }
  },
  {
    id: 'portion-of-milk-foam',
    name: 'Portion of milk foam',
    description: 'Frothed milk foam.',
    small: { water: 0, milk: 80, milkFoam: 10, coffee: 0 },
    medium: { water: 0, milk: 120, milkFoam: 12, coffee: 0 },
    large: { water: 0, milk: 160, milkFoam: 15, coffee: 0 }
  },
  {
    id: 'latte',
    name: 'Latte',
    description: 'Espresso mixed with steamed milk.',
    small: { water: 30, milk: 150, milkFoam: 5, coffee: 7 },
    medium: { water: 40, milk: 200, milkFoam: 7, coffee: 9 },
    large: { water: 50, milk: 250, milkFoam: 9, coffee: 11 }
  }
];
