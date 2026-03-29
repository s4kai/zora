import { motion } from "framer-motion";
import { Droplets } from "lucide-react";

const HabitsPlaceholder = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="px-5 pt-8 pb-28 max-w-md mx-auto space-y-5"
  >
    <h1 className="text-xl font-bold text-foreground">Hábitos</h1>
    <div className="bg-card rounded-2xl p-6 shadow-zora flex flex-col items-center gap-3">
      <Droplets size={40} className="text-primary/40" />
      <p className="text-sm text-muted-foreground text-center">
        Acompanhe seus hábitos diários de saúde e bem-estar.
      </p>
    </div>
  </motion.div>
);

export default HabitsPlaceholder;
