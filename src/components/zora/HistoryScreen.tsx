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
  Meh,
  Moon,
  Salad,
  Smile,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

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
  { id: "meals" as TabType, label: "Refeições" },
  { id: "hydration" as TabType, label: "Água" },
  { id: "mood" as TabType, label: "Humor" },
  { id: "habits" as TabType, label: "Hábitos" },
];

const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
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

// Mock data for history
const mockHistory = [
  {
    date: "Hoje",
    items: [
      {
        type: "meal",
        time: "12:30",
        title: "Almoço",
        subtitle: "Salada, frango, arroz",
        icon: Salad,
        color: "bg-green-100",
        iconColor: "text-green-600",
      },
      {
        type: "hydration",
        time: "14:00",
        title: "Hidratação",
        subtitle: "6/8 copos",
        icon: Droplets,
        color: "bg-blue-100",
        iconColor: "text-blue-500",
      },
      {
        type: "mood",
        time: "18:00",
        title: "Humor",
        subtitle: "Bem - Exercício, Trabalho",
        icon: Smile,
        color: "bg-yellow-100",
        iconColor: "text-yellow-600",
      },
      {
        type: "habit",
        time: "07:30",
        title: "Meditar",
        subtitle: "10 minutos - Completo",
        icon: Sparkles,
        color: "bg-purple-100",
        iconColor: "text-purple-500",
      },
    ],
  },
  {
    date: "Ontem",
    items: [
      {
        type: "meal",
        time: "08:00",
        title: "Café da manhã",
        subtitle: "Pão, café, fruta",
        icon: Coffee,
        color: "bg-orange-100",
        iconColor: "text-orange-500",
      },
      {
        type: "meal",
        time: "12:45",
        title: "Almoço",
        subtitle: "Macarrão, carne",
        icon: Salad,
        color: "bg-green-100",
        iconColor: "text-green-600",
      },
      {
        type: "hydration",
        time: "20:00",
        title: "Hidratação",
        subtitle: "8/8 copos ✓",
        icon: Droplets,
        color: "bg-blue-100",
        iconColor: "text-blue-500",
      },
      {
        type: "mood",
        time: "21:00",
        title: "Humor",
        subtitle: "Ótimo - Família, Hobby",
        icon: Sparkles,
        color: "bg-yellow-100",
        iconColor: "text-yellow-600",
      },
      {
        type: "habit",
        time: "06:00",
        title: "Exercitar",
        subtitle: "30 minutos - Completo",
        icon: Dumbbell,
        color: "bg-red-100",
        iconColor: "text-red-500",
      },
      {
        type: "habit",
        time: "22:00",
        title: "Dormir cedo",
        subtitle: "Completo",
        icon: Moon,
        color: "bg-indigo-100",
        iconColor: "text-indigo-500",
      },
    ],
  },
  {
    date: "Quarta, 8 Mai",
    items: [
      {
        type: "meal",
        time: "13:00",
        title: "Almoço",
        subtitle: "Sushi, salada",
        icon: Apple,
        color: "bg-green-100",
        iconColor: "text-green-600",
      },
      {
        type: "hydration",
        time: "18:00",
        title: "Hidratação",
        subtitle: "5/8 copos",
        icon: Droplets,
        color: "bg-blue-100",
        iconColor: "text-blue-500",
      },
      {
        type: "mood",
        time: "19:00",
        title: "Humor",
        subtitle: "Normal - Trabalho",
        icon: Meh,
        color: "bg-gray-100",
        iconColor: "text-gray-500",
      },
    ],
  },
  {
    date: "Terça, 7 Mai",
    items: [
      {
        type: "mood",
        time: "20:00",
        title: "Humor",
        subtitle: "Mal - Sono, Saúde",
        icon: Frown,
        color: "bg-orange-100",
        iconColor: "text-orange-500",
      },
      {
        type: "hydration",
        time: "21:00",
        title: "Hidratação",
        subtitle: "4/8 copos",
        icon: Droplets,
        color: "bg-blue-100",
        iconColor: "text-blue-500",
      },
    ],
  },
];

const HistoryScreen = () => {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [currentMonth, setCurrentMonth] = useState(4); // May
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
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

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  // Mock activity data for calendar
  const activityDays = [1, 3, 5, 7, 8, 9, 10, 12, 14, 15, 17, 19, 20, 22, 24];

  const filteredHistory = mockHistory.map((day) => ({
    ...day,
    items:
      activeTab === "all"
        ? day.items
        : day.items.filter((item) => {
            if (activeTab === "meals") return item.type === "meal";
            if (activeTab === "hydration") return item.type === "hydration";
            if (activeTab === "mood") return item.type === "mood";
            if (activeTab === "habits") return item.type === "habit";
            return true;
          }),
  })).filter((day) => day.items.length > 0);

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
        <h1 className="text-xl font-bold text-foreground">Histórico</h1>
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
          {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((day) => (
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
            const isToday = day === 10 && currentMonth === 4 && currentYear === 2026;
            const hasActivity = day !== null && activityDays.includes(day);
            const isSelected = selectedDay === day;

            return (
              <button
                key={idx}
                onClick={() => day && setSelectedDay(day)}
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
        {filteredHistory.map((day, dayIdx) => (
          <div key={dayIdx} className="space-y-2">
            <h3 className="text-sm font-bold text-foreground">{day.date}</h3>
            <div className="space-y-2">
              {day.items.map((historyItem, itemIdx) => (
                <motion.div
                  key={itemIdx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: itemIdx * 0.05 }}
                  className="bg-card rounded-xl p-3 shadow-zora flex items-center gap-3"
                >
                  <div
                    className={`w-10 h-10 rounded-full ${historyItem.color} flex items-center justify-center`}
                  >
                    <historyItem.icon
                      size={18}
                      className={historyItem.iconColor}
                    />
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
                    {historyItem.time}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        variants={item}
        className="bg-zora-mint/40 rounded-2xl p-4 space-y-3"
      >
        <h3 className="text-sm font-bold text-foreground">
          Resumo do Mês
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-primary">24</p>
            <p className="text-xs text-muted-foreground">Refeições</p>
          </div>
          <div className="bg-card rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-blue-500">156L</p>
            <p className="text-xs text-muted-foreground">Água</p>
          </div>
          <div className="bg-card rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-yellow-600">85%</p>
            <p className="text-xs text-muted-foreground">Humor Positivo</p>
          </div>
          <div className="bg-card rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-purple-500">18</p>
            <p className="text-xs text-muted-foreground">Hábitos Completos</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HistoryScreen;
