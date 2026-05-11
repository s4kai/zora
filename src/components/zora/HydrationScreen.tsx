import { useZora } from "@/contexts/ZoraContext";
import { motion } from "framer-motion";
import { ArrowLeft, Droplets, Minus, Plus, Target } from "lucide-react";

interface HydrationScreenProps {
  onBack: () => void;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const HydrationScreen = ({ onBack }: HydrationScreenProps) => {
  const { hydration, addWater, removeWater, setHydrationGoal } = useZora();

  const { current, goal, logs } = hydration;
  const progress = Math.min(current / goal, 1);
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference * (1 - progress);

  // Get today's logs only
  const today = new Date().toISOString().split("T")[0];
  const todayLogs = logs.filter(
    (log) => new Date(log.timestamp).toISOString().split("T")[0] === today
  );

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="px-5 pt-6 pb-28 max-w-md mx-auto space-y-5"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-zora"
        >
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Hidratacao</h1>
      </motion.div>

      {/* Progress Ring */}
      <motion.div
        variants={item}
        className="bg-card rounded-2xl p-6 shadow-zora flex flex-col items-center gap-4"
      >
        <div className="relative w-44 h-44">
          <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="hsl(var(--zora-mint))"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <motion.circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="hsl(var(--zora-mint-deep))"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Droplets size={28} className="text-primary mb-1" />
            <span className="text-3xl font-bold text-foreground">
              {current}/{goal}
            </span>
            <span className="text-sm text-muted-foreground">copos</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          <button
            onClick={removeWater}
            disabled={current === 0}
            className="w-14 h-14 rounded-full bg-zora-peach flex items-center justify-center shadow-zora disabled:opacity-40 transition-opacity"
          >
            <Minus size={24} className="text-foreground" />
          </button>
          <div className="text-center">
            <p className="text-sm font-semibold text-muted-foreground">
              Adicionar
            </p>
            <p className="text-xs text-muted-foreground">250ml</p>
          </div>
          <button
            onClick={() => addWater(250)}
            className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-zora"
          >
            <Plus size={24} className="text-primary-foreground" />
          </button>
        </div>

        {current >= goal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zora-mint/50 rounded-xl px-4 py-2"
          >
            <p className="text-sm font-bold text-primary">
              Meta atingida! Parabens!
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Goal Setting */}
      <motion.div
        variants={item}
        className="bg-card rounded-2xl p-4 shadow-zora"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zora-lavender flex items-center justify-center">
              <Target size={20} className="text-foreground" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Meta Diaria</p>
              <p className="text-xs text-muted-foreground">
                Ajuste conforme sua necessidade
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHydrationGoal(Math.max(goal - 1, 4))}
              className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
            >
              <Minus size={16} className="text-foreground" />
            </button>
            <span className="text-lg font-bold text-foreground w-8 text-center">
              {goal}
            </span>
            <button
              onClick={() => setHydrationGoal(Math.min(goal + 1, 15))}
              className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
            >
              <Plus size={16} className="text-foreground" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Today's Log */}
      <motion.div
        variants={item}
        className="bg-card rounded-2xl p-4 shadow-zora space-y-3"
      >
        <h3 className="text-sm font-bold text-foreground">Registro de Hoje</h3>
        <div className="space-y-2">
          {todayLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">
              Nenhum registro ainda. Comece a beber agua!
            </p>
          ) : (
            todayLogs.slice(-5).reverse().map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zora-mint/50 flex items-center justify-center">
                    <Droplets size={14} className="text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {log.amount}ml
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">{log.time}</span>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Tips */}
      <motion.div variants={item} className="bg-zora-mint/40 rounded-2xl p-4">
        <p className="text-xs font-semibold text-primary">Dica</p>
        <p className="text-sm text-foreground mt-1">
          Beba um copo de agua ao acordar para hidratar o corpo apos o sono.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default HydrationScreen;
