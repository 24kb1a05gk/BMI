import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  UtensilsCrossed,
  ArrowRight,
  Bookmark,
  Calendar,
  Flame,
  Menu,
  RefreshCw,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { dashboardService, mealService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Sidebar from '../components/Sidebar';
import BMICard from '../components/BMICard';
import NutritionCard from '../components/NutritionCard';
import MealCard from '../components/MealCard';
import WeeklySchedule from '../components/WeeklySchedule';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { success, error } = useToast();

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getDashboardData();
      if (res.data.success) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      error(err.response?.data?.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleToggleSave = async (mealId) => {
    try {
      const res = await mealService.saveMeal(mealId);
      if (res.data.success) {
        success(res.data.message);
        // Refresh dashboard to reflect updated saved states
        fetchDashboard();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update saved status.');
    }
  };

  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F8F2]">
        <LoadingSpinner size="lg" text="Loading your NutriLife health dashboard..." />
      </div>
    );
  }

  const {
    user: dashUser,
    profile,
    foodPreference,
    today,
    todayMeals,
    nutritionTarget,
    recentSavedMeals
  } = dashboardData || {};

  return (
    <div className="min-h-screen flex bg-[#F8F8F2]">
      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Mobile Bar */}
        <div className="lg:hidden p-4 bg-white border-b border-[#DCEBDD] flex items-center justify-between">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-xl border border-gray-200 text-[#25312A]"
            aria-label="Open navigation sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-base text-[#234B35] font-heading">NutriLife Dashboard</span>
          <div className="w-9 h-9 rounded-full bg-[#557C55]/15 text-[#234B35] font-bold text-xs flex items-center justify-center">
            {user?.full_name ? user.full_name.charAt(0) : 'U'}
          </div>
        </div>

        {/* Dashboard Body */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#DCEBDD] shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#557C55] uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>{today?.dateFormatted || 'Personalized Health Hub'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#234B35] font-heading">
                Welcome back, {dashUser?.full_name || user?.full_name}!
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Logged in as <span className="font-medium text-[#25312A]">{dashUser?.email || user?.email}</span>
                {' • '}
                Preference: <span className="capitalize font-semibold text-[#557C55]">{foodPreference?.replace('_', ' ')}</span>
                {' • '}
                Today's Menu:{' '}
                <span className={`capitalize font-semibold ${today?.preference === 'vegetarian' ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {today?.preference?.replace('_', ' ')}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchDashboard}
                className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-[#557C55] hover:border-[#557C55] transition-colors"
                title="Refresh Dashboard"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <Link
                to="/suggestions"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#557C55] text-white text-xs font-semibold hover:bg-[#234B35] transition-colors shadow-sm"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Explore Meals</span>
              </Link>
            </div>
          </div>

          {/* Metric Cards Row: BMI Card & Daily Macro Targets */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6">
              <BMICard profile={profile} />
            </div>
            <div className="lg:col-span-6">
              <NutritionCard targets={nutritionTarget} healthGoal={profile?.health_goal} />
            </div>
          </div>

          {/* Today's Tailored Meal Suggestions (Breakfast, Lunch, Dinner) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#234B35] font-heading flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5 text-[#557C55]" />
                  Today's Plate ({today?.day} - {today?.preference?.replace('_', ' ')})
                </h2>
                <p className="text-xs text-gray-500">
                  Recommended breakfast, lunch, and dinner tailored to your BMI and {profile?.health_goal?.replace('_', ' ')} goal
                </p>
              </div>

              <Link
                to="/suggestions"
                className="text-xs font-bold text-[#557C55] hover:text-[#234B35] flex items-center gap-1 hover:underline"
              >
                <span>View all suggestions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {todayMeals?.breakfast && (
                <MealCard meal={todayMeals.breakfast} onToggleSave={handleToggleSave} />
              )}
              {todayMeals?.lunch && (
                <MealCard meal={todayMeals.lunch} onToggleSave={handleToggleSave} />
              )}
              {todayMeals?.dinner && (
                <MealCard meal={todayMeals.dinner} onToggleSave={handleToggleSave} />
              )}
            </div>
          </div>

          {/* Weekly Schedule Snapshot */}
          <WeeklySchedule readonly={false} onScheduleSaved={fetchDashboard} />

          {/* Recently Saved Meals Section */}
          {recentSavedMeals && recentSavedMeals.length > 0 && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#234B35] font-heading flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-[#557C55]" />
                    Recently Saved Recipes
                  </h2>
                  <p className="text-xs text-gray-500">Your favorite quick-access collection</p>
                </div>

                <Link
                  to="/saved-meals"
                  className="text-xs font-bold text-[#557C55] hover:text-[#234B35] flex items-center gap-1 hover:underline"
                >
                  <span>View all saved</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recentSavedMeals.map((meal) => (
                  <MealCard key={meal.id} meal={meal} onToggleSave={handleToggleSave} />
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
