// hooks/useQueue.ts
import { useState, useEffect, useRef, useCallback } from "react";
import { useDatabase } from "./useDatabase";
import { Order } from "./useOrders";

export const useQueue = () => {
  const { db, isReady } = useDatabase();
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const isFetchingRef = useRef(false);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── dbRef fix — isti pattern kao u MachineContext ─────────────────────────
  // Sprječava NullPointerException koji nastaje kada setInterval
  // drži stalu referencu na db iz starog closure-a
  const dbRef = useRef(db);
  const isReadyRef = useRef(isReady);
  useEffect(() => {
    dbRef.current = db;
  }, [db]);
  useEffect(() => {
    isReadyRef.current = isReady;
  }, [isReady]);
  // ─────────────────────────────────────────────────────────────────────────

  const fetchActiveOrders = useCallback(async () => {
    // Uvijek čitamo dbRef.current, nikad stali closure db
    if (!dbRef.current || !isReadyRef.current) return;
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    try {
      const result = await dbRef.current.getAllAsync<Order>(
        `SELECT * FROM orders
         WHERE status IN ('pending', 'brewing')
         ORDER BY created_at ASC`,
      );
      setActiveOrders(result);
    } catch (err: any) {
      // Tiho preskačemo NullPointerException (reset/reinit baze)
      if (
        !err?.message?.includes("NullPointerException") &&
        !err?.message?.includes("prepareAsync") &&
        !err?.message?.includes("finalizeAsync")
      ) {
        console.error("❌ Error fetching active orders:", err);
      }
    } finally {
      isFetchingRef.current = false;
    }
  }, []); // Bez zavisnosti — čita kroz ref-ove

  const getQueuePosition = useCallback(
    (orderId: string): number => {
      const index = activeOrders.findIndex((o) => o.id === orderId);
      return index >= 0 ? index + 1 : 1;
    },
    [activeOrders],
  );

  const getTotalInQueue = useCallback(
    (): number => activeOrders.length,
    [activeOrders],
  );

  const isFirstInQueue = useCallback(
    (orderId: string): boolean => {
      if (activeOrders.length === 0) return false;
      return activeOrders[0].id === orderId;
    },
    [activeOrders],
  );

  const getFirstInQueue = useCallback(
    (): Order | null => (activeOrders.length > 0 ? activeOrders[0] : null),
    [activeOrders],
  );

  useEffect(() => {
    if (!isReady || !db) return;

    // Inicijalni fetch
    fetchActiveOrders();

    // Polling — poziva kroz ref da izbjegne stale closure
    pollIntervalRef.current = setInterval(() => {
      fetchActiveOrders();
    }, 5000);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [isReady, db, fetchActiveOrders]);

  return {
    activeOrders,
    fetchActiveOrders,
    getQueuePosition,
    getTotalInQueue,
    isFirstInQueue,
    getFirstInQueue,
  };
};
