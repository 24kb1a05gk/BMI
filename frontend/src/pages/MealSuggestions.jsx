import React, { useState, useEffect, useCallback } from 'react';
import {
  UtensilsCrossed,
  Calendar,
  Clock,
  RefreshCw,
  Sparkles,
  Leaf,
  Drumstick,
  Info,
  Menu
} from 'lucide-react';
import { mealService } from '../services/api';
import { useToast } from '../context/ToastContext';
import Sidebar from '../components/Sidebar';
import MealCard from '../components/MealCard';
import LoadingSpinner from '../components/LoadingSpinner';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TIMES = [
  { id: 'breakfast', label: 'Morning (Breakfast)' },
  { id: 'lunch', label: 'Afternoon (Lunch)' },
  { id: 'dinner', label: 'Evening (Dinner)' }
];

export default function MealSuggestions() {
  const currentDayName = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
  const [selectedDay, setSelectedDay] = useState(currentDayName);
  const [selectedMealTime, setSelectedMealTime] = useState('breakfast');
  const [suggestions, setSuggestions] = useState([]);
  const [queryMeta, setQueryMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const { success, error } = useToast();

  const fetchSuggestions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await mealService.getSuggestions(selectedDay, selectedMealTime);
      if (res.data.success) {
        setSuggestions(res.data.meals || []);
        setQueryMeta(res.data.query);
      }
    } catch (err) {
      console.error('Fetch suggestions error:', err);
      error(err.response?.data?.message || 'Failed to load meal suggestions.');
    } finally {
      setLoading(false);
    }
  }, [selectedDay, selectedMealTime, error]);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  const handleToggleSave = async (mealId) => {
    try {
      const res = await mealService.saveMeal(mealId);
      if (res.data.success) {
        success(res.data.message);
        // Update local state
        setSuggestions((prev) =>
          prev.map((m) =>
            m.id === mealId ? { ...m, is_saved: res.data.is_saved } : m
          )
        );
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update saved status.');
    }
  };

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
            Personalized Suggestions
          </span>
          <div className="w-8" />
        </div>

        <main className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Header Banner */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DCEBDD] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#557C55] uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Smart Recommendation Engine</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#234B35] font-heading">
                Personalized Meal Suggestions
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Curated around your BMI, selected day dietary mode, and caloric priorities
              </p>
            </div>

            <button
              onClick={fetchSuggestions}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#557C55] text-[#234B35] hover:bg-[#DCEBDD]/50 text-xs font-semibold transition-colors self-start md:self-auto"
            >
              <RefreshCw className="w-4 h-4 text-[#557C55]" />
              <span>Refresh Suggestions</span>
            </button>
          </div>

          {/* Interactive Filters Strip */}
          <div className="bg-white p-6 rounded-3xl border border-[#DCEBDD] shadow-sm space-y-5">
            
            {/* 1. Day of the Week Selector */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-600">
                <Calendar className="w-4 h-4 text-[#557C55]" />
                <span>Select Day of the Week</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {DAYS.map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                      selectedDay === day
                        ? 'bg-[#557C55] text-white shadow-xs'
                        : 'bg-[#F8F8F2] text-gray-600 hover:bg-[#DCEBDD]/40'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Meal Time Selector */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-600">
                <Clock className="w-4 h-4 text-[#557C55]" />
                <span>Select Meal Time</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {MEAL_TIMES.map((mt) => (
                  <button
                    key={mt.id}
                    onClick={() => setSelectedMealTime(mt.id)}
                    className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      selectedMealTime === mt.id
                        ? 'bg-[#234B35] text-white shadow-sm'
                        : 'bg-[#F8F8F2] text-gray-700 hover:bg-[#DCEBDD]/40 border border-transparent'
                    }`}
                  >
                    <UtensilsCrossed className="w-4 h-4" />
                    <span>{mt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Mode Explanation Bar */}
            {queryMeta && (
              <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Dietary Filter for {selectedDay}:</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      queryMeta.target_category === 'vegetarian'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {queryMeta.target_category === 'vegetarian' ? (
                      <Leaf className="w-3.5 h-3.5" />
                    ) : (
                      <Drumstick className="w-3.5 h-3.5" />
                    )}
                    {queryMeta.target_category?.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-gray-500">
                  Target Goal:{' '}
                  <span className="font-semibold text-[#234B35] capitalize">
                    {queryMeta.health_goal?.replace('_', ' ')}
                  </span>
                  {' • '}
                  BMI: <span className="font-semibold text-[#234B35]">{queryMeta.bmi}</span>
                </div>
              </div>
            )}
          </div>

          {/* Suggestions Content Area */}
          {loading ? (
            <div className="bg-white rounded-3xl p-12 border border-[#DCEBDD] text-center">
              <LoadingSpinner size="lg" text="Searching 40+ healthy Indian dishes matching your criteria..." />
            </div>
          ) : suggestions.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>
                  Showing <strong>{suggestions.length}</strong> top meal suggestions for{' '}
                  <strong className="capitalize">{selectedDay} {selectedMealTime}</strong>
                </span>
                <span>Sorted for optimal satiety & macro alignment</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suggestions.map((meal) => (
                  <MealCard key={meal.id} meal={meal} onToggleSave={handleToggleSave} />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-[#DCEBDD] text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 mx-auto flex items-center justify-center">
                <UtensilsCrossed className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#234B35]">No Meals Found</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                No matching meal records found for this combination. Try changing the meal time or day filter.
              </p>
            </div>
          )}

          {/* Educational Note */}
          <div className="p-4 rounded-2xl bg-[#DCEBDD]/30 border border-[#DCEBDD] flex items-center gap-3 text-xs text-gray-600">
            <Info className="w-4 h-4 text-[#557C55] shrink-0" />
            <span>
              All portion sizes and nutrition metrics are computed for standard single-person adult servings using wholesome Indian cooking techniques.
            </span>
          </div>

        </main>
      </div>
    </div>
  );
}
