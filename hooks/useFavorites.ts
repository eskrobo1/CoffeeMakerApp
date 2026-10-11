// hooks/useFavorites.ts
import { useState, useEffect } from "react";
import { useDatabase } from "./useDatabase";

export interface FavoriteConfig {
  id: number;
  user_id: string;
  drink_id: string;
  name: string;
  size: string;
  strength: string;
  milk_type: string;
  milk_amount_percent: number;
  foam_level_percent: number;
  sugar_g: number;
  created_at: string;
}

export interface AddFavoriteParams {
  drinkId: string;
  name: string;
  size: string;
  strength: string;
  milkType: string;
  milkAmountPercent: number;
  foamLevelPercent: number;
  sugarG: number;
}

export const useFavorites = (userId?: string) => {
  const { db, isReady } = useDatabase();
  const [favoriteConfigs, setFavoriteConfigs] = useState<FavoriteConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFavorites = async (uid: string) => {
    if (!db || !isReady) return;
    try {
      setLoading(true);
      const result = await db.getAllAsync<FavoriteConfig>(
        `SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC`,
        [uid],
      );
      setFavoriteConfigs(result);
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching favorites:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  // Pronađi tačno podudaranje konfiguracije
  // Slider vrijednosti zaokružujemo na cijeli broj za poređenje
  const findExactMatch = (
    drinkId: string,
    config: {
      size: string;
      strength: string;
      milkType: string;
      milkAmountPercent: number;
      foamLevelPercent: number;
      sugarG: number;
    },
  ): FavoriteConfig | null => {
    return (
      favoriteConfigs.find(
        (fav) =>
          fav.drink_id === drinkId &&
          fav.size === config.size &&
          fav.strength === config.strength &&
          fav.milk_type === config.milkType &&
          Math.round(fav.milk_amount_percent) ===
            Math.round(config.milkAmountPercent) &&
          Math.round(fav.foam_level_percent) ===
            Math.round(config.foamLevelPercent) &&
          fav.sugar_g === Math.round(config.sugarG),
      ) || null
    );
  };

  // Dodaj novi favorite sa punom konfiguracijom
  const addFavorite = async (
    params: AddFavoriteParams,
  ): Promise<number | null> => {
    if (!db || !isReady || !userId) return null;
    try {
      const result = await db.runAsync(
        `INSERT INTO favorites
          (user_id, drink_id, name, size, strength, milk_type,
           milk_amount_percent, foam_level_percent, sugar_g, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
        [
          userId,
          params.drinkId,
          params.name,
          params.size,
          params.strength,
          params.milkType,
          Math.round(params.milkAmountPercent),
          Math.round(params.foamLevelPercent),
          Math.round(params.sugarG),
        ],
      );
      console.log("✅ Favorite added:", params.name);
      await fetchFavorites(userId);
      return result.lastInsertRowId;
    } catch (err) {
      console.error("❌ Error adding favorite:", err);
      setError(err as Error);
      return null;
    }
  };

  // Ukloni favorite po ID-u
  const removeFavorite = async (favoriteId: number): Promise<boolean> => {
    if (!db || !isReady || !userId) return false;
    try {
      await db.runAsync(`DELETE FROM favorites WHERE id = ? AND user_id = ?`, [
        favoriteId,
        userId,
      ]);
      console.log("✅ Favorite removed:", favoriteId);
      await fetchFavorites(userId);
      return true;
    } catch (err) {
      console.error("❌ Error removing favorite:", err);
      setError(err as Error);
      return false;
    }
  };

  // Jednostavna lista drink_id-jeva za backward compatibility
  const favoriteDrinkIds = favoriteConfigs.map((f) => f.drink_id);

  useEffect(() => {
    if (isReady && db && userId) fetchFavorites(userId);
  }, [isReady, db, userId]);

  return {
    favoriteConfigs,
    favoriteDrinkIds,
    loading,
    error,
    fetchFavorites,
    addFavorite,
    removeFavorite,
    findExactMatch,
  };
};
