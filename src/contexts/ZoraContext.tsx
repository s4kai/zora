import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// ============================================
// TYPES
// ============================================

type ZoraMode = "facade" | "secure" | "alert";
type FacadeTab = "home" | "calendar" | "habits" | "profile";
type MoodType = "great" | "good" | "neutral" | "bad" | "terrible";
type MealType = "breakfast" | "lunch" | "snack" | "dinner";
type FrequencyType = "daily" | "weekdays" | "weekends" | "custom";

interface HydrationLog {
  id: string;
  time: string;
  amount: number; // in ml
  timestamp: Date;
}

interface HydrationState {
  current: number;
  goal: number;
  logs: HydrationLog[];
}

interface MoodEntry {
  id: string;
  mood: MoodType;
  factors: string[];
  note: string;
  timestamp: Date;
}

interface MealEntry {
  id: string;
  type: MealType;
  foods: string[];
  note: string;
  timestamp: Date;
}

interface Habit {
  id: string;
  name: string;
  iconIndex: number;
  color: string;
  iconColor: string;
  frequency: FrequencyType;
  selectedDays: number[];
  reminder: boolean;
  reminderTime: string;
  streak: number;
  completedDates: string[]; // ISO date strings
  createdAt: Date;
}

interface HistoryEntry {
  id: string;
  type: "meal" | "hydration" | "mood" | "habit";
  title: string;
  subtitle: string;
  timestamp: Date;
  data: MealEntry | HydrationLog | MoodEntry | { habitId: string };
}

// ============================================
// CONTEXT TYPE
// ============================================

interface ZoraContextType {
  // App State
  mode: ZoraMode;
  facadeTab: FacadeTab;
  setFacadeTab: (tab: FacadeTab) => void;
  enterSecureMode: () => void;
  exitSecureMode: () => void;
  triggerAlert: () => void;
  cancelAlert: () => void;
  userName: string;

  // Hydration State
  hydration: HydrationState;
  addWater: (amount?: number) => void;
  removeWater: () => void;
  setHydrationGoal: (goal: number) => void;
  resetDailyHydration: () => void;

  // Mood State
  todayMood: MoodEntry | null;
  weekMoods: { day: string; mood: MoodType | null; date: string }[];
  saveMood: (mood: MoodType, factors: string[], note: string) => void;

  // Meals State
  meals: MealEntry[];
  lastMeal: MealEntry | null;
  addMeal: (type: MealType, foods: string[], note: string) => void;

  // Habits State
  habits: Habit[];
  addHabit: (habit: Omit<Habit, "id" | "streak" | "completedDates" | "createdAt">) => void;
  toggleHabitCompletion: (habitId: string) => void;
  removeHabit: (habitId: string) => void;
  getHabitCompletionStatus: (habitId: string) => boolean;
  getTodayCompletedHabits: () => number;

  // History State
  history: HistoryEntry[];
  getHistoryByDate: (date: Date) => HistoryEntry[];
  getHistoryByType: (type: HistoryEntry["type"]) => HistoryEntry[];

  // Stats
  getMonthStats: (month: number, year: number) => {
    totalMeals: number;
    totalWaterLiters: number;
    positiveMoodPercentage: number;
    habitsCompleted: number;
  };
}

// ============================================
// HELPERS
// ============================================

const generateId = () => Math.random().toString(36).substring(2, 11);

const getDateKey = (date: Date) => date.toISOString().split("T")[0];

const getTodayKey = () => getDateKey(new Date());

const formatTime = (date: Date) =>
  date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

const getWeekDays = () => {
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const today = new Date();
  const result: { day: string; mood: MoodType | null; date: string }[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    result.push({
      day: days[date.getDay()],
      mood: null,
      date: getDateKey(date),
    });
  }

  return result;
};

// ============================================
// LOCAL STORAGE HELPERS
// ============================================

const STORAGE_KEYS = {
  hydration: "zora_hydration",
  moods: "zora_moods",
  meals: "zora_meals",
  habits: "zora_habits",
  history: "zora_history",
};

const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;
    return JSON.parse(stored, (k, v) => {
      if (k === "timestamp" || k === "createdAt") return new Date(v);
      return v;
    });
  } catch {
    return defaultValue;
  }
};

