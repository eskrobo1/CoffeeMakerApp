export type UserType = 'guest' | 'registered' | 'admin';

export interface Order {
  id: string;
  drinkName: string;
  timestamp: Date;
  size: string;
  strength?: string;
  milkType?: string;
  customizations: string[];
}

export interface DrinkSettings {
  strength: number;
  milk: number;
  milkType: 'regular' | 'plant-based';
  sugar: number;
  size: 'small' | 'medium' | 'large';
  foam: number;
}

export interface Drink {
  id: string;
  name: string;
  description: string;
  color: string;
}