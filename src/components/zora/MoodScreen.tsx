import { MoodType, useZora } from "@/contexts/ZoraContext";
import { motion } from "framer-motion";
import {
  Angry,
  ArrowLeft,
  Check,
  Frown,
  Heart,
  Meh,
  Smile,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

interface MoodScreenProps {
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

const moods = [
  {
    id: "great" as MoodType,
    label: "Otimo",
    icon: Sparkles,
    color: "text-yellow-500",
    bg: "bg-yellow-100",
    activeBg: "bg-yellow-500",
  },
  {
    id: "good" as MoodType,
    label: "Bem",
    icon: Smile,
    color: "text-green-500",
    bg: "bg-green-100",
    activeBg: "bg-green-500",
  },
  {
    id: "neutral" as MoodType,
    label: "Normal",
    icon: Meh,
    color: "text-blue-500",
    bg: "bg-blue-100",
    activeBg: "bg-blue-500",
  },
  {
    id: "bad" as MoodType,
    label: "Mal",
    icon: Frown,
    color: "text-orange-500",
    bg: "bg-orange-100",
    activeBg: "bg-orange-500",
  },
  {
    id: "terrible" as MoodType,
    label: "Pessimo",
    icon: Angry,
    color: "text-red-500",
    bg: "bg-red-100",
    activeBg: "bg-red-500",
  },
];

const factors = [
  { id: "sleep", label: "Sono", emoji: "Sono" },
  { id: "work", label: "Trabalho", emoji: "Trabalho" },
  { id: "exercise", label: "Exercicio", emoji: "Exercicio" },
  { id: "family", label: "Familia", emoji: "Familia" },
  { id: "food", label: "Alimentacao", emoji: "Alimentacao" },
  { id: "health", label: "Saude", emoji: "Saude" },
  { id: "social", label: "Social", emoji: "Social" },
  { id: "hobby", label: "Hobby", emoji: "Hobby" },
];

const MoodScreen = ({ onBack }: MoodScreenProps) => {
  const { saveMood, todayMood, weekMoods } = useZora();

  const [selectedMood, setSelectedMood] = useState<MoodType | null>(
    todayMood?.mood || null
  );
  const [selectedFactors, setSelectedFactors] = useState<string[]>(
    todayMood?.factors || []
  );
  const [note, setNote] = useState(todayMood?.note || "");
  const [showSuccess, setShowSuccess] = useState(false);

  const toggleFactor = (factorId: string) => {
    setSelectedFactors((prev) =>
      prev.includes(factorId)
        ? prev.filter((f) => f !== factorId)
        : [...prev, factorId]
    );
  };

  const handleSave = () => {
    if (selectedMood) {
      saveMood(selectedMood, selectedFactors, note);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onBack();
      }, 1500);
    }
  };

  const getMoodColor = (moodId: string | null) => {
    const found = moods.find((m) => m.id === moodId);
    return found ? found.activeBg : "bg-muted";
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
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Como voce esta?
          </h1>
          <p className="text-xs text-muted-foreground">
            Registre seu humor de hoje
          </p>
        </div>
      </motion.div>

      {/* Success Message */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-primary rounded-2xl p-4 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <Heart size={24} className="text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-bold text-primary-foreground">
              Humor registrado!
            </p>
            <p className="text-xs text-primary-foreground/80">
              Cuidar da mente e essencial
            </p>
          </div>
        </motion.div>
      )}

      {/* Mood Selection */}
      <motion.div
        variants={item}
        className="bg-card rounded-2xl p-4 shadow-zora space-y-4"
      >
        <h3 className="text-sm font-bold text-foreground text-center">
          Selecione seu humor
        </h3>
        <div className="flex justify-center gap-3">
          {moods.map((mood) => {
            const isSelected = selectedMood === mood.id;
            return (
              <motion.button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                  isSelected
                    ? `${mood.activeBg} ring-2 ring-offset-2 ring-offset-card`
                    : `${mood.bg} hover:opacity-80`
                }`}
              >
                <mood.icon
                  size={28}
                  className={isSelected ? "text-white" : mood.color}
                />
                <span
                  className={`text-xs font-semibold ${isSelected ? "text-white" : "text-foreground"}`}
                >
                  {mood.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Factors */}
      {selectedMood && (
        <motion.div
          variants={item}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-4 shadow-zora space-y-3"
        >
          <h3 className="text-sm font-bold text-foreground">
            O que influenciou seu humor?
          </h3>
          <div className="flex flex-wrap gap-2">
            {factors.map((factor) => {
              const isSelected = selectedFactors.includes(factor.id);
              return (
                <button
                  key={factor.id}
                  onClick={() => toggleFactor(factor.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  <span className="text-xs font-medium">{factor.label}</span>
                  {isSelected && <Check size={14} />}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Notes */}
      {selectedMood && (
        <motion.div
          variants={item}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-4 shadow-zora space-y-3"
        >
          <h3 className="text-sm font-bold text-foreground">
            Quer adicionar algo?
          </h3>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Como foi seu dia? O que voce esta sentindo..."
            className="w-full p-3 rounded-xl bg-muted text-foreground text-sm placeholder:text-muted-foreground resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </motion.div>
      )}

      {/* Week Overview */}
      <motion.div
        variants={item}
        className="bg-card rounded-2xl p-4 shadow-zora space-y-3"
      >
        <h3 className="text-sm font-bold text-foreground">Ultima Semana</h3>
        <div className="flex justify-between">
          {weekMoods.map((day, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full ${getMoodColor(day.mood)} ${day.mood === null ? "border-2 border-dashed border-muted-foreground" : ""}`}
              />
              <span className="text-xs text-muted-foreground font-medium">
                {day.day}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Save Button */}
      {selectedMood && (
        <motion.div
          variants={item}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={handleSave}
            className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-zora-lg"
          >
            Salvar Humor
          </button>
        </motion.div>
      )}

      {/* Tips */}
      <motion.div
        variants={item}
        className="bg-zora-lavender/40 rounded-2xl p-4"
      >
        <p className="text-xs font-semibold text-foreground">
          Dica de Bem-Estar
        </p>
        <p className="text-sm text-foreground mt-1">
          Respirar profundamente por 1 minuto pode ajudar a reduzir a ansiedade
          e melhorar o humor.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default MoodScreen;