const saveToStorage = <T,>(key: string, value: T) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage might be full or unavailable
  }
};

// ============================================
// DEFAULT VALUES
// ============================================

const defaultHydration: HydrationState = {
  current: 0,
  goal: 8,
  logs: [],
};

const defaultHabits: Habit[] = [
  {
    id: "water",
    name: "Beber água",
    iconIndex: 0,
    color: "bg-blue-100",
    iconColor: "text-blue-500",
    frequency: "daily",
    selectedDays: [0, 1, 2, 3, 4, 5, 6],
    reminder: false,
    reminderTime: "08:00",
    streak: 7,
    completedDates: [],
    createdAt: new Date(),
  },
  {
    id: "exercise",
    name: "Exercitar",
    iconIndex: 2,
    color: "bg-orange-100",
    iconColor: "text-orange-500",
    frequency: "daily",
    selectedDays: [0, 1, 2, 3, 4, 5, 6],
    reminder: false,
    reminderTime: "07:00",
    streak: 3,
    completedDates: [],
    createdAt: new Date(),
  },
  {
    id: "meditate",
    name: "Meditar",
    iconIndex: 7,
    color: "bg-purple-100",
    iconColor: "text-purple-500",
    frequency: "daily",
    selectedDays: [0, 1, 2, 3, 4, 5, 6],
    reminder: false,
    reminderTime: "06:00",
    streak: 12,
    completedDates: [],
    createdAt: new Date(),
  },
  {
    id: "read",
    name: "Ler 20 minutos",
    iconIndex: 6,
    color: "bg-green-100",
    iconColor: "text-green-600",
    frequency: "daily",
    selectedDays: [0, 1, 2, 3, 4, 5, 6],
    reminder: false,
    reminderTime: "21:00",
    streak: 5,
    completedDates: [],
    createdAt: new Date(),
  },
  {
    id: "sleep",
    name: "Dormir cedo",
    iconIndex: 3,
    color: "bg-indigo-100",
    iconColor: "text-indigo-500",
    frequency: "daily",
    selectedDays: [0, 1, 2, 3, 4, 5, 6],
    reminder: false,
    reminderTime: "22:00",
    streak: 2,
    completedDates: [],
    createdAt: new Date(),
  },
];

// ============================================
// CONTEXT
// ============================================

const ZoraContext = createContext<ZoraContextType | null>(null);

export const useZora = () => {
  const ctx = useContext(ZoraContext);
  if (!ctx) throw new Error("useZora must be used within ZoraProvider");
  return ctx;
};

