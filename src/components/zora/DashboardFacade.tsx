import { useZora } from "@/contexts/ZoraContext";
import { motion } from "framer-motion";
import { Apple, Coffee, Frown, Meh, Salad, Smile } from "lucide-react";
import HydrationRing from "./HydrationRing";

const moodEmojis = [
  { icon: Smile, label: "Bem", active: true },
  { icon: Meh, label: "Ok", active: false },
  { icon: Frown, label: "Mal", active: false },
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
  const { userName } = useZora();

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
          <p className="text-sm text-muted-foreground">Bom dia ☀️</p>
          <h1 className="text-xl font-bold text-foreground">Olá, {userName}</h1>
        </div>
      </motion.div>

      {/* Hydration */}
      <motion.div
        variants={item}
        className="bg-card rounded-2xl p-5 shadow-zora flex justify-center"
      >
        <HydrationRing current={3} goal={8} />
      </motion.div>

      {/* Last meal */}
      <motion.div
        variants={item}
        className="bg-card rounded-2xl p-4 shadow-zora space-y-3"
      >
        <h3 className="text-sm font-bold text-foreground">
          Última Refeição Registrada
        </h3>
        <div className="flex gap-3">
          {[
            { icon: Coffee, label: "Café", bg: "bg-zora-peach" },
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
        <p className="text-xs text-muted-foreground">Almoço • Hoje às 12:30</p>
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
          {moodEmojis.map((mood) => (
            <button
              key={mood.label}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                mood.active
                  ? "bg-primary/10 ring-2 ring-primary/30"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              <mood.icon
                size={24}
                className={
                  mood.active ? "text-primary" : "text-muted-foreground"
                }
              />
              <span
                className={`text-xs font-semibold ${mood.active ? "text-primary" : "text-muted-foreground"}`}
              >
                {mood.label}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Wellness tip */}
      <motion.div variants={item} className="bg-zora-mint/40 rounded-2xl p-4">
        <p className="text-xs font-semibold text-primary">
          💡 Dica de Bem-Estar
        </p>
        <p className="text-sm text-foreground mt-1">
          Tente fazer uma caminhada de 10 minutos após o almoço. Pequenos
          hábitos fazem grande diferença!
        </p>
      </motion.div>
    </motion.div>
  );
};

export default DashboardFacade;
