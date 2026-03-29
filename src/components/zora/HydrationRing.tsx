import { motion } from "framer-motion";

interface HydrationRingProps {
  current: number;
  goal: number;
}

const HydrationRing = ({ current, goal }: HydrationRingProps) => {
  const progress = Math.min(current / goal, 1);
  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="hsl(var(--zora-mint))"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <motion.circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="hsl(var(--zora-mint-deep))"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-foreground">
            {current}/{goal}
          </span>
          <span className="text-xs text-muted-foreground">copos</span>
        </div>
      </div>
      <p className="text-sm font-semibold text-primary">Meta de Hidratação</p>
    </div>
  );
};

export default HydrationRing;
