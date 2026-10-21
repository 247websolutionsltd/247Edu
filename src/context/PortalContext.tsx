import { announcements } from "@/data/announcements";
import { terms, cumulativeGpa, termStats } from "@/data/academics";
import { tests } from "@/data/tests";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./PageContext";

export type Attempt = {
  testId: string;
  /** index of the option picked for each question (-1 = unanswered) */
  answers: number[];
  score: number;
  total: number;
  percent: number;
  passed: boolean;
  durationSec: number;
  ts: number;
};

type Persisted = {
  attempts: Record<string, Attempt>;
  readAnnouncements: string[];
  bookmarks: string[];
  opened: string[];
  alertsOn: boolean;
};

const EMPTY: Persisted = { attempts: {}, readAnnouncements: [], bookmarks: [], opened: [], alertsOn: true };

type PortalContextType = {
  attempts: Record<string, Attempt>;
  saveAttempt: (a: Attempt) => void;
  readAnnouncements: string[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  bookmarks: string[];
  toggleBookmark: (id: string) => void;
  opened: string[];
  markOpened: (id: string) => void;
  alertsOn: boolean;
  setAlertsOn: (v: boolean) => void;
  /** tests not yet attempted */
  pendingTests: number;
  cgpa: number;
  creditUnits: number;
  currentGpa: number;
};

const PortalContext = createContext<PortalContextType | undefined>(undefined);

/**
 * Local, per-student study state: test attempts, read notices, saved materials.
 * Persisted on-device with AsyncStorage (keyed by uid). Swap the load/save calls for
 * Firestore when you have a backend; the rest of the app won't need to change.
 */
export function PortalProvider({ children }: { children: ReactNode }) {
  const { uid } = useAuth();
  const [state, setState] = useState<Persisted>(EMPTY);
  const loaded = useRef(false);

  useEffect(() => {
    loaded.current = false;
    setState(EMPTY);
    if (!uid) return;
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(`portal:${uid}`);
        if (!cancelled && raw) setState({ ...EMPTY, ...(JSON.parse(raw) as Partial<Persisted>) });
      } catch (e) {
        console.error("[portal] couldn't read saved data", e);
      } finally {
        if (!cancelled) loaded.current = true;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [uid]);

  useEffect(() => {
    if (!uid || !loaded.current) return;
    AsyncStorage.setItem(`portal:${uid}`, JSON.stringify(state)).catch((e) => console.error("[portal] couldn't save", e));
  }, [uid, state]);

  const patch = useCallback((fn: (s: Persisted) => Persisted) => {
    // writes made before the first read finishes would be clobbered; mark as loaded on first write
    loaded.current = true;
    setState(fn);
  }, []);

  const saveAttempt = useCallback((a: Attempt) => patch((s) => ({ ...s, attempts: { ...s.attempts, [a.testId]: a } })), [patch]);
  const markRead = useCallback(
    (id: string) => patch((s) => (s.readAnnouncements.includes(id) ? s : { ...s, readAnnouncements: [...s.readAnnouncements, id] })),
    [patch],
  );
  const markAllRead = useCallback(() => patch((s) => ({ ...s, readAnnouncements: announcements.map((a) => a.id) })), [patch]);
  const toggleBookmark = useCallback(
    (id: string) =>
      patch((s) => ({ ...s, bookmarks: s.bookmarks.includes(id) ? s.bookmarks.filter((b) => b !== id) : [...s.bookmarks, id] })),
    [patch],
  );
  const markOpened = useCallback((id: string) => patch((s) => (s.opened.includes(id) ? s : { ...s, opened: [...s.opened, id] })), [patch]);
  const setAlertsOn = useCallback((v: boolean) => patch((s) => ({ ...s, alertsOn: v })), [patch]);

  const value = useMemo<PortalContextType>(() => {
    const cum = cumulativeGpa(terms);
    const current = termStats(terms[terms.length - 1]);
    return {
      attempts: state.attempts,
      saveAttempt,
      readAnnouncements: state.readAnnouncements,
      unreadCount: announcements.filter((a) => !state.readAnnouncements.includes(a.id)).length,
      markRead,
      markAllRead,
      bookmarks: state.bookmarks,
      toggleBookmark,
      opened: state.opened,
      markOpened,
      alertsOn: state.alertsOn,
      setAlertsOn,
      pendingTests: tests.filter((t) => !state.attempts[t.id]).length,
      cgpa: cum.gpa,
      creditUnits: cum.units,
      currentGpa: current.gpa,
    };
  }, [state, saveAttempt, markRead, markAllRead, toggleBookmark, markOpened, setAlertsOn]);

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
}

export function usePortal() {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error("usePortal must be used inside a PortalProvider");
  return ctx;
}
