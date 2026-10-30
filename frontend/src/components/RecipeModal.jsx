import React from 'react';
import { X, Flame, Dumbbell, Wheat, Droplets, CheckCircle, Heart, BookmarkCheck } from 'lucide-react';

export default function RecipeModal({ meal, isOpen, onClose, onToggleSave }) {
  if (!isOpen || !meal) return null;

  const isVeg = meal.food_category === 'vegetarian';

  // Format ingredients if comma-separated or text
  const ingredientsList = meal.ingredients
    ? meal.ingredients.split(',').map((i) => i.trim()).filter(Boolean)
    : [];

  // Format steps if numbered or period separated
  const rawSteps = meal.preparation_steps || '';
  const stepsList = rawSteps
    .split(/\d+\.\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#DCEBDD] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero Image Section */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden rounded-t-3xl bg-gray-100">
          <img
            src={meal.image_url}
            alt={meal.meal_name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 backdrop-blur-md transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges on Hero */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isVeg ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white" />
              {isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-[#234B35] capitalize backdrop-blur-md">
              {meal.meal_type}
            </span>
          </div>

          {/* Title on Hero */}
          <div className="absolute bottom-4 left-6 right-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-heading leading-tight drop-shadow-md">
              {meal.meal_name}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Quick Action & Macros Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div className="grid grid-cols-4 gap-2.5 sm:gap-4 flex-1">
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100 text-center">
                <div className="flex items-center justify-center text-amber-600 mb-1">
                  <Flame className="w-4 h-4" />
                </div>
                <div className="text-base font-bold text-amber-900">{meal.calories}</div>
                <div className="text-[10px] uppercase font-semibold text-amber-700 tracking-wider">Calories</div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center">
                <div className="flex items-center justify-center text-emerald-600 mb-1">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <div className="text-base font-bold text-emerald-900">{meal.protein}g</div>
                <div className="text-[10px] uppercase font-semibold text-emerald-700 tracking-wider">Protein</div>
              </div>

              <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-100 text-center">
                <div className="flex items-center justify-center text-sky-600 mb-1">
                  <Wheat className="w-4 h-4" />
                </div>
                <div className="text-base font-bold text-sky-900">{meal.carbohydrates}g</div>
                <div className="text-[10px] uppercase font-semibold text-sky-700 tracking-wider">Carbs</div>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-center">
                <div className="flex items-center justify-center text-indigo-600 mb-1">
                  <Droplets className="w-4 h-4" />
                </div>
                <div className="text-base font-bold text-indigo-900">{meal.fat}g</div>
                <div className="text-[10px] uppercase font-semibold text-indigo-700 tracking-wider">Fats</div>
              </div>
            </div>

            {/* Save Button */}
            {onToggleSave && (
              <button
                onClick={() => onToggleSave(meal.id)}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm transition-all sm:self-center shrink-0 ${
                  meal.is_saved
                    ? 'bg-[#234B35] text-white shadow-md'
                    : 'bg-[#DCEBDD] text-[#234B35] hover:bg-[#557C55] hover:text-white'
                }`}
              >
                {meal.is_saved ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-emerald-300" />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4" />
                    <span>Save Recipe</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Health Benefits Section */}
          <div className="p-4 rounded-2xl bg-[#DCEBDD]/40 border border-[#DCEBDD] space-y-1.5">
            <div className="flex items-center gap-2 text-xs uppercase font-bold text-[#234B35] tracking-wider">
              <CheckCircle className="w-4 h-4 text-[#557C55]" />
              Nutritional & Health Benefits
            </div>
            <p className="text-sm text-[#25312A] leading-relaxed font-medium">
              {meal.benefits}
            </p>
          </div>

          {/* Ingredients Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-[#234B35] font-heading">
              Ingredients
            </h3>
            <div className="flex flex-wrap gap-2">
              {ingredientsList.map((item, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium text-[#25312A]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Preparation Instructions */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-[#234B35] font-heading">
              Preparation Steps
            </h3>
            <div className="space-y-3">
              {(stepsList.length > 0 ? stepsList : [rawSteps]).map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-[#F8F8F2] border border-gray-100">
                  <div className="w-6 h-6 rounded-full bg-[#557C55] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-sm text-[#25312A] leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-6 bg-gray-50 rounded-b-3xl border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 font-semibold text-sm text-[#25312A] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
