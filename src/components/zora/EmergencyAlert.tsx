import { useZora } from "@/contexts/ZoraContext";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const EmergencyAlert = () => {
  const { cancelAlert } = useZora();
  const [countdown, setCountdown] = useState(5);
  const [steps, setSteps] = useState([
    { text: "Enviando localização para Contatos de Confiança...", done: false },
    { text: "Notificando Autoridades...", done: false },
    { text: "Iniciando Gravação de Áudio de Fundo...", done: false },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Simulate steps completing
    const t1 = setTimeout(
      () =>
        setSteps((s) =>
          s.map((st, i) => (i === 0 ? { ...st, done: true } : st)),
        ),
      1200,
    );
    const t2 = setTimeout(
      () =>
        setSteps((s) =>
          s.map((st, i) => (i === 2 ? { ...st, done: true } : st)),
        ),
      2000,
    );
    const t3 = setTimeout(
      () =>
        setSteps((s) =>
          s.map((st, i) => (i === 1 ? { ...st, done: true } : st)),
        ),
      3500,
    );
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-secure-bg font-secure flex flex-col items-center justify-center px-6"
    >
      {/* Pulsing circle */}
      <div className="relative mb-8">
        <motion.div
          className="w-36 h-36 rounded-full border-4 border-secure-amber/30 flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="w-28 h-28 rounded-full border-2 border-secure-amber/50 flex items-center justify-center"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
          >
            <span className="text-5xl font-bold text-secure-amber">
              {countdown}
            </span>
          </motion.div>
        </motion.div>
      </div>

      <h1 className="text-lg font-semibold text-secure-text mb-6">
        Alerta Silencioso Ativado
      </h1>

      {/* Status indicators */}
      <div className="w-full max-w-sm space-y-3 mb-10">
        {steps.map((step) => (
          <div key={step.text} className="flex items-center gap-3">
            {step.done ? (
              <div className="w-6 h-6 rounded-full bg-secure-safe/20 flex items-center justify-center">
                <Check size={14} className="text-secure-safe" />
              </div>
            ) : (
              <Loader2 size={18} className="text-secure-amber animate-spin" />
            )}
            <span
              className={`text-sm ${step.done ? "text-secure-text" : "text-secure-muted"}`}
            >
              {step.text}
            </span>
          </div>
        ))}
      </div>

      {/* Cancel button */}
      <button
        onClick={cancelAlert}
        onTouchStart={(e) => e.currentTarget.classList.add("scale-95")}
        onTouchEnd={(e) => e.currentTarget.classList.remove("scale-95")}
        className="w-full max-w-sm py-3.5 rounded-xl bg-secure-card border border-secure-border text-secure-muted text-sm font-semibold hover:bg-secure-border transition-all"
      >
        Cancelar Alerta ({countdown}s)
      </button>
    </motion.div>
  );
};

export default EmergencyAlert;
