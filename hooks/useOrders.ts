// hooks/useOrders.ts
import { useState, useEffect } from "react";
import { useDatabase } from "./useDatabase";
import * as Crypto from "expo-crypto";

export interface OrderData {
  drinkId: string;
  drinkName: string;
  userId?: string;
  size: string;
  strength: string;
  milkType?: string;
  temperature?: number;
  sugarG?: number;
  milkAmountPercent?: number;
  foamLevelPercent?: number;
}

export interface Order {
  id: string;
  user_id: string | null;
  drink_id: string;
  drink_name: string;
  size: string;
  strength: string;
  milk_type: string | null;
  temperature: number;
  sugar_g: number;
  milk_amount_percent: number;
  foam_level_percent: number;
  status: "pending" | "brewing" | "completed" | "failed" | "cancelled";
  created_at: string;
  completed_at: string | null;
}

const MAX_ORDERS_PER_USER = 3;

export const useOrders = (userId?: string) => {
  const { db, isReady } = useDatabase();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Kreiraj novu narudžbinu
  const createOrder = async (orderData: OrderData): Promise<string | null> => {
    if (!db || !isReady) return null;

    try {
      const orderId = Crypto.randomUUID();
      await db.runAsync(
        `INSERT INTO orders (
          id, user_id, drink_id, drink_name, size, strength,
          milk_type, temperature, sugar_g, milk_amount_percent,
          foam_level_percent, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
        [
          orderId,
          orderData.userId || null,
          orderData.drinkId,
          orderData.drinkName,
          orderData.size,
          orderData.strength,
          orderData.milkType || null,
          orderData.temperature || 92,
          orderData.sugarG || 0,
          orderData.milkAmountPercent || 100,
          orderData.foamLevelPercent || 100,
          "pending",
        ],
      );
      console.log("✅ Order created:", orderId);
      if (userId) await fetchOrderHistory(userId);
      return orderId;
    } catch (err) {
      console.error("❌ Error creating order:", err);
      setError(err as Error);
      return null;
    }
  };

  // Ažuriraj status
  const updateOrderStatus = async (
    orderId: string,
    status: "pending" | "brewing" | "completed" | "failed" | "cancelled",
  ): Promise<boolean> => {
    if (!db || !isReady) return false;
    try {
      if (status === "completed") {
        await db.runAsync(
          `UPDATE orders SET status = ?, completed_at = datetime('now') WHERE id = ?`,
          [status, orderId],
        );
      } else {
        await db.runAsync(`UPDATE orders SET status = ? WHERE id = ?`, [
          status,
          orderId,
        ]);
      }
      if (userId) await fetchOrderHistory(userId);
      return true;
    } catch (err) {
      console.error("❌ Error updating order status:", err);
      return false;
    }
  };

  // NOVO: Otkaži narudžbinu (ostaje u historiji kao 'cancelled')
  const cancelOrder = async (orderId: string): Promise<boolean> => {
    if (!db || !isReady) return false;
    try {
      await db.runAsync(
        `UPDATE orders SET status = 'cancelled', completed_at = datetime('now') WHERE id = ? AND status = 'pending'`,
        [orderId],
      );
      console.log("✅ Order cancelled:", orderId);
      if (userId) await fetchOrderHistory(userId);
      return true;
    } catch (err) {
      console.error("❌ Error cancelling order:", err);
      return false;
    }
  };

  // NOVO: Dohvati aktivne narudžbine za korisnika (pending + brewing)
  const getUserActiveOrders = async (uid: string): Promise<Order[]> => {
    if (!db || !isReady) return [];
    try {
      const result = await db.getAllAsync<Order>(
        `SELECT * FROM orders
         WHERE user_id = ? AND status IN ('pending', 'brewing')
         ORDER BY created_at ASC
         LIMIT ?`,
        [uid, MAX_ORDERS_PER_USER],
      );
      return result;
    } catch (err) {
      console.error("❌ Error fetching active orders:", err);
      return [];
    }
  };

  // Historija narudžbina
  const fetchOrderHistory = async (uid: string) => {
    if (!db || !isReady) return;
    try {
      setLoading(true);
      const result = await db.getAllAsync<Order>(
        `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`,
        [uid],
      );
      setOrders(result);
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching order history:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllOrders = async (limit = 100) => {
    if (!db || !isReady) return;
    try {
      setLoading(true);
      const result = await db.getAllAsync<Order>(
        `SELECT * FROM orders ORDER BY created_at DESC LIMIT ?`,
        [limit],
      );
      setOrders(result);
    } catch (err) {
      console.error("❌ Error fetching all orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const getOrderById = async (orderId: string): Promise<Order | null> => {
    if (!db || !isReady) return null;
    try {
      const result = await db.getFirstAsync<Order>(
        "SELECT * FROM orders WHERE id = ?",
        [orderId],
      );
      return result || null;
    } catch (err) {
      return null;
    }
  };

  useEffect(() => {
    if (isReady && db && userId) fetchOrderHistory(userId);
  }, [isReady, db, userId]);

  return {
    orders,
    loading,
    error,
    maxOrdersPerUser: MAX_ORDERS_PER_USER,
    createOrder,
    updateOrderStatus,
    cancelOrder,
    getUserActiveOrders,
    fetchOrderHistory,
    fetchAllOrders,
    getOrderById,
  };
};
