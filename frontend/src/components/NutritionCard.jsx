import React from 'react';
import { Flame, Dumbbell, Wheat, Droplets, Target } from 'lucide-react';

export default function NutritionCard({ targets, healthGoal }) {
  const goalLabels = {
    weight_loss: 'Weight Loss (Caloric Deficit)',
    weight_gain: 'Weight Gain (Caloric Surplus)',
    maintain_weight: 'Weight Maintenance (Energy Balance)'
  };

  const calories = targets?.dailyCalories || 2000;
  const protein = targets?.protein || 80;
  const carbs = targets?.carbs || 240;
  const fats = targets?.fats || 55;

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#DCEBDD] shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-[#234B35] text-lg font-heading">
              Daily Nutrition Blueprint
            </h3>
            <p className="text-xs text-gray-500">
              Personalized macro targets based on your goal
            </p>
          </div>
        </div>

        {healthGoal && (
          <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#DCEBDD] text-[#234B35]">
            {goalLabels[healthGoal] || healthGoal}
          </span>
        )}
      </div>

      {/* Primary Calories Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#234B35] to-[#557C55] text-white flex items-center justify-between shadow-xs">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-emerald-200">
            Target Caloric Intake
          </span>
          <div className="text-3xl font-extrabold font-heading mt-0.5">
            {calories} <span className="text-sm font-normal text-emerald-100">kcal / day</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300">
          <Flame className="w-6 h-6" />
        </div>
      </div>

      {/* Macronutrient breakdown */}
      <div className="grid grid-cols-3 gap-3">
        {/* Protein */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold">
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Protein</span>
          </div>
          <div className="text-xl font-bold text-emerald-950">{protein}g</div>
          <div className="text-[10px] text-gray-500 font-medium">Tissue & Muscle</div>
        </div>

        {/* Carbohydrates */}
        <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-1">
          <div className="flex items-center gap-1.5 text-sky-700 text-xs font-semibold">
            <Wheat className="w-3.5 h-3.5" />
            <span>Carbs</span>
          </div>
          <div className="text-xl font-bold text-sky-950">{carbs}g</div>
          <div className="text-[10px] text-gray-500 font-medium">Clean Energy</div>
        </div>

        {/* Fats */}
        <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-700 text-xs font-semibold">
            <Droplets className="w-3.5 h-3.5" />
            <span>Good Fats</span>
          </div>
          <div className="text-xl font-bold text-amber-950">{fats}g</div>
          <div className="text-[10px] text-gray-500 font-medium">Hormone Health</div>
        </div>
      </div>
    </div>
  );
}
