// contexts/MachineContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { useDatabase } from "./DatabaseContext";

const BREW_DURATION_SECONDS = 45;
const BREW_TICK_MS = 450;
const POLL_MS = 5000;

interface MachineContextType {
  currentlyBrewingId: string | null;
  waitingForCupId: string | null;
  lastCompletedOrderId: string | null;
  brewProgress: number;
  brewTimeLeft: number;
  placeCup: () => void;
  refreshQueue: () => void;
}

const MachineContext = createContext<MachineContextType>({
  currentlyBrewingId: null,
  waitingForCupId: null,
  lastCompletedOrderId: null,
  brewProgress: 0,
  brewTimeLeft: BREW_DURATION_SECONDS,
  placeCup: () => {},
  refreshQueue: () => {},
});

export const MachineProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { db, isReady } = useDatabase();

  // Sve kroz ref-ove da ne postoji stale closure problem
  const dbRef = useRef(db);
  const isReadyRef = useRef(isReady);
  useEffect(() => {
    dbRef.current = db;
  }, [db]);
  useEffect(() => {
    isReadyRef.current = isReady;
  }, [isReady]);

  const [currentlyBrewingId, setCurrentlyBrewingId] = useState<string | null>(
    null,
  );
  const [waitingForCupId, setWaitingForCupId] = useState<string | null>(null);
  const [lastCompletedOrderId, setLastCompletedOrderId] = useState<
    string | null
  >(null);
  const [brewProgress, setBrewProgress] = useState(0);
  const [brewTimeLeft, setBrewTimeLeft] = useState(BREW_DURATION_SECONDS);

  const brewTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentlyBrewingIdRef = useRef<string | null>(null);
  const waitingForCupIdRef = useRef<string | null>(null);
  const isFetchingRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // runQuery kao ref — ne može biti stale u nijednom callbacku
  const runQueryRef = useRef(async (sql: string, params: any[] = []) => {
    const database = dbRef.current;
    if (!database || !isReadyRef.current) return null;
    try {
      return await database.runAsync(sql, params);
    } catch {
      return null;
    }
  });

  const getFirstQueryRef = useRef(
    async <T = any,>(sql: string, params: any[] = []): Promise<T | null> => {
      const database = dbRef.current;
      if (!database || !isReadyRef.current) return null;
      try {
        return (await database.getFirstAsync<T>(sql, params)) ?? null;
      } catch {
        return null;
      }
    },
  );

  // Ažuriraj ref funkcije svaki render da uvijek vide najnoviji db
  runQueryRef.current = async (sql: string, params: any[] = []) => {
    const database = dbRef.current;
    if (!database || !isReadyRef.current) return null;
    try {
      return await database.runAsync(sql, params);
    } catch {
      return null;
    }
  };

  getFirstQueryRef.current = async <T = any,>(
    sql: string,
    params: any[] = [],
  ): Promise<T | null> => {
    const database = dbRef.current;
    if (!database || !isReadyRef.current) return null;
    try {
      return (await database.getFirstAsync<T>(sql, params)) ?? null;
    } catch {
      return null;
    }
  };

  // Fetch prve pending narudžbine i postavi je kao waiting-for-cup
  const fetchAndProcessQueueRef = useRef(async () => {
    if (!dbRef.current || !isReadyRef.current) return;
    if (isFetchingRef.current) return;
    if (currentlyBrewingIdRef.current) return;

    isFetchingRef.current = true;
    try {
      // Cleanup stale brewing
      await runQueryRef.current(
        `UPDATE orders SET status = 'completed', completed_at = datetime('now')
         WHERE status = 'brewing' AND created_at < datetime('now', '-3 minutes')`,
      );

      // Prva pending
      const firstPending = await getFirstQueryRef.current<{ id: string }>(
        `SELECT id FROM orders WHERE status = 'pending' ORDER BY created_at ASC LIMIT 1`,
      );

      if (!isMountedRef.current) return;

      if (!firstPending) {
        if (waitingForCupIdRef.current) {
          setWaitingForCupId(null);
          waitingForCupIdRef.current = null;
        }
        return;
      }

      if (waitingForCupIdRef.current !== firstPending.id) {
        setWaitingForCupId(firstPending.id);
        waitingForCupIdRef.current = firstPending.id;
      }
    } finally {
      isFetchingRef.current = false;
    }
  });

  // Ažuriraj i ovaj ref svaki render
  fetchAndProcessQueueRef.current = async () => {
    if (!dbRef.current || !isReadyRef.current) return;
    if (isFetchingRef.current) return;
    if (currentlyBrewingIdRef.current) return;

    isFetchingRef.current = true;
    try {
      await runQueryRef.current(
        `UPDATE orders SET status = 'completed', completed_at = datetime('now')
         WHERE status = 'brewing' AND created_at < datetime('now', '-3 minutes')`,
      );

      const firstPending = await getFirstQueryRef.current<{ id: string }>(
        `SELECT id FROM orders WHERE status = 'pending' ORDER BY created_at ASC LIMIT 1`,
      );

      if (!isMountedRef.current) return;

      if (!firstPending) {
        if (waitingForCupIdRef.current) {
          setWaitingForCupId(null);
          waitingForCupIdRef.current = null;
        }
        return;
      }

      if (waitingForCupIdRef.current !== firstPending.id) {
        setWaitingForCupId(firstPending.id);
        waitingForCupIdRef.current = firstPending.id;
      }
    } finally {
      isFetchingRef.current = false;
    }
  };

  // startBrew kao ref — ne može biti stale
  const startBrewTimerRef = useRef((orderId: string) => {
    if (brewTimerRef.current) clearInterval(brewTimerRef.current);
    if (!isMountedRef.current) return;

    setBrewProgress(0);
    setBrewTimeLeft(BREW_DURATION_SECONDS);
    setCurrentlyBrewingId(orderId);
    setWaitingForCupId(null);
    currentlyBrewingIdRef.current = orderId;
    waitingForCupIdRef.current = null;

    // Mali delay da prethodni DB upis (createOrder) završi
    setTimeout(() => {
      runQueryRef.current(`UPDATE orders SET status = 'brewing' WHERE id = ?`, [
        orderId,
      ]);
    }, 200);

    brewTimerRef.current = setInterval(() => {
      if (!isMountedRef.current) return;

      setBrewProgress((prev) => {
        const next = prev + 2;
        if (next >= 100) {
          clearInterval(brewTimerRef.current!);
          brewTimerRef.current = null;

          const oid = currentlyBrewingIdRef.current;
          if (oid) {
            // Mali delay za sigurnost
            setTimeout(async () => {
              await runQueryRef.current(
                `UPDATE orders SET status = 'completed', completed_at = datetime('now') WHERE id = ?`,
                [oid],
              );
              if (!isMountedRef.current) return;
              setLastCompletedOrderId(oid);
              setCurrentlyBrewingId(null);
              currentlyBrewingIdRef.current = null;
              setBrewProgress(0);
              setBrewTimeLeft(BREW_DURATION_SECONDS);
              isFetchingRef.current = false;
              setTimeout(() => fetchAndProcessQueueRef.current(), 600);
            }, 200);
          }
          return 100;
        }
        return next;
      });

      setBrewTimeLeft((prev) => Math.max(0, prev - 1));
    }, BREW_TICK_MS);
  });

  // Exponirani API
  const placeCup = () => {
    const oid = waitingForCupIdRef.current;
    if (oid) startBrewTimerRef.current(oid);
  };

  const refreshQueue = () => {
    isFetchingRef.current = false;
    fetchAndProcessQueueRef.current();
  };

  // Pokretanje pollinga
  useEffect(() => {
    if (!isReady || !db) return;

    const initTimeout = setTimeout(
      () => fetchAndProcessQueueRef.current(),
      800,
    );

    pollIntervalRef.current = setInterval(() => {
      fetchAndProcessQueueRef.current();
    }, POLL_MS);

    return () => {
      clearTimeout(initTimeout);
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (brewTimerRef.current) clearInterval(brewTimerRef.current);
    };
  }, [isReady, db]);

  return (
    <MachineContext.Provider
      value={{
        currentlyBrewingId,
        waitingForCupId,
        lastCompletedOrderId,
        brewProgress,
        brewTimeLeft,
        placeCup,
        refreshQueue,
      }}
    >
      {children}
    </MachineContext.Provider>
  );
};

export const useMachine = () => useContext(MachineContext);