export const ZoraProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // App State
  const [mode, setMode] = useState<ZoraMode>("facade");
  const [facadeTab, setFacadeTab] = useState<FacadeTab>("home");

  // Hydration State
  const [hydration, setHydration] = useState<HydrationState>(() =>
    loadFromStorage(STORAGE_KEYS.hydration, defaultHydration)
  );

  // Mood State
  const [moods, setMoods] = useState<MoodEntry[]>(() =>
    loadFromStorage(STORAGE_KEYS.moods, [])
  );

  // Meals State
  const [meals, setMeals] = useState<MealEntry[]>(() =>
    loadFromStorage(STORAGE_KEYS.meals, [])
  );

  // Habits State
  const [habits, setHabits] = useState<Habit[]>(() =>
    loadFromStorage(STORAGE_KEYS.habits, defaultHabits)
  );

  // History State
  const [history, setHistory] = useState<HistoryEntry[]>(() =>
    loadFromStorage(STORAGE_KEYS.history, [])
  );

  // ============================================
  // PERSIST TO STORAGE
  // ============================================

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.hydration, hydration);
  }, [hydration]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.moods, moods);
  }, [moods]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.meals, meals);
  }, [meals]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.habits, habits);
  }, [habits]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.history, history);
  }, [history]);

  // ============================================
  // APP ACTIONS
  // ============================================

  const enterSecureMode = useCallback(() => setMode("secure"), []);
  const exitSecureMode = useCallback(() => {
    setMode("facade");
    setFacadeTab("home");
  }, []);
  const triggerAlert = useCallback(() => setMode("alert"), []);
  const cancelAlert = useCallback(() => setMode("secure"), []);

  // ============================================
  // HYDRATION ACTIONS
  // ============================================

  const addHistoryEntry = useCallback(
    (entry: Omit<HistoryEntry, "id">) => {
      setHistory((prev) => [{ ...entry, id: generateId() }, ...prev]);
    },
    []
  );

  const addWater = useCallback((amount = 250) => {
    const now = new Date();
    const log: HydrationLog = {
      id: generateId(),
      time: formatTime(now),
      amount,
      timestamp: now,
    };

    setHydration((prev) => ({
      ...prev,
      current: Math.min(prev.current + 1, 20),
      logs: [...prev.logs, log],
    }));

    addHistoryEntry({
      type: "hydration",
      title: "Hidratação",
      subtitle: `+${amount}ml`,
      timestamp: now,
      data: log,
    });
  }, [addHistoryEntry]);

  const removeWater = useCallback(() => {
    setHydration((prev) => ({
      ...prev,
      current: Math.max(prev.current - 1, 0),
    }));
  }, []);

  const setHydrationGoal = useCallback((goal: number) => {
    setHydration((prev) => ({ ...prev, goal }));
  }, []);

  const resetDailyHydration = useCallback(() => {
    setHydration((prev) => ({ ...prev, current: 0, logs: [] }));
  }, []);

  // ============================================
  // MOOD ACTIONS
  // ============================================

  const todayMood = moods.find(
    (m) => getDateKey(new Date(m.timestamp)) === getTodayKey()
  ) || null;

  const weekMoods = getWeekDays().map((day) => {
    const moodEntry = moods.find(
      (m) => getDateKey(new Date(m.timestamp)) === day.date
    );
    return { ...day, mood: moodEntry?.mood || null };
  });

  const saveMood = useCallback(
    (mood: MoodType, factors: string[], note: string) => {
      const now = new Date();
      const entry: MoodEntry = {
        id: generateId(),
        mood,
        factors,
        note,
        timestamp: now,
      };

      setMoods((prev) => {
        // Replace today's mood if it exists
        const todayKey = getTodayKey();
        const filtered = prev.filter(
          (m) => getDateKey(new Date(m.timestamp)) !== todayKey
        );
        return [...filtered, entry];
      });

      const moodLabels: Record<MoodType, string> = {
        great: "Ótimo",
        good: "Bem",
        neutral: "Normal",
        bad: "Mal",
        terrible: "Péssimo",
      };

      addHistoryEntry({
        type: "mood",
        title: "Humor",
        subtitle: `${moodLabels[mood]} - ${factors.join(", ") || "Sem fatores"}`,
        timestamp: now,
        data: entry,
      });
    },
    [addHistoryEntry]
  );

  // ============================================
  // MEALS ACTIONS
  // ============================================

  const lastMeal = meals.length > 0 ? meals[meals.length - 1] : null;

  const addMeal = useCallback(
    (type: MealType, foods: string[], note: string) => {
      const now = new Date();
      const entry: MealEntry = {
        id: generateId(),
        type,
        foods,
        note,
        timestamp: now,
      };

      setMeals((prev) => [...prev, entry]);

      const mealLabels: Record<MealType, string> = {
        breakfast: "Café da manhã",
        lunch: "Almoço",
        snack: "Lanche",
        dinner: "Jantar",
      };

      const foodLabels: Record<string, string> = {
        vegetables: "Vegetais",
        fruits: "Frutas",
        protein: "Proteína",
        carbs: "Carboidratos",
        drinks: "Bebidas",
      };

      addHistoryEntry({
        type: "meal",
        title: mealLabels[type],
        subtitle: foods.map((f) => foodLabels[f] || f).join(", "),
        timestamp: now,
        data: entry,
      });
    },
    [addHistoryEntry]
  );

  // ============================================
  // HABITS ACTIONS
  // ============================================

  const addHabit = useCallback(
    (habit: Omit<Habit, "id" | "streak" | "completedDates" | "createdAt">) => {
      const newHabit: Habit = {
        ...habit,
        id: generateId(),
        streak: 0,
        completedDates: [],
        createdAt: new Date(),
      };
      setHabits((prev) => [...prev, newHabit]);
    },
    []
  );

  const getHabitCompletionStatus = useCallback(
    (habitId: string) => {
      const habit = habits.find((h) => h.id === habitId);
      if (!habit) return false;
      return habit.completedDates.includes(getTodayKey());
    },
    [habits]
  );

  const toggleHabitCompletion = useCallback(
    (habitId: string) => {
      const today = getTodayKey();
      const now = new Date();

      setHabits((prev) =>
        prev.map((habit) => {
          if (habit.id !== habitId) return habit;

          const isCompleted = habit.completedDates.includes(today);
          let newCompletedDates: string[];
          let newStreak: number;

          if (isCompleted) {
            // Remove completion
            newCompletedDates = habit.completedDates.filter((d) => d !== today);
            newStreak = Math.max(0, habit.streak - 1);
          } else {
            // Add completion
            newCompletedDates = [...habit.completedDates, today];
            newStreak = habit.streak + 1;

            // Add to history
            addHistoryEntry({
              type: "habit",
              title: habit.name,
              subtitle: "Completo",
              timestamp: now,
              data: { habitId: habit.id },
            });
          }

          return {
            ...habit,
            completedDates: newCompletedDates,
            streak: newStreak,
          };
        })
      );
    },
    [addHistoryEntry]
  );

  const removeHabit = useCallback((habitId: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
  }, []);

  const getTodayCompletedHabits = useCallback(() => {
    const today = getTodayKey();
    return habits.filter((h) => h.completedDates.includes(today)).length;
  }, [habits]);

  // ============================================
  // HISTORY ACTIONS
  // ============================================

  const getHistoryByDate = useCallback(
    (date: Date) => {
      const dateKey = getDateKey(date);
      return history.filter(
        (entry) => getDateKey(new Date(entry.timestamp)) === dateKey
      );
    },
    [history]
  );

  const getHistoryByType = useCallback(
    (type: HistoryEntry["type"]) => {
      return history.filter((entry) => entry.type === type);
    },
    [history]
  );

  // ============================================
  // STATS
  // ============================================

  const getMonthStats = useCallback(
    (month: number, year: number) => {
      const monthHistory = history.filter((entry) => {
        const date = new Date(entry.timestamp);
        return date.getMonth() === month && date.getFullYear() === year;
      });

      const monthMeals = monthHistory.filter((e) => e.type === "meal").length;
      const monthHydration = monthHistory.filter(
        (e) => e.type === "hydration"
      ).length;
      const monthMoods = moods.filter((m) => {
        const date = new Date(m.timestamp);
        return date.getMonth() === month && date.getFullYear() === year;
      });
      const positiveMoods = monthMoods.filter((m) =>
        ["great", "good"].includes(m.mood)
      ).length;
      const monthHabits = monthHistory.filter((e) => e.type === "habit").length;

      return {
        totalMeals: monthMeals,
        totalWaterLiters: Math.round((monthHydration * 250) / 1000),
        positiveMoodPercentage:
          monthMoods.length > 0
            ? Math.round((positiveMoods / monthMoods.length) * 100)
            : 0,
        habitsCompleted: monthHabits,
      };
    },
    [history, moods]
  );

  // ============================================
  // PROVIDER
  // ============================================

  return (
    <ZoraContext.Provider
      value={{
        // App State
        mode,
        facadeTab,
        setFacadeTab,
        enterSecureMode,
        exitSecureMode,
        triggerAlert,
        cancelAlert,
        userName: "Maria",

        // Hydration
        hydration,
        addWater,
        removeWater,
        setHydrationGoal,
        resetDailyHydration,

        // Mood
        todayMood,
        weekMoods,
        saveMood,

        // Meals
        meals,
        lastMeal,
        addMeal,

        // Habits
        habits,
        addHabit,
        toggleHabitCompletion,
        removeHabit,
        getHabitCompletionStatus,
        getTodayCompletedHabits,

        // History
        history,
        getHistoryByDate,
        getHistoryByType,

        // Stats
        getMonthStats,
      }}
    >
      {children}
    </ZoraContext.Provider>
  );
};

// Export types for use in components
export type {
  MoodType,
  MealType,
  Habit,
  HistoryEntry,
  HydrationState,
  FrequencyType,
};
