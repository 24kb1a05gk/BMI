import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, UtensilsCrossed, ArrowRight, Menu, Sparkles, Filter } from 'lucide-react';
import { mealService } from '../services/api';
import { useToast } from '../context/ToastContext';
import Sidebar from '../components/Sidebar';
import MealCard from '../components/MealCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function SavedMeals() {
  const [savedMeals, setSavedMeals] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const { success, error } = useToast();

  const fetchSavedMeals = useCallback(async () => {
    try {
      setLoading(true);
      const res = await mealService.getSavedMeals();
      if (res.data.success) {
        setSavedMeals(res.data.meals || []);
      }
    } catch (err) {
      console.error('Fetch saved meals error:', err);
      error(err.response?.data?.message || 'Failed to load saved meals.');
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchSavedMeals();
  }, [fetchSavedMeals]);

  const handleToggleSave = async (mealId) => {
    try {
      const res = await mealService.saveMeal(mealId);
      if (res.data.success) {
        success(res.data.message);
        // Remove from list if un-saved
        setSavedMeals((prev) => prev.filter((m) => m.id !== mealId));
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to remove meal.');
    }
  };

  const filtered = savedMeals.filter((m) => {
    if (filterType === 'all') return true;
    return m.meal_type === filterType;
  });

  return (
    <div className="min-h-screen flex bg-[#F8F8F2]">
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Header */}
        <div className="lg:hidden p-4 bg-white border-b border-[#DCEBDD] flex items-center justify-between">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-xl border border-gray-200 text-[#25312A]"
            aria-label="Open navigation sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-base text-[#234B35] font-heading">
            Saved Recipes
          </span>
          <div className="w-8" />
        </div>

        <main className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Header */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DCEBDD] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#557C55] uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Recipe Vault</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#234B35] font-heading">
                My Saved Healthy Meals
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                You have {savedMeals.length} saved recipes stored in your personal vault.
              </p>
            </div>

            {/* Meal type filter pills */}
            <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-2xl self-start md:self-auto text-xs font-semibold">
              {['all', 'breakfast', 'lunch', 'dinner'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3.5 py-2 rounded-xl capitalize transition-all ${
                    filterType === type
                      ? 'bg-[#557C55] text-white shadow-xs'
                      : 'text-gray-600 hover:text-[#234B35]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Meals Content */}
          {loading ? (
            <div className="bg-white rounded-3xl p-12 border border-[#DCEBDD] text-center">
              <LoadingSpinner size="lg" text="Retrieving your saved culinary collection..." />
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((meal) => (
                <MealCard key={meal.id} meal={meal} onToggleSave={handleToggleSave} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-[#DCEBDD] text-center space-y-4 max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#DCEBDD]/50 text-[#557C55] mx-auto flex items-center justify-center">
                <Bookmark className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#234B35] font-heading">
                No Saved Recipes Yet
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                When you discover meals you love in the suggestion engine or today's plate, tap the heart icon to save them here for easy meal prep.
              </p>
              <div className="pt-2">
                <Link
                  to="/suggestions"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#557C55] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#234B35] transition-colors shadow-sm"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>Discover Meal Suggestions</span>
                </Link>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
