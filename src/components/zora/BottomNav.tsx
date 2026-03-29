import { useZora } from "@/contexts/ZoraContext";
import { motion } from "framer-motion";
import { CalendarDays, Droplets, User, UtensilsCrossed } from "lucide-react";

const tabs = [
  { id: "home" as const, icon: UtensilsCrossed, label: "Nutrição" },
  { id: "calendar" as const, icon: CalendarDays, label: "Histórico" },
  { id: "habits" as const, icon: Droplets, label: "Hábitos" },
  { id: "profile" as const, icon: User, label: "Perfil" },
];

const BottomNav = () => {
  const { facadeTab, setFacadeTab } = useZora();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-2 pb-6 pt-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = facadeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFacadeTab(tab.id)}
              className="flex flex-col items-center gap-0.5 px-3 py-1 relative"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-2 w-8 h-1 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <tab.icon
                size={22}
                className={isActive ? "text-primary" : "text-muted-foreground"}
              />
              <span
                className={`text-[10px] font-semibold ${isActive ? "text-primary" : "text-muted-foreground"}`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
