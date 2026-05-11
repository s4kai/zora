import { motion } from "framer-motion";
import {
  Book,
  Check,
  Droplets,
  Dumbbell,
  Moon,
  Plus,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import AddHabitScreen from "./AddHabitScreen";
import HydrationScreen from "./HydrationScreen";
import MoodScreen from "./MoodScreen";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

type SubScreen = "main" | "hydration" | "mood" | "add-habit";

interface Habit {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  iconColor: string;
  streak: number;
  completed: boolean;
  progress?: { current: number; goal: number };
}

const HabitsScreen = () => {
  const [subScreen, setSubScreen] = useState<SubScreen>("main");
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: "water",
      name: "Beber água",
      icon: Droplets,
      color: "bg-blue-100",
      iconColor: "text-blue-500",
      streak: 7,
      completed: false,
      progress: { current: 5, goal: 8 },
    },
    {
      id: "exercise",
      name: "Exercitar",
      icon: Dumbbell,
      color: "bg-orange-100",
      iconColor: "text-orange-500",
      streak: 3,
      completed: true,
    },
    {
      id: "meditate",
      name: "Meditar",
      icon: Sparkles,
      color: "bg-purple-100",
      iconColor: "text-purple-500",
      streak: 12,
      completed: false,
    },
    {
      id: "read",
      name: "Ler 20 minutos",
      icon: Book,
      color: "bg-green-100",
      iconColor: "text-green-600",
      streak: 5,
      completed: true,
    },
    {
      id: "sleep",
      name: "Dormir cedo",
      icon: Moon,
      color: "bg-indigo-100",
      iconColor: "text-indigo-500",
      streak: 2,
      completed: false,
    },
  ]);

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h))
    );
  };

  const completedCount = habits.filter((h) => h.completed).length;
  const totalCount = habits.length;
  const progress = (completedCount / totalCount) * 100;

  if (subScreen === "hydration") {
    return <HydrationScreen onBack={() => setSubScreen("main")} />;
  }

  if (subScreen === "mood") {
    return <MoodScreen onBack={() => setSubScreen("main")} />;
  }

  if (subScreen === "add-habit") {
    return <AddHabitScreen onBack={() => setSubScreen("main")} />;
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="px-5 pt-6 pb-28 max-w-md mx-auto space-y-5"
    >
      {/* Header */}
      <motion.div
        variants={item}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-xl font-bold text-foreground">Meus Hábitos</h1>
          <p className="text-xs text-muted-foreground">
            {completedCount} de {totalCount} completos hoje
          </p>
        </div>
        <button
          onClick={() => setSubScreen("add-habit")}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-zora"
        >
          <Plus size={20} className="text-primary-foreground" />
        </button>
      </motion.div>

      {/* Daily Progress */}
      <motion.div
        variants={item}
        className="bg-card rounded-2xl p-4 shadow-zora"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-primary" />
            <span className="text-sm font-bold text-foreground">
              Progresso Diário
            </span>
          </div>
          <span className="text-sm font-bold text-primary">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-primary rounded-full"
          />
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setSubScreen("hydration")}
          className="bg-blue-50 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-zora hover:shadow-zora-lg transition-shadow"
        >
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Droplets size={24} className="text-blue-500" />
          </div>
          <span className="text-sm font-bold text-foreground">Hidratação</span>
          <span className="text-xs text-muted-foreground">5/8 copos</span>
        </button>

        <button
          onClick={() => setSubScreen("mood")}
          className="bg-yellow-50 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-zora hover:shadow-zora-lg transition-shadow"
        >
          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
            <Sparkles size={24} className="text-yellow-600" />
          </div>
          <span className="text-sm font-bold text-foreground">Humor</span>
          <span className="text-xs text-muted-foreground">Registrar</span>
        </button>
      </motion.div>

      {/* Habits List */}
      <motion.div
        variants={item}
        className="bg-card rounded-2xl p-4 shadow-zora space-y-3"
      >
        <h3 className="text-sm font-bold text-foreground">Hábitos de Hoje</h3>
        <div className="space-y-2">
          {habits.map((habit) => (
            <motion.button
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                habit.completed
                  ? "bg-primary/10 ring-1 ring-primary/30"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full ${habit.completed ? "bg-primary" : habit.color} flex items-center justify-center transition-colors`}
              >
                {habit.completed ? (
                  <Check size={20} className="text-primary-foreground" />
                ) : (
                  <habit.icon size={20} className={habit.iconColor} />
                )}
              </div>
              <div className="flex-1 text-left">
                <p
                  className={`text-sm font-semibold ${habit.completed ? "text-primary line-through" : "text-foreground"}`}
                >
                  {habit.name}
                </p>
                {habit.progress && (
                  <p className="text-xs text-muted-foreground">
                    {habit.progress.current}/{habit.progress.goal}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-muted-foreground">
                  🔥 {habit.streak}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Streaks Overview */}
      <motion.div
        variants={item}
        className="bg-zora-mint/40 rounded-2xl p-4 space-y-3"
      >
        <h3 className="text-sm font-bold text-foreground">Melhores Sequências</h3>
        <div className="flex gap-3">
          {habits
            .sort((a, b) => b.streak - a.streak)
            .slice(0, 3)
            .map((habit) => (
              <div
                key={habit.id}
                className="flex-1 bg-card rounded-xl p-3 text-center"
              >
                <div
                  className={`w-8 h-8 rounded-full ${habit.color} flex items-center justify-center mx-auto mb-2`}
                >
                  <habit.icon size={16} className={habit.iconColor} />
                </div>
                <p className="text-lg font-bold text-primary">
                  {habit.streak}
                </p>
                <p className="text-[10px] text-muted-foreground">dias</p>
              </div>
            ))}
        </div>
      </motion.div>

      {/* Motivation */}
      <motion.div variants={item} className="bg-zora-peach/40 rounded-2xl p-4">
        <p className="text-xs font-semibold text-foreground">🌟 Motivação</p>
        <p className="text-sm text-foreground mt-1">
          {completedCount === totalCount
            ? "Incrível! Você completou todos os hábitos de hoje! 🎉"
            : `Faltam apenas ${totalCount - completedCount} hábitos. Você consegue!`}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default HabitsScreen;
