import { useZora, type WellnessEntry } from "@/contexts/ZoraContext";
import {
  calculateWeeklyStats,
  getDayLabel,
  getDayNumber,
  getHydrationPercentage,
  isToday,
  getPastDays,
} from "@/lib/wellness-utils";
import { motion } from "framer-motion";
import { CalendarDays, Droplets, Frown, Meh, Smile, Utensils } from "lucide-react";
import HydrationRing from "./HydrationRing";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const MoodIcon = ({ mood }: { mood: WellnessEntry["mood"] }) => {
  if (mood === "good") return <Smile size={16} className="text-green-500" />;
  if (mood === "ok") return <Meh size={16} className="text-yellow-500" />;
  if (mood === "bad") return <Frown size={16} className="text-red-400" />;
  return <span className="text-muted-foreground text-xs">-</span>;
};

interface DayCardProps {
  entry: WellnessEntry | null;
  dateKey: string;
  isCurrentDay?: boolean;
}

const DayCard = ({ entry, dateKey, isCurrentDay = false }: DayCardProps) => {
  const dayLabel = getDayLabel(dateKey);
  const dayNumber = getDayNumber(dateKey);
  const hydrationPercent = entry
    ? getHydrationPercentage(entry.hydration.current, entry.hydration.goal)
    : 0;

  return (
    <motion.div
      variants={item}
      className={`flex flex-col items-center p-3 rounded-xl min-w-[70px] ${
        isCurrentDay
          ? "bg-primary/10 ring-2 ring-primary/30"
          : "bg-card shadow-sm"
      }`}
    >
      {/* Day label */}
      <span
        className={`text-xs font-medium ${
          isCurrentDay ? "text-primary" : "text-muted-foreground"
        }`}
      >
        {dayLabel}
      </span>
      <span
        className={`text-lg font-bold ${
          isCurrentDay ? "text-primary" : "text-foreground"
        }`}
      >
        {dayNumber}
      </span>

      {/* Mini hydration bar */}
      <div className="w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
        <motion.div
          className="h-full bg-zora-mint-deep rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${hydrationPercent}%` }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
      </div>

      {/* Meal count */}
      <div className="flex items-center gap-1 mt-2">
        <Utensils size={12} className="text-muted-foreground" />
        <span className="text-xs text-muted-foreground">
          {entry?.meals.length ?? 0}
        </span>
      </div>

      {/* Mood */}
      <div className="mt-1">
        <MoodIcon mood={entry?.mood ?? null} />
      </div>
    </motion.div>
  );
};

const CalendarPlaceholder = () => {
  const { today, history, isHydrated } = useZora();

  // Build 7-day view: today + 6 past days
  const pastDays = getPastDays(6);
  const weekStats = calculateWeeklyStats(history);

  // Create a map for quick lookup
  const historyMap = new Map<string, WellnessEntry>();
  for (const entry of history) {
    historyMap.set(entry.date, entry);
  }

  // Show skeleton while loading
  if (!isHydrated) {
    return (
      <div className="px-5 pt-8 pb-28 max-w-md mx-auto space-y-5">
        <div className="w-32 h-6 bg-muted rounded animate-pulse" />
        <div className="flex gap-2 overflow-x-auto pb-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="w-[70px] h-[120px] bg-card rounded-xl animate-pulse flex-shrink-0"
            />
          ))}
        </div>
        <div className="bg-card rounded-2xl p-5 h-40 animate-pulse" />
      </div>
    );
  }

  const hasHistory = history.length > 0;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="px-5 pt-8 pb-28 max-w-md mx-auto space-y-5"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-center gap-2">
        <CalendarDays size={24} className="text-primary" />
        <h1 className="text-xl font-bold text-foreground">Historico</h1>
      </motion.div>

      {/* 7-day scroll */}
      <motion.div variants={item} className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {/* Today */}
        <DayCard entry={today} dateKey={today.date} isCurrentDay />

        {/* Past 6 days */}
        {pastDays.map((dateKey) => (
          <DayCard
            key={dateKey}
            entry={historyMap.get(dateKey) ?? null}
            dateKey={dateKey}
          />
        ))}
      </motion.div>

      {/* Today's summary card */}
      <motion.div
        variants={item}
        className="bg-card rounded-2xl p-5 shadow-zora space-y-4"
      >
        <h3 className="text-sm font-bold text-foreground">Resumo de Hoje</h3>
        <div className="flex items-center justify-around">
          <div className="flex flex-col items-center">
            <HydrationRing
              current={today.hydration.current}
              goal={today.hydration.goal}
              size="sm"
              showLabel={false}
            />
            <span className="text-xs text-muted-foreground mt-1">Agua</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-zora-peach flex items-center justify-center">
              <Utensils size={20} className="text-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">
              {today.meals.length}
            </span>
            <span className="text-xs text-muted-foreground">Refeicoes</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-zora-lavender flex items-center justify-center">
              {today.mood === "good" && <Smile size={20} className="text-green-600" />}
              {today.mood === "ok" && <Meh size={20} className="text-yellow-600" />}
              {today.mood === "bad" && <Frown size={20} className="text-red-500" />}
              {!today.mood && <Meh size={20} className="text-muted-foreground" />}
            </div>
            <span className="text-sm font-semibold text-foreground mt-1">
              {today.mood === "good" && "Bem"}
              {today.mood === "ok" && "Ok"}
              {today.mood === "bad" && "Mal"}
              {!today.mood && "-"}
            </span>
            <span className="text-xs text-muted-foreground">Humor</span>
          </div>
        </div>
      </motion.div>

      {/* Weekly stats */}
      {hasHistory && (
        <motion.div
          variants={item}
          className="bg-zora-mint/30 rounded-2xl p-4 space-y-2"
        >
          <h3 className="text-sm font-bold text-foreground">
            Estatisticas da Semana
          </h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="flex items-center justify-center gap-1">
                <Droplets size={14} className="text-primary" />
                <span className="text-lg font-bold text-foreground">
                  {weekStats.avgHydration}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                Media copos/dia
              </span>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1">
                <Utensils size={14} className="text-primary" />
                <span className="text-lg font-bold text-foreground">
                  {weekStats.totalMeals}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                Total refeicoes
              </span>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1">
                <CalendarDays size={14} className="text-primary" />
                <span className="text-lg font-bold text-foreground">
                  {weekStats.daysTracked}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                Dias rastreados
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Empty state */}
      {!hasHistory && (
        <motion.div
          variants={item}
          className="bg-muted/50 rounded-2xl p-6 flex flex-col items-center gap-2"
        >
          <CalendarDays size={32} className="text-muted-foreground" />
          <p className="text-sm text-muted-foreground text-center">
            Continue registrando seus habitos para ver seu historico aqui.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CalendarPlaceholder;
