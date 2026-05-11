import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import {
  createEmptyEntry,
  getDateKey,
  loadFromStorage,
  saveToStorage,
  STORAGE_KEYS,
  trimHistory,
  type MealEntry,
  type MoodType,
  type WellnessEntry,
} from "@/lib/wellness-utils";

// UI Types
type ZoraMode = "facade" | "secure" | "alert";
type FacadeTab = "home" | "calendar" | "habits" | "profile";

// State Interface
interface ZoraState {
  // UI State
  mode: ZoraMode;
  facadeTab: FacadeTab;
  userName: string;

  // Wellness Data
  today: WellnessEntry;
  history: WellnessEntry[];
  hydrationGoal: number;

  // Hydration flag
  isHydrated: boolean;
}

// Action Types
type ZoraAction =
  | { type: "SET_MODE"; payload: ZoraMode }
  | { type: "SET_FACADE_TAB"; payload: FacadeTab }
  | { type: "ADD_HYDRATION"; payload?: number }
  | { type: "LOG_MEAL"; payload: MealEntry }
  | { type: "SET_MOOD"; payload: MoodType }
  | { type: "INITIALIZE_DAY" }
  | { type: "HYDRATE_FROM_STORAGE"; payload: Partial<ZoraState> };

// Initial State
const createInitialState = (): ZoraState => ({
  mode: "facade",
  facadeTab: "home",
  userName: "Maria",
  today: createEmptyEntry(new Date(), 8),
  history: [],
  hydrationGoal: 8,
  isHydrated: false,
});

// Reducer
function zoraReducer(state: ZoraState, action: ZoraAction): ZoraState {
  switch (action.type) {
    case "SET_MODE":
      return { ...state, mode: action.payload };

    case "SET_FACADE_TAB":
      return { ...state, facadeTab: action.payload };

    case "ADD_HYDRATION": {
      const amount = action.payload ?? 1;
      const newCurrent = Math.min(
        state.today.hydration.current + amount,
        state.today.hydration.goal * 2 // Cap at 2x goal
      );
      return {
        ...state,
        today: {
          ...state.today,
          hydration: {
            ...state.today.hydration,
            current: newCurrent,
          },
        },
      };
    }

    case "LOG_MEAL": {
      return {
        ...state,
        today: {
          ...state.today,
          meals: [...state.today.meals, action.payload],
        },
      };
    }

    case "SET_MOOD": {
      return {
        ...state,
        today: {
          ...state.today,
          mood: action.payload,
        },
      };
    }

    case "INITIALIZE_DAY": {
      const todayKey = getDateKey();

      // If today's entry already matches, no change needed
      if (state.today.date === todayKey) {
        return state;
      }

      // Archive today's entry to history (if it has any data)
      const hasData =
        state.today.hydration.current > 0 ||
        state.today.meals.length > 0 ||
        state.today.mood !== null;

      const newHistory = hasData
        ? trimHistory([state.today, ...state.history], 7)
        : state.history;

      // Create fresh entry for actual today
      const newToday = createEmptyEntry(new Date(), state.hydrationGoal);

      return {
        ...state,
        today: newToday,
        history: newHistory,
      };
    }

    case "HYDRATE_FROM_STORAGE": {
      return {
        ...state,
        ...action.payload,
        isHydrated: true,
      };
    }

    default:
      return state;
  }
}

// Context Type
interface ZoraContextType {
  // UI State
  mode: ZoraMode;
  facadeTab: FacadeTab;
  setFacadeTab: (tab: FacadeTab) => void;
  enterSecureMode: () => void;
  exitSecureMode: () => void;
  triggerAlert: () => void;
  cancelAlert: () => void;
  userName: string;

  // Wellness Data
  today: WellnessEntry;
  history: WellnessEntry[];
  hydrationGoal: number;
  isHydrated: boolean;

  // Wellness Actions
  addHydration: (amount?: number) => void;
  logMeal: (meal: MealEntry) => void;
  setMood: (mood: MoodType) => void;
}

const ZoraContext = createContext<ZoraContextType | null>(null);

export const useZora = () => {
  const ctx = useContext(ZoraContext);
  if (!ctx) throw new Error("useZora must be used within ZoraProvider");
  return ctx;
};

