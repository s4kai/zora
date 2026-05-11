import { MealType, useZora } from "@/contexts/ZoraContext";
import { motion } from "framer-motion";
import {
  Apple,
  ArrowLeft,
  Camera,
  Check,
  Clock,
  Coffee,
  Moon,
  Pizza,
  Plus,
  Salad,
  Sun,
  Utensils,
} from "lucide-react";
import { useState } from "react";

interface MealScreenProps {
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

const mealTypes = [
  {
    id: "breakfast" as MealType,
    label: "Cafe",
    icon: Coffee,
    bg: "bg-zora-peach",
  },
  { id: "lunch" as MealType, label: "Almoco", icon: Sun, bg: "bg-zora-mint" },
  {
    id: "snack" as MealType,
    label: "Lanche",
    icon: Apple,
    bg: "bg-zora-lavender",
  },
  { id: "dinner" as MealType, label: "Jantar", icon: Moon, bg: "bg-zora-peach" },
];

const foodCategories = [
  { id: "vegetables", label: "Vegetais", icon: Salad, color: "text-green-600" },
  { id: "fruits", label: "Frutas", icon: Apple, color: "text-orange-500" },
  { id: "protein", label: "Proteina", icon: Utensils, color: "text-red-500" },
  { id: "carbs", label: "Carboidratos", icon: Pizza, color: "text-yellow-600" },
  { id: "drinks", label: "Bebidas", icon: Coffee, color: "text-amber-700" },
];

const MealScreen = ({ onBack }: MealScreenProps) => {
  const { addMeal } = useZora();

  const [selectedMealType, setSelectedMealType] = useState<MealType | null>(
    null
  );
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [mealNote, setMealNote] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const toggleFood = (foodId: string) => {
    setSelectedFoods((prev) =>
      prev.includes(foodId)
        ? prev.filter((f) => f !== foodId)
        : [...prev, foodId]
    );
  };

  const handleSave = () => {
    if (selectedMealType && selectedFoods.length > 0) {
      addMeal(selectedMealType, selectedFoods, mealNote);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onBack();
      }, 1500);
    }
  };

  const currentTime = new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

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
            Registrar Refeicao
          </h1>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock size={12} />
            <span>{currentTime}</span>
          </div>
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
            <Check size={24} className="text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-bold text-primary-foreground">
              Refeicao registrada!
            </p>
            <p className="text-xs text-primary-foreground/80">
              Continue cuidando da sua alimentacao
            </p>
          </div>
        </motion.div>
      )}

      {/* Meal Type Selection */}
      <motion.div
        variants={item}
        className="bg-card rounded-2xl p-4 shadow-zora space-y-3"
      >
        <h3 className="text-sm font-bold text-foreground">Tipo de Refeicao</h3>
        <div className="grid grid-cols-4 gap-2">
          {mealTypes.map((meal) => {
            const isSelected = selectedMealType === meal.id;
            return (
              <button
                key={meal.id}
                onClick={() => setSelectedMealType(meal.id)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                  isSelected
                    ? "bg-primary/10 ring-2 ring-primary"
                    : `${meal.bg} hover:opacity-80`
                }`}
              >
                <meal.icon
                  size={22}
                  className={isSelected ? "text-primary" : "text-foreground"}
                />
                <span
                  className={`text-xs font-semibold ${isSelected ? "text-primary" : "text-foreground"}`}
                >
                  {meal.label}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Food Categories */}
      <motion.div
        variants={item}
        className="bg-card rounded-2xl p-4 shadow-zora space-y-3"
      >
        <h3 className="text-sm font-bold text-foreground">
          O que voce comeu?
        </h3>
        <div className="space-y-2">
          {foodCategories.map((food) => {
            const isSelected = selectedFoods.includes(food.id);
            return (
              <button
                key={food.id}
                onClick={() => toggleFood(food.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                  isSelected
                    ? "bg-primary/10 ring-2 ring-primary"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full ${isSelected ? "bg-primary" : "bg-card"} flex items-center justify-center`}
                >
                  <food.icon
                    size={20}
                    className={
                      isSelected ? "text-primary-foreground" : food.color
                    }
                  />
                </div>
                <span
                  className={`text-sm font-medium ${isSelected ? "text-primary" : "text-foreground"}`}
                >
                  {food.label}
                </span>
                {isSelected && (
                  <Check size={18} className="text-primary ml-auto" />
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Photo & Notes */}
      <motion.div
        variants={item}
        className="bg-card rounded-2xl p-4 shadow-zora space-y-3"
      >
        <h3 className="text-sm font-bold text-foreground">
          Detalhes (opcional)
        </h3>

        {/* Photo Button */}
        <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-all">
          <div className="w-10 h-10 rounded-full bg-zora-lavender flex items-center justify-center">
            <Camera size={20} className="text-foreground" />
          </div>
          <span className="text-sm font-medium text-foreground">
            Adicionar foto
          </span>
          <Plus size={18} className="text-muted-foreground ml-auto" />
        </button>

        {/* Notes */}
        <textarea
          value={mealNote}
          onChange={(e) => setMealNote(e.target.value)}
          placeholder="Notas sobre a refeicao..."
          className="w-full p-3 rounded-xl bg-muted text-foreground text-sm placeholder:text-muted-foreground resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </motion.div>

      {/* Save Button */}
      <motion.div variants={item}>
        <button
          onClick={handleSave}
          disabled={!selectedMealType || selectedFoods.length === 0}
          className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-zora-lg disabled:opacity-40 transition-opacity"
        >
          Salvar Refeicao
        </button>
      </motion.div>

      {/* Quick Tips */}
      <motion.div variants={item} className="bg-zora-peach/40 rounded-2xl p-4">
        <p className="text-xs font-semibold text-foreground">
          Dica Nutricional
        </p>
        <p className="text-sm text-foreground mt-1">
          Tente incluir pelo menos 3 cores diferentes no seu prato para garantir
          variedade de nutrientes.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default MealScreen;
