// hooks/useDrinks.ts
import { useState, useEffect } from "react";
import { useDatabase } from "./useDatabase";

export interface Drink {
  id: string;
  name: string;
  description: string;
  category: string;
  is_active: number;
  image_path: string | null;
  created_at: string;
}

export interface DrinkRecipe {
  id: number;
  drink_id: string;
  size: "small" | "medium" | "large";
  water_ml: number;
  coffee_g: number;
  milk_ml: number;
  milk_foam_seconds: number;
}

export const useDrinks = () => {
  const { db, isReady } = useDatabase();
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Učitaj sve napitke
  const fetchDrinks = async () => {
    if (!db || !isReady) return;

    try {
      setLoading(true);
      const result = await db.getAllAsync<Drink>(
        "SELECT * FROM drinks WHERE is_active = 1 ORDER BY name ASC",
      );
      setDrinks(result);
      setError(null);
    } catch (err) {
      console.error("Error fetching drinks:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  // Učitaj recept za napitak
  const getDrinkRecipe = async (
    drinkId: string,
    size: "small" | "medium" | "large",
  ): Promise<DrinkRecipe | null> => {
    if (!db || !isReady) return null;

    try {
      const result = await db.getFirstAsync<DrinkRecipe>(
        "SELECT * FROM drink_recipes WHERE drink_id = ? AND size = ?",
        [drinkId, size],
      );
      return result || null;
    } catch (err) {
      console.error("Error fetching recipe:", err);
      return null;
    }
  };

  // Učitaj sve recepte za napitak
  const getDrinkRecipes = async (drinkId: string): Promise<DrinkRecipe[]> => {
    if (!db || !isReady) return [];

    try {
      const result = await db.getAllAsync<DrinkRecipe>(
        'SELECT * FROM drink_recipes WHERE drink_id = ? ORDER BY CASE size WHEN "small" THEN 1 WHEN "medium" THEN 2 WHEN "large" THEN 3 END',
        [drinkId],
      );
      return result;
    } catch (err) {
      console.error("Error fetching recipes:", err);
      return [];
    }
  };

  // Učitaj napitak po ID-u
  const getDrinkById = async (drinkId: string): Promise<Drink | null> => {
    if (!db || !isReady) return null;

    try {
      const result = await db.getFirstAsync<Drink>(
        "SELECT * FROM drinks WHERE id = ?",
        [drinkId],
      );
      return result || null;
    } catch (err) {
      console.error("Error fetching drink:", err);
      return null;
    }
  };

  // Učitaj napitke po kategoriji
  const getDrinksByCategory = async (category: string): Promise<Drink[]> => {
    if (!db || !isReady) return [];

    try {
      const result = await db.getAllAsync<Drink>(
        "SELECT * FROM drinks WHERE category = ? AND is_active = 1 ORDER BY name ASC",
        [category],
      );
      return result;
    } catch (err) {
      console.error("Error fetching drinks by category:", err);
      return [];
    }
  };

  useEffect(() => {
    if (isReady && db) {
      fetchDrinks();
    }
  }, [isReady, db]);

  return {
    drinks,
    loading,
    error,
    fetchDrinks,
    getDrinkRecipe,
    getDrinkRecipes,
    getDrinkById,
    getDrinksByCategory,
  };
};
