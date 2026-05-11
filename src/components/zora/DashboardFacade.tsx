import { useZora } from "@/contexts/ZoraContext";
import { motion } from "framer-motion";
import {
  Apple,
  ChevronRight,
  Coffee,
  Frown,
  Meh,
  Plus,
  Salad,
  Smile,
} from "lucide-react";
import { useState } from "react";
import HydrationRing from "./HydrationRing";
import HydrationScreen from "./HydrationScreen";
import MealScreen from "./MealScreen";
import MoodScreen from "./MoodScreen";

type SubScreen = "main" | "hydration" | "meal" | "mood";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const moodOptions = [
  { id: "good", icon: Smile, label: "Bem" },
  { id: "neutral", icon: Meh, label: "Ok" },
  { id: "bad", icon: Frown, label: "Mal" },
];

const DashboardFacade = () => {
  const { userName, hydration, todayMood, lastMeal } = useZora();
  const [subScreen, setSubScreen] = useState<SubScreen>("main");

  if (subScreen === "hydration") {
    return <HydrationScreen onBack={() => setSubScreen("main")} />;
  }

  if (subScreen === "meal") {
    return <MealScreen onBack={() => setSubScreen("main")} />;
  }

  if (subScreen === "mood") {
    return <MoodScreen onBack={() => setSubScreen("main")} />;
  }

  // Format last meal time
  const getLastMealInfo = () => {
    if (!lastMeal) return null;

    const mealLabels: Record<string, string> = {
      breakfast: "Cafe da manha",
      lunch: "Almoco",
      snack: "Lanche",
      dinner: "Jantar",
    };

    const time = new Date(lastMeal.timestamp).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      type: mealLabels[lastMeal.type] || lastMeal.type,
      time,
    };
  };

  const lastMealInfo = getLastMealInfo();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="px-5 pt-8 pb-28 max-w-md mx-auto space-y-5"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-zora-mint flex items-center justify-center">
          <span className="text-lg font-bold text-primary">
            {userName.charAt(0)}
          </span>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Bom dia</p>
          <h1 className="text-xl font-bold text-foreground">Ola, {userName}</h1>
        </div>
      </motion.div>

      {/* Hydration - Clickable */}
      <motion.button
        variants={item}
        onClick={() => setSubScreen("hydration")}
        className="w-full bg-card rounded-2xl p-5 shadow-zora flex justify-center items-center hover:shadow-zora-lg transition-shadow text-left"
      >
        <HydrationRing current={hydration.current} goal={hydration.goal} />
      </motion.button>

      {/* Add Meal Button */}
      <motion.button
        variants={item}
        onClick={() => setSubScreen("meal")}
        className="w-full bg-primary rounded-2xl p-4 shadow-zora-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
      >
        <Plus size={20} className="text-primary-foreground" />
        <span className="text-sm font-bold text-primary-foreground">
          Registrar Refeicao
        </span>
      </motion.button>

      {/* Last meal */}
      <motion.div
        variants={item}
        className="bg-card rounded-2xl p-4 shadow-zora space-y-3"
      >
        <h3 className="text-sm font-bold text-foreground">
          Ultima Refeicao Registrada
        </h3>
        <div className="flex gap-3">
          {[
            { icon: Coffee, label: "Cafe", bg: "bg-zora-peach" },
            { icon: Apple, label: "Fruta", bg: "bg-zora-mint" },
            { icon: Salad, label: "Salada", bg: "bg-zora-lavender" },
          ].map((food) => (
            <div
              key={food.label}
              className={`${food.bg} rounded-xl p-3 flex-1 flex flex-col items-center gap-1`}
            >
              <food.icon size={20} className="text-foreground" />
              <span className="text-xs font-semibold text-foreground">
                {food.label}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {lastMealInfo
            ? `${lastMealInfo.type} - Hoje as ${lastMealInfo.time}`
            : "Nenhuma refeicao registrada ainda"}
        </p>
      </motion.div>

      {/* Mood tracking - Clickable */}
      <motion.button
        variants={item}
        onClick={() => setSubScreen("mood")}
        className="w-full bg-card rounded-2xl p-4 shadow-zora space-y-3 hover:shadow-zora-lg transition-shadow text-left"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">
            Acompanhamento de Humor
          </h3>
          <ChevronRight size={18} className="text-muted-foreground" />
        </div>
        <div className="flex gap-3 justify-center">
          {moodOptions.map((mood) => {
            const isActive =
              todayMood?.mood === mood.id ||
              (todayMood?.mood === "great" && mood.id === "good") ||
              (todayMood?.mood === "terrible" && mood.id === "bad");

            return (
              <div
                key={mood.id}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  isActive ? "bg-primary/10 ring-2 ring-primary/30" : "bg-muted"
                }`}
              >
                <mood.icon
                  size={24}
                  className={
                    isActive ? "text-primary" : "text-muted-foreground"
                  }
                />
                <span
                  className={`text-xs font-semibold ${isActive ? "text-primary" : "text-muted-foreground"}`}
                >
                  {mood.label}
                </span>
              </div>
            );
          })}
        </div>
      </motion.button>

      {/* Wellness tip */}
      <motion.div variants={item} className="bg-zora-mint/40 rounded-2xl p-4">
        <p className="text-xs font-semibold text-primary">Dica de Bem-Estar</p>
        <p className="text-sm text-foreground mt-1">
          Tente fazer uma caminhada de 10 minutos apos o almoco. Pequenos
          habitos fazem grande diferenca!
        </p>
      </motion.div>
    </motion.div>
  );
};

export default DashboardFacade;
