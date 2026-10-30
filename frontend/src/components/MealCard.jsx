import React, { useState } from 'react';
import { Flame, Dumbbell, Heart, Eye, BookmarkCheck } from 'lucide-react';
import RecipeModal from './RecipeModal';

export default function MealCard({ meal, onToggleSave }) {
  const [modalOpen, setModalOpen] = useState(false);
  const isVeg = meal.food_category === 'vegetarian';

  return (
    <>
      <div className="group bg-white rounded-3xl overflow-hidden border border-[#DCEBDD] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1">
        
        {/* Card Header & Image */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          <img
            src={meal.image_url}
            alt={meal.meal_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm ${
                isVeg ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              {isVeg ? 'Veg' : 'Non-Veg'}
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/95 text-[#234B35] capitalize shadow-sm backdrop-blur-xs">
              {meal.meal_type}
            </span>
          </div>

          {/* Quick Save Heart Icon on top-right */}
          {onToggleSave && (
            <button
              onClick={() => onToggleSave(meal.id)}
              className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
                meal.is_saved
                  ? 'bg-rose-600 text-white hover:bg-rose-700 scale-105'
                  : 'bg-white/85 text-gray-700 hover:text-rose-600 hover:bg-white'
              }`}
              title={meal.is_saved ? 'Remove from Saved' : 'Save Meal'}
              aria-label="Save Meal"
            >
              <Heart
                className={`w-4 h-4 ${
                  meal.is_saved ? 'fill-white stroke-white' : 'stroke-current'
                }`}
              />
            </button>
          )}

          {/* Calories Pill bottom left of image */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>{meal.calories} kcal</span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold text-lg text-[#25312A] font-heading group-hover:text-[#557C55] transition-colors line-clamp-1">
              {meal.meal_name}
            </h3>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
              {meal.benefits || meal.ingredients}
            </p>
          </div>

          {/* Macros Mini Grid */}
          <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-2xl bg-[#F8F8F2] border border-gray-100 text-center text-xs">
            <div>
              <div className="font-bold text-[#234B35]">{meal.protein}g</div>
              <div className="text-[10px] text-gray-500 font-medium">Protein</div>
            </div>
            <div>
              <div className="font-bold text-[#234B35]">{meal.carbohydrates}g</div>
              <div className="text-[10px] text-gray-500 font-medium">Carbs</div>
            </div>
            <div>
              <div className="font-bold text-[#234B35]">{meal.fat}g</div>
              <div className="text-[10px] text-gray-500 font-medium">Fats</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => setModalOpen(true)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#557C55] text-white text-xs font-semibold hover:bg-[#234B35] transition-colors shadow-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Recipe</span>
            </button>

            {onToggleSave && (
              <button
                onClick={() => onToggleSave(meal.id)}
                className={`px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  meal.is_saved
                    ? 'border-[#557C55] bg-[#DCEBDD] text-[#234B35]'
                    : 'border-gray-200 text-gray-600 hover:border-[#557C55] hover:text-[#557C55]'
                }`}
                title={meal.is_saved ? 'Saved' : 'Save Meal'}
              >
                {meal.is_saved ? (
                  <BookmarkCheck className="w-4 h-4 text-[#234B35]" />
                ) : (
                  <Heart className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Recipe Modal Component */}
      <RecipeModal
        meal={meal}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onToggleSave={onToggleSave}
      />
    </>
  );
}
