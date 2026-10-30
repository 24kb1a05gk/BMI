import React, { useState } from 'react';
import { CalendarDays, Sparkles, Menu, ShieldCheck } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import WeeklySchedule from '../components/WeeklySchedule';

export default function WeeklySchedulePage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
            Weekly Schedule
          </span>
          <div className="w-8" />
        </div>

        <main className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Header */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DCEBDD] shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#557C55] uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Lifestyle Routine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#234B35] font-heading">
              Manage Your 7-Day Dietary Schedule
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 max-w-2xl leading-relaxed">
              Tailor your meal plan around religious observances, fasting days, weekend non-veg traditions, or personal wellness habits. NutriLife syncs every day with your preferences.
            </p>
          </div>

          {/* Interactive Weekly Component */}
          <WeeklySchedule readonly={false} />

          {/* Educational Insights Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-[#DCEBDD] shadow-sm space-y-3">
              <h3 className="font-bold text-base text-[#234B35] font-heading flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#557C55]" />
                How the Schedule Controls Meal Generation
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                When you browse <strong>Meal Suggestions</strong> or open your <strong>Dashboard</strong>, the NutriLife backend queries your configured day schedule. On designated vegetarian days, non-veg meals are completely filtered out, ensuring you only receive high-protein vegetarian suggestions.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#DCEBDD] shadow-sm space-y-3">
              <h3 className="font-bold text-base text-[#234B35] font-heading flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-[#557C55]" />
                Modifying Selections Anytime
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Plans change! You can update your days whenever you want. Simply tap the day cards above to toggle between Veg and Non-Veg, click <strong>Save Changes</strong>, and your preferences are permanently stored in MySQL.
              </p>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
