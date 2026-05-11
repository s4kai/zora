import { useZora, type MoodType } from "@/contexts/ZoraContext";
import {
  formatTime,
  getGreeting,
  getGreetingEmoji,
  getMealTypeLabel,
} from "@/lib/wellness-utils";
import { motion } from "framer-motion";
import { Apple, Coffee, Frown, Meh, Salad, Smile, Utensils } from "lucide-react";
import HydrationRing from "./HydrationRing";

const moodOptions: Array<{
  icon: typeof Smile;
  label: string;
  value: MoodType;
}> = [
  { icon: Smile, label: "Bem", value: "good" },
  { icon: Meh, label: "Ok", value: "ok" },
  { icon: Frown, label: "Mal", value: "bad" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const DashboardFacade = () => {
  const { userName, today, addHydration, setMood, isHydrated } = useZora();

  const greeting = getGreeting();
  const greetingEmoji = getGreetingEmoji();

  // Get the last meal if any
  const lastMeal = today.meals.length > 0 ? today.meals[today.meals.length - 1] : null;

  // Default food icons for display
  const defaultFoodItems = [
    { icon: Coffee, label: "Cafe", bg: "bg-zora-peach" },
    { icon: Apple, label: "Fruta", bg: "bg-zora-mint" },
    { icon: Salad, label: "Salada", bg: "bg-zora-lavender" },
  ];

  // Show skeleton while hydrating from storage
  if (!isHydrated) {
    return (
      <div className="px-5 pt-8 pb-28 max-w-md mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
          <div className="space-y-2">
            <div className="w-20 h-3 bg-muted rounded animate-pulse" />
            <div className="w-32 h-5 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="bg-card rounded-2xl p-5 h-44 animate-pulse" />
        <div className="bg-card rounded-2xl p-4 h-32 animate-pulse" />
        <div className="bg-card rounded-2xl p-4 h-24 animate-pulse" />
      </div>
    );
  }

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
          <p className="text-sm text-muted-foreground">
            {greeting} {greetingEmoji}
          </p>
          <h1 className="text-xl font-bold text-foreground">Ola, {userName}</h1>
        </div>
      </motion.div>

      {/* Hydration */}
      <motion.div
        variants={item}
        className="bg-card rounded-2xl p-5 shadow-zora flex justify-center"
      >
        <HydrationRing
          current={today.hydration.current}
          goal={today.hydration.goal}
          onIncrement={() => addHydration(1)}
        />
      </motion.div>

      {/* Last meal */}
      <motion.div
        variants={item}
        className="bg-card rounded-2xl p-4 shadow-zora space-y-3"
      >
        <h3 className="text-sm font-bold text-foreground">
          Ultima Refeicao Registrada
        </h3>
        {lastMeal ? (
          <>
            <div className="flex gap-3">
              {lastMeal.items.slice(0, 3).map((itemLabel, idx) => {
                const foodItem = defaultFoodItems[idx % defaultFoodItems.length];
                return (
                  <div
                    key={idx}
                    className={`${foodItem.bg} rounded-xl p-3 flex-1 flex flex-col items-center gap-1`}
                  >
                    <foodItem.icon size={20} className="text-foreground" />
                    <span className="text-xs font-semibold text-foreground truncate max-w-full">
                      {itemLabel}
                    </span>
                  </div>
                );
              })}
              {lastMeal.items.length === 0 && (
                <div className="bg-zora-peach rounded-xl p-3 flex-1 flex flex-col items-center gap-1">
                  <Utensils size={20} className="text-foreground" />
                  <span className="text-xs font-semibold text-foreground">
                    Refeicao
                  </span>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {getMealTypeLabel(lastMeal.type)} • Hoje as {lastMeal.time}
            </p>
          </>
        ) : (
          <div className="flex gap-3">
            {defaultFoodItems.map((food) => (
              <div
                key={food.label}
                className={`${food.bg} rounded-xl p-3 flex-1 flex flex-col items-center gap-1 opacity-50`}
              >
                <food.icon size={20} className="text-foreground" />
                <span className="text-xs font-semibold text-foreground">
                  {food.label}
                </span>
              </div>
            ))}
          </div>
        )}
        {!lastMeal && (
          <p className="text-xs text-muted-foreground">
            Nenhuma refeicao registrada hoje
          </p>
        )}
      </motion.div>

      {/* Mood tracking */}
      <motion.div
        variants={item}
        className="bg-card rounded-2xl p-4 shadow-zora space-y-3"
      >
        <h3 className="text-sm font-bold text-foreground">
          Acompanhamento de Humor
        </h3>
        <div className="flex gap-3 justify-center">
          {moodOptions.map((mood) => {
            const isActive = today.mood === mood.value;
            return (
              <button
                key={mood.value}
                type="button"
                onClick={() => setMood(mood.value)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  isActive
                    ? "bg-primary/10 ring-2 ring-primary/30"
                    : "bg-muted hover:bg-muted/80"
                }`}
                aria-pressed={isActive}
                aria-label={`Humor: ${mood.label}`}
              >
                <mood.icon
                  size={24}
                  className={isActive ? "text-primary" : "text-muted-foreground"}
                />
                <span
                  className={`text-xs font-semibold ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {mood.label}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

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
