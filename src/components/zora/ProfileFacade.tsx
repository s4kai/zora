import { useZora } from "@/contexts/ZoraContext";
import { motion } from "framer-motion";
import { Bell, ChevronRight, Info, Salad, User } from "lucide-react";
import { useState } from "react";

const settingsItems = [
  { icon: Bell, label: "Notificações" },
  { icon: User, label: "Conta" },
  { icon: Salad, label: "Preferências de Dieta" },
  { icon: Info, label: "Sobre o App" },
];

const ProfileFacade = () => {
  const { userName, enterSecureMode } = useZora();
  const [pressTimer, setPressTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const handleLeafPressStart = () => {
    const timer = setTimeout(() => {
      enterSecureMode();
    }, 1500);
    setPressTimer(timer);
  };

  const handleLeafPressEnd = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-5 pt-8 pb-28 max-w-md mx-auto space-y-5"
    >
      {/* Profile header */}
      <div className="bg-card rounded-2xl p-5 shadow-zora flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-zora-lavender flex items-center justify-center">
          <span className="text-2xl font-bold text-accent-foreground">
            {userName.charAt(0)}
          </span>
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">{userName}</h2>
          <p className="text-sm text-muted-foreground">Plano Gratuito</p>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-card rounded-2xl shadow-zora overflow-hidden">
        {settingsItems.map((setting, i) => (
          <button
            key={setting.label}
            className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors ${
              i < settingsItems.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <setting.icon size={18} className="text-primary" />
            <span className="text-sm font-medium text-foreground flex-1 text-left">
              {setting.label}
            </span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
        ))}
      </div>

      {/* Wellness tips filler */}
      <div className="bg-card rounded-2xl p-4 shadow-zora space-y-2">
        <h3 className="text-sm font-bold text-foreground">
          Dicas de Bem-Estar Diário
        </h3>
        <p className="text-sm text-muted-foreground">
          Manter uma rotina alimentar equilibrada é essencial para o corpo e a
          mente. Experimente incluir mais vegetais coloridos nas suas refeições.
        </p>
        <p className="text-sm text-muted-foreground">
          Lembre-se: dormir bem é tão importante quanto se alimentar bem. Tente
          manter horários regulares de sono.
        </p>
      </div>

      {/* Hidden trigger — decorative leaf pattern */}
      <div className="flex justify-center pt-4 pb-2">
        <button
          onMouseDown={handleLeafPressStart}
          onMouseUp={handleLeafPressEnd}
          onMouseLeave={handleLeafPressEnd}
          onTouchStart={handleLeafPressStart}
          onTouchEnd={handleLeafPressEnd}
          className="select-none cursor-default opacity-90 hover:opacity-100 transition-opacity"
          aria-label="Decoração"
        >
          {/* Decorative leaf SVG — the secret trigger */}
          <svg width="60" height="24" viewBox="0 0 60 24" fill="none">
            <path
              d="M8 12C8 12 14 4 22 4C30 4 30 12 30 12C30 12 30 20 22 20C14 20 8 12 8 12Z"
              fill="hsl(var(--zora-mint))"
              opacity="0.6"
            />
            <path
              d="M52 12C52 12 46 4 38 4C30 4 30 12 30 12C30 12 30 20 38 20C46 20 52 12 52 12Z"
              fill="hsl(var(--zora-mint))"
              opacity="0.4"
            />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default ProfileFacade;
