import { HistoryEntry, useZora } from "@/contexts/ZoraContext";
import { motion } from "framer-motion";
import {
  Apple,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Droplets,
  Dumbbell,
  Frown,
  Heart,
  Meh,
  Moon,
  Salad,
  Smile,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

type TabType = "all" | "meals" | "hydration" | "mood" | "habits";

const tabs = [
  { id: "all" as TabType, label: "Tudo" },
  { id: "meals" as TabType, label: "Refeicoes" },
  { id: "hydration" as TabType, label: "Agua" },
  { id: "mood" as TabType, label: "Humor" },
  { id: "habits" as TabType, label: "Habitos" },
];

const months = [
  "Janeiro",
  "Fevereiro",
  "Marco",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

// Icon mapping for history items
const typeIcons: Record<string, { icon: typeof Droplets; color: string; bg: string }> = {
  hydration: { icon: Droplets, color: "text-blue-500", bg: "bg-blue-100" },
  meal: { icon: Salad, color: "text-green-600", bg: "bg-green-100" },
  mood: { icon: Smile, color: "text-yellow-600", bg: "bg-yellow-100" },
  habit: { icon: Sparkles, color: "text-purple-500", bg: "bg-purple-100" },
};

const HistoryScreen = () => {
  const { history, getMonthStats } = useZora();

  const [activeTab, setActiveTab] = useState<TabType>("all");
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
    setSelectedDay(null);
  };

  // Generate calendar days
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Adjust for Monday start
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  }, [firstDay, daysInMonth]);

  // Get days with activity
  const activityDays = useMemo(() => {
    const daysSet = new Set<number>();
    history.forEach((entry) => {
      const date = new Date(entry.timestamp);
      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        daysSet.add(date.getDate());
      }
    });
    return daysSet;
  }, [history, currentMonth, currentYear]);

  // Group history by date
  const groupedHistory = useMemo(() => {
    const filtered = history.filter((entry) => {
      if (activeTab === "all") return true;
      if (activeTab === "meals") return entry.type === "meal";
      if (activeTab === "hydration") return entry.type === "hydration";
      if (activeTab === "mood") return entry.type === "mood";
      if (activeTab === "habits") return entry.type === "habit";
      return true;
    });

    // Filter by selected day if one is selected
    const dayFiltered = selectedDay
      ? filtered.filter((entry) => {
          const date = new Date(entry.timestamp);
          return (
            date.getDate() === selectedDay &&
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
          );
        })
      : filtered.filter((entry) => {
          const date = new Date(entry.timestamp);
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });

    // Group by date string
    const groups: Record<string, HistoryEntry[]> = {};
    dayFiltered.forEach((entry) => {
      const date = new Date(entry.timestamp);
      const todayStr = new Date().toDateString();
      const yesterdayStr = new Date(Date.now() - 86400000).toDateString();
      const entryDateStr = date.toDateString();

      let label: string;
      if (entryDateStr === todayStr) {
        label = "Hoje";
      } else if (entryDateStr === yesterdayStr) {
        label = "Ontem";
      } else {
        label = date.toLocaleDateString("pt-BR", {
          weekday: "long",
          day: "numeric",
          month: "short",
        });
      }

      if (!groups[label]) {
        groups[label] = [];
      }
      groups[label].push(entry);
    });

    return Object.entries(groups).map(([date, items]) => ({
      date,
      items: items.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
    }));
  }, [history, activeTab, selectedDay, currentMonth, currentYear]);

  const monthStats = getMonthStats(currentMonth, currentYear);
  const isCurrentMonth = currentMonth === today.getMonth() && currentYear === today.getFullYear();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="px-5 pt-6 pb-28 max-w-md mx-auto space-y-5"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-zora-lavender flex items-center justify-center">
          <Calendar size={20} className="text-foreground" />
        </div>
        <h1 className="text-xl font-bold text-foreground">Historico</h1>
      </motion.div>

      {/* Calendar */}
      <motion.div
        variants={item}
        className="bg-card rounded-2xl p-4 shadow-zora"
      >
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
          >
            <ChevronLeft size={18} className="text-foreground" />
          </button>
          <h3 className="text-sm font-bold text-foreground">
            {months[currentMonth]} {currentYear}
          </h3>
          <button
            onClick={nextMonth}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
          >
            <ChevronRight size={18} className="text-foreground" />
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"].map((day) => (
            <div
              key={day}
              className="text-center text-[10px] font-semibold text-muted-foreground py-1"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, idx) => {
            const isToday = day === today.getDate() && isCurrentMonth;
            const hasActivity = day !== null && activityDays.has(day);
            const isSelected = selectedDay === day;

            return (
              <button
                key={idx}
                onClick={() => day && setSelectedDay(day === selectedDay ? null : day)}
                disabled={day === null}
                className={`aspect-square rounded-full flex flex-col items-center justify-center text-xs font-medium transition-all ${
                  day === null
                    ? "invisible"
                    : isSelected
                      ? "bg-primary text-primary-foreground"
                      : isToday
                        ? "bg-primary/20 text-primary"
                        : "text-foreground hover:bg-muted"
                }`}
              >
                {day}
                {hasActivity && !isSelected && (
                  <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={item} className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground hover:bg-muted"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </motion.div>

      {/* History List */}
      <motion.div variants={item} className="space-y-4">
        {groupedHistory.length === 0 ? (
          <div className="bg-card rounded-2xl p-6 shadow-zora text-center">
            <p className="text-sm text-muted-foreground">
              {selectedDay
                ? "Nenhum registro neste dia"
                : "Nenhum registro neste mes"}
            </p>
          </div>
        ) : (
          groupedHistory.map((day, dayIdx) => (
            <div key={dayIdx} className="space-y-2">
              <h3 className="text-sm font-bold text-foreground capitalize">
                {day.date}
              </h3>
              <div className="space-y-2">
                {day.items.map((historyItem, itemIdx) => {
                  const iconConfig = typeIcons[historyItem.type] || typeIcons.habit;
                  const IconComponent = iconConfig.icon;

                  return (
                    <motion.div
                      key={historyItem.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: itemIdx * 0.05 }}
                      className="bg-card rounded-xl p-3 shadow-zora flex items-center gap-3"
                    >
                      <div
                        className={`w-10 h-10 rounded-full ${iconConfig.bg} flex items-center justify-center`}
                      >
                        <IconComponent size={18} className={iconConfig.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">
                          {historyItem.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {historyItem.subtitle}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(historyItem.timestamp).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        variants={item}
        className="bg-zora-mint/40 rounded-2xl p-4 space-y-3"
      >
        <h3 className="text-sm font-bold text-foreground">
          Resumo de {months[currentMonth]}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-primary">{monthStats.totalMeals}</p>
            <p className="text-xs text-muted-foreground">Refeicoes</p>
          </div>
          <div className="bg-card rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-blue-500">
              {monthStats.totalWaterLiters}L
            </p>
            <p className="text-xs text-muted-foreground">Agua</p>
          </div>
          <div className="bg-card rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {monthStats.positiveMoodPercentage}%
            </p>
            <p className="text-xs text-muted-foreground">Humor Positivo</p>
          </div>
          <div className="bg-card rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-purple-500">
              {monthStats.habitsCompleted}
            </p>
            <p className="text-xs text-muted-foreground">Habitos Completos</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HistoryScreen;
