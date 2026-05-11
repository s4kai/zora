// Wellness utility functions for date handling and state management

export type MoodType = 'good' | 'ok' | 'bad' | null;

export interface MealEntry {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: string;
  items: string[];
}

export interface WellnessEntry {
  date: string; // ISO date string (YYYY-MM-DD)
  hydration: { current: number; goal: number };
  meals: MealEntry[];
  mood: MoodType;
}

// Storage keys
export const STORAGE_KEYS = {
  TODAY: 'zora_wellness_today',
  HISTORY: 'zora_wellness_history',
  SETTINGS: 'zora_settings',
} as const;

/**
 * Get a consistent date key in YYYY-MM-DD format
 */
export function getDateKey(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

/**
 * Create a fresh wellness entry for a given date
 */
export function createEmptyEntry(date: Date = new Date(), hydrationGoal: number = 8): WellnessEntry {
  return {
    date: getDateKey(date),
    hydration: { current: 0, goal: hydrationGoal },
    meals: [],
    mood: null,
  };
}

/**
 * Get time-based greeting in Portuguese
 */
export function getGreeting(hour: number = new Date().getHours()): string {
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

/**
 * Get the greeting emoji based on time of day
 */
export function getGreetingEmoji(hour: number = new Date().getHours()): string {
  if (hour < 12) return '☀️';
  if (hour < 18) return '🌤️';
  return '🌙';
}

/**
 * Format a date as a short day label (e.g., "Seg", "Ter")
 */
export function getDayLabel(dateString: string): string {
  const date = new Date(dateString + 'T12:00:00'); // Add time to avoid timezone issues
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  return days[date.getDay()];
}

/**
 * Format a date as day number (e.g., "15")
 */
export function getDayNumber(dateString: string): string {
  const date = new Date(dateString + 'T12:00:00');
  return date.getDate().toString();
}

/**
 * Check if a date string is today
 */
export function isToday(dateString: string): boolean {
  return dateString === getDateKey();
}

/**
 * Get the past N days as date strings (excluding today)
 */
export function getPastDays(count: number): string[] {
  const days: string[] = [];
  const today = new Date();
  
  for (let i = 1; i <= count; i++) {
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - i);
    days.push(getDateKey(pastDate));
  }
  
  return days;
}

/**
 * Calculate hydration percentage
 */
export function getHydrationPercentage(current: number, goal: number): number {
  if (goal === 0) return 0;
  return Math.min(Math.round((current / goal) * 100), 100);
}

/**
 * Get meal type label in Portuguese
 */
export function getMealTypeLabel(type: MealEntry['type']): string {
  const labels: Record<MealEntry['type'], string> = {
    breakfast: 'Café da manhã',
    lunch: 'Almoço',
    dinner: 'Jantar',
    snack: 'Lanche',
  };
  return labels[type];
}

/**
 * Format time string for display (e.g., "12:30")
 */
export function formatTime(date: Date = new Date()): string {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Load data from localStorage with fallback
 */
export function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return fallback;
    return JSON.parse(stored) as T;
  } catch {
    return fallback;
  }
}

/**
 * Save data to localStorage
 */
export function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    console.warn('Failed to save to localStorage:', key);
  }
}

/**
 * Trim history to keep only the most recent N entries
 */
export function trimHistory(history: WellnessEntry[], maxEntries: number = 7): WellnessEntry[] {
  // Sort by date descending and keep only maxEntries
  return [...history]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, maxEntries);
}

/**
 * Calculate weekly stats from history
 */
export function calculateWeeklyStats(history: WellnessEntry[]): {
  avgHydration: number;
  totalMeals: number;
  moodBreakdown: { good: number; ok: number; bad: number };
  daysTracked: number;
} {
  if (history.length === 0) {
    return {
      avgHydration: 0,
      totalMeals: 0,
      moodBreakdown: { good: 0, ok: 0, bad: 0 },
      daysTracked: 0,
    };
  }

  let totalHydration = 0;
  let totalMeals = 0;
  const moodBreakdown = { good: 0, ok: 0, bad: 0 };

  for (const entry of history) {
    totalHydration += entry.hydration.current;
    totalMeals += entry.meals.length;
    if (entry.mood && entry.mood in moodBreakdown) {
      moodBreakdown[entry.mood]++;
    }
  }

  return {
    avgHydration: Math.round(totalHydration / history.length),
    totalMeals,
    moodBreakdown,
    daysTracked: history.length,
  };
}