export const ZoraProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(zoraReducer, undefined, createInitialState);

  // Load from localStorage on mount
  useEffect(() => {
    const storedToday = loadFromStorage<WellnessEntry | null>(
      STORAGE_KEYS.TODAY,
      null
    );
    const storedHistory = loadFromStorage<WellnessEntry[]>(
      STORAGE_KEYS.HISTORY,
      []
    );
    const storedSettings = loadFromStorage<{ hydrationGoal?: number }>(
      STORAGE_KEYS.SETTINGS,
      {}
    );

    const todayKey = getDateKey();

    // Check if stored today is actually today
    if (storedToday && storedToday.date === todayKey) {
      // Stored data is current, use it
      dispatch({
        type: "HYDRATE_FROM_STORAGE",
        payload: {
          today: storedToday,
          history: trimHistory(storedHistory, 7),
          hydrationGoal: storedSettings.hydrationGoal ?? 8,
        },
      });
    } else if (storedToday && storedToday.date !== todayKey) {
      // Day has changed - archive old today to history
      const hasData =
        storedToday.hydration.current > 0 ||
        storedToday.meals.length > 0 ||
        storedToday.mood !== null;

      const newHistory = hasData
        ? trimHistory([storedToday, ...storedHistory], 7)
        : trimHistory(storedHistory, 7);

      const hydrationGoal = storedSettings.hydrationGoal ?? 8;
      const newToday = createEmptyEntry(new Date(), hydrationGoal);

      dispatch({
        type: "HYDRATE_FROM_STORAGE",
        payload: {
          today: newToday,
          history: newHistory,
          hydrationGoal,
        },
      });
    } else {
      // No stored data, just mark as hydrated
      dispatch({
        type: "HYDRATE_FROM_STORAGE",
        payload: {
          hydrationGoal: storedSettings.hydrationGoal ?? 8,
        },
      });
    }
  }, []);

  // Persist to localStorage on state changes (after hydration)
  useEffect(() => {
    if (!state.isHydrated) return;

    saveToStorage(STORAGE_KEYS.TODAY, state.today);
    saveToStorage(STORAGE_KEYS.HISTORY, state.history);
    saveToStorage(STORAGE_KEYS.SETTINGS, {
      hydrationGoal: state.hydrationGoal,
    });
  }, [state.today, state.history, state.hydrationGoal, state.isHydrated]);

  // UI Actions
  const enterSecureMode = useCallback(
    () => dispatch({ type: "SET_MODE", payload: "secure" }),
    []
  );

  const exitSecureMode = useCallback(() => {
    dispatch({ type: "SET_MODE", payload: "facade" });
    dispatch({ type: "SET_FACADE_TAB", payload: "home" });
  }, []);

  const triggerAlert = useCallback(
    () => dispatch({ type: "SET_MODE", payload: "alert" }),
    []
  );

  const cancelAlert = useCallback(
    () => dispatch({ type: "SET_MODE", payload: "secure" }),
    []
  );

  const setFacadeTab = useCallback(
    (tab: FacadeTab) => dispatch({ type: "SET_FACADE_TAB", payload: tab }),
    []
  );

  // Wellness Actions
  const addHydration = useCallback(
    (amount?: number) => dispatch({ type: "ADD_HYDRATION", payload: amount }),
    []
  );

  const logMeal = useCallback(
    (meal: MealEntry) => dispatch({ type: "LOG_MEAL", payload: meal }),
    []
  );

  const setMood = useCallback(
    (mood: MoodType) => dispatch({ type: "SET_MOOD", payload: mood }),
    []
  );

  return (
    <ZoraContext.Provider
      value={{
        // UI State
        mode: state.mode,
        facadeTab: state.facadeTab,
        setFacadeTab,
        enterSecureMode,
        exitSecureMode,
        triggerAlert,
        cancelAlert,
        userName: state.userName,

        // Wellness Data
        today: state.today,
        history: state.history,
        hydrationGoal: state.hydrationGoal,
        isHydrated: state.isHydrated,

        // Wellness Actions
        addHydration,
        logMeal,
        setMood,
      }}
    >
      {children}
    </ZoraContext.Provider>
  );
};

// Re-export types for convenience
export type { MealEntry, MoodType, WellnessEntry };
