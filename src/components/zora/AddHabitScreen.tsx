import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bell,
  Book,
  Check,
  Dumbbell,
  Droplets,
  Heart,
  Leaf,
  Moon,
  Pill,
  Plus,
  Sparkles,
  Sun,
} from "lucide-react";
import { useState } from "react";

interface AddHabitScreenProps {
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

const presetHabits = [
  {
    id: "water",
    name: "Beber água",
    icon: Droplets,
    color: "bg-blue-100",
    iconColor: "text-blue-500",
  },
  {
    id: "exercise",
    name: "Exercitar",
    icon: Dumbbell,
    color: "bg-orange-100",
    iconColor: "text-orange-500",
  },
  {
    id: "sleep",
    name: "Dormir cedo",
    icon: Moon,
    color: "bg-purple-100",
    iconColor: "text-purple-500",
  },
  {
    id: "meditate",
    name: "Meditar",
    icon: Sparkles,
    color: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    id: "read",
    name: "Ler",
    icon: Book,
    color: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    id: "vitamins",
    name: "Tomar vitaminas",
    icon: Pill,
    color: "bg-pink-100",
    iconColor: "text-pink-500",
  },
  {
    id: "sunlight",
    name: "Tomar sol",
    icon: Sun,
    color: "bg-amber-100",
    iconColor: "text-amber-500",
  },
  {
    id: "healthy",
    name: "Comer saudável",
    icon: Leaf,
    color: "bg-emerald-100",
    iconColor: "text-emerald-500",
  },
];

const frequencies = [
  { id: "daily", label: "Diário" },
  { id: "weekdays", label: "Dias úteis" },
  { id: "weekends", label: "Fins de semana" },
  { id: "custom", label: "Personalizado" },
];

const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

const iconOptions = [
  { icon: Heart, color: "text-red-500" },
  { icon: Droplets, color: "text-blue-500" },
  { icon: Dumbbell, color: "text-orange-500" },
  { icon: Moon, color: "text-purple-500" },
  { icon: Sun, color: "text-yellow-500" },
  { icon: Leaf, color: "text-green-500" },
  { icon: Book, color: "text-teal-500" },
  { icon: Sparkles, color: "text-pink-500" },
];

const AddHabitScreen = ({ onBack }: AddHabitScreenProps) => {
  const [habitName, setHabitName] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [frequency, setFrequency] = useState("daily");
  const [selectedDays, setSelectedDays] = useState<number[]>([
    0, 1, 2, 3, 4, 5, 6,
  ]);
  const [reminder, setReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState("08:00");
  const [selectedIcon, setSelectedIcon] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCustom, setShowCustom] = useState(false);

  const handlePresetSelect = (preset: (typeof presetHabits)[0]) => {
    setSelectedPreset(preset.id);
    setHabitName(preset.name);
    setShowCustom(false);
  };

  const toggleDay = (idx: number) => {
    setSelectedDays((prev) =>
      prev.includes(idx) ? prev.filter((d) => d !== idx) : [...prev, idx]
    );
  };

  const handleSave = () => {
    if (habitName.trim()) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onBack();
      }, 2000);
    }
  };

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
        <h1 className="text-xl font-bold text-foreground">Novo Hábito</h1>
      </motion.div>

      {/* Success Message */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-primary rounded-2xl p-4 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <Check size={24} className="text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-bold text-primary-foreground">
              Hábito criado!
            </p>
            <p className="text-xs text-primary-foreground/80">
              Vamos construir juntos! 🌱
            </p>
          </div>
        </motion.div>
      )}

      {/* Preset Habits */}
      <motion.div
        variants={item}
        className="bg-card rounded-2xl p-4 shadow-zora space-y-3"
      >
        <h3 className="text-sm font-bold text-foreground">Sugestões</h3>
        <div className="grid grid-cols-4 gap-2">
          {presetHabits.map((preset) => {
            const isSelected = selectedPreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                  isSelected
                    ? "bg-primary/10 ring-2 ring-primary"
                    : `${preset.color} hover:opacity-80`
                }`}
              >
                <preset.icon
                  size={20}
                  className={isSelected ? "text-primary" : preset.iconColor}
                />
                <span
                  className={`text-[10px] font-semibold text-center leading-tight ${isSelected ? "text-primary" : "text-foreground"}`}
                >
                  {preset.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Custom Option */}
        <button
          onClick={() => {
            setShowCustom(true);
            setSelectedPreset(null);
            setHabitName("");
          }}
          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
            showCustom
              ? "bg-primary/10 ring-2 ring-primary"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-zora-mint flex items-center justify-center">
            <Plus size={18} className="text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">
            Criar hábito personalizado
          </span>
        </button>
      </motion.div>

      {/* Custom Habit Name */}
      {showCustom && (
        <motion.div
          variants={item}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-4 shadow-zora space-y-3"
        >
          <h3 className="text-sm font-bold text-foreground">Nome do Hábito</h3>
          <input
            type="text"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            placeholder="Ex: Caminhar 30 minutos"
            className="w-full p-3 rounded-xl bg-muted text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Icon Selection */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Escolha um ícone</p>
            <div className="flex gap-2">
              {iconOptions.map((opt, idx) => {
                const isSelected = selectedIcon === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedIcon(idx)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-primary/10 ring-2 ring-primary"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    <opt.icon size={20} className={opt.color} />
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Frequency */}
      {habitName && (
        <motion.div
          variants={item}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-4 shadow-zora space-y-3"
        >
          <h3 className="text-sm font-bold text-foreground">Frequência</h3>
          <div className="flex flex-wrap gap-2">
            {frequencies.map((freq) => {
              const isSelected = frequency === freq.id;
              return (
                <button
                  key={freq.id}
                  onClick={() => setFrequency(freq.id)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  {freq.label}
                </button>
              );
            })}
          </div>

          {frequency === "custom" && (
            <div className="flex justify-between pt-2">
              {days.map((day, idx) => {
                const isSelected = selectedDays.includes(idx);
                return (
                  <button
                    key={idx}
                    onClick={() => toggleDay(idx)}
                    className={`w-9 h-9 rounded-full text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground hover:bg-muted/80"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {/* Reminder */}
      {habitName && (
        <motion.div
          variants={item}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-4 shadow-zora"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zora-peach flex items-center justify-center">
                <Bell size={20} className="text-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Lembrete</p>
                <p className="text-xs text-muted-foreground">
                  Receba uma notificação
                </p>
              </div>
            </div>
            <button
              onClick={() => setReminder(!reminder)}
              className={`w-12 h-7 rounded-full transition-all ${reminder ? "bg-primary" : "bg-muted"}`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${reminder ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
          </div>

          {reminder && (
            <div className="mt-3 pt-3 border-t border-border">
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full p-3 rounded-xl bg-muted text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}
        </motion.div>
      )}

      {/* Save Button */}
      {habitName && (
        <motion.div
          variants={item}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={handleSave}
            className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-zora-lg"
          >
            Criar Hábito
          </button>
        </motion.div>
      )}

      {/* Tips */}
      <motion.div variants={item} className="bg-zora-mint/40 rounded-2xl p-4">
        <p className="text-xs font-semibold text-primary">💡 Dica</p>
        <p className="text-sm text-foreground mt-1">
          Comece com hábitos pequenos e aumente gradualmente. Consistência é
          mais importante que intensidade!
        </p>
      </motion.div>
    </motion.div>
  );
};

export default AddHabitScreen;
