import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface HydrationRingProps {
  current: number;
  goal: number;
  onIncrement?: () => void;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const sizes = {
  sm: { container: "w-16 h-16", text: "text-sm", subtext: "text-[10px]", radius: 24, stroke: 4 },
  md: { container: "w-32 h-32", text: "text-2xl", subtext: "text-xs", radius: 52, stroke: 8 },
  lg: { container: "w-40 h-40", text: "text-3xl", subtext: "text-sm", radius: 64, stroke: 10 },
};

const HydrationRing = ({
  current,
  goal,
  onIncrement,
  size = "md",
  showLabel = true,
}: HydrationRingProps) => {
  const progress = Math.min(current / goal, 1);
  const { container, text, subtext, radius, stroke } = sizes[size];
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);
  const viewBoxSize = (radius + stroke) * 2;
  const center = viewBoxSize / 2;

  const isInteractive = !!onIncrement;
  const isComplete = current >= goal;

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={onIncrement}
        disabled={!isInteractive}
        className={`relative ${container} group ${
          isInteractive
            ? "cursor-pointer active:scale-95 transition-transform"
            : "cursor-default"
        }`}
        aria-label={
          isInteractive
            ? `Adicionar água. Atual: ${current} de ${goal} copos`
            : `${current} de ${goal} copos`
        }
      >
        <svg
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          className="w-full h-full -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="hsl(var(--zora-mint))"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          {/* Progress circle */}
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={isComplete ? "hsl(var(--zora-mint-deep))" : "hsl(var(--zora-mint-deep))"}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isInteractive && !isComplete ? (
            <motion.div
              className="flex flex-col items-center"
              whileHover={{ scale: 1.05 }}
            >
              <span className={`${text} font-bold text-foreground`}>
                {current}/{goal}
              </span>
              {size !== "sm" && (
                <span className={`${subtext} text-muted-foreground`}>copos</span>
              )}
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 flex items-center gap-0.5 text-primary"
              >
                <Plus size={size === "sm" ? 10 : 14} />
                <span className={size === "sm" ? "text-[8px]" : "text-[10px]"}>
                  toque
                </span>
              </motion.div>
            </motion.div>
          ) : (
            <>
              <span className={`${text} font-bold text-foreground`}>
                {current}/{goal}
              </span>
              {size !== "sm" && (
                <span className={`${subtext} text-muted-foreground`}>copos</span>
              )}
            </>
          )}
        </div>

        {/* Pulse effect on tap */}
        {isInteractive && (
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/10 pointer-events-none"
            initial={{ scale: 1, opacity: 0 }}
            whileTap={{ scale: 1.1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </button>

      {showLabel && (
        <p className="text-sm font-semibold text-primary">
          {isComplete ? "Meta atingida!" : "Meta de Hidratação"}
        </p>
      )}
    </div>
  );
};

export default HydrationRing;
