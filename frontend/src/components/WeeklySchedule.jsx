import React, { useState, useEffect } from 'react';
import { Calendar, Check, Save, Sparkles, Leaf, Drumstick, AlertCircle } from 'lucide-react';
import { preferenceService } from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from './LoadingSpinner';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function WeeklySchedule({ readonly = false, onScheduleSaved }) {
  const [preferenceType, setPreferenceType] = useState('vegetarian');
  const [schedule, setSchedule] = useState({
    Monday: 'vegetarian',
    Tuesday: 'vegetarian',
    Wednesday: 'vegetarian',
    Thursday: 'vegetarian',
    Friday: 'vegetarian',
    Saturday: 'vegetarian',
    Sunday: 'vegetarian'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const res = await preferenceService.getPreferences();
      if (res.data.success) {
        setPreferenceType(res.data.preference_type);
        if (res.data.weekly_preferences) {
          setSchedule(res.data.weekly_preferences);
        }
      }
    } catch (err) {
      console.error('Failed to load preferences:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDayPreference = (day) => {
    if (readonly || preferenceType === 'vegetarian') return;

    setSchedule((prev) => {
      const current = prev[day] || 'non_vegetarian';
      const updated = current === 'vegetarian' ? 'non_vegetarian' : 'vegetarian';
      return { ...prev, [day]: updated };
    });
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await preferenceService.updateWeeklySchedule(schedule);
      if (res.data.success) {
        success('Weekly meal schedule updated and saved to MySQL!');
        setHasUnsavedChanges(false);
        if (onScheduleSaved) onScheduleSaved(schedule);
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to save weekly schedule.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-[#DCEBDD]">
        <LoadingSpinner text="Loading your dietary schedule..." />
      </div>
    );
  }

  const isStrictVeg = preferenceType === 'vegetarian';

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#DCEBDD] shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#DCEBDD] flex items-center justify-center text-[#234B35]">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-[#234B35] text-lg font-heading">
              Weekly Meal Preference Calendar
            </h3>
            <p className="text-xs text-gray-500">
              {isStrictVeg
                ? 'Your account is in Pure Vegetarian mode (locked to 100% vegetarian meals)'
                : 'Customize vegetarian and non-vegetarian days to match your lifestyle'}
            </p>
          </div>
        </div>

        {!readonly && !isStrictVeg && (
          <button
            onClick={handleSave}
            disabled={saving || !hasUnsavedChanges}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-all ${
              hasUnsavedChanges
                ? 'bg-[#557C55] text-white hover:bg-[#234B35] shadow-sm animate-pulse'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : hasUnsavedChanges ? 'Save Changes' : 'Saved'}</span>
          </button>
        )}
      </div>

      {/* Notice Banner for Pure Vegetarian Users */}
      {isStrictVeg && (
        <div className="p-4 rounded-2xl bg-[#DCEBDD]/60 border border-[#557C55]/30 flex items-start gap-3">
          <Leaf className="w-5 h-5 text-[#557C55] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-[#234B35]">Pure Vegetarian Diet Active</h4>
            <p className="text-xs text-[#25312A] mt-0.5 leading-relaxed">
              Because you selected <strong>Vegetarian</strong> as your primary diet, all 7 days are automatically locked to vegetarian meals. Non-vegetarian meal suggestions will never be shown on your account. To unlock day-by-day customization, change your primary preference to Non-Vegetarian in your Profile settings.
            </p>
          </div>
        </div>
      )}

      {/* Notice Banner for Non-Veg Users */}
      {!isStrictVeg && (
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-900 leading-relaxed">
            Click on any day below to toggle between <strong>Vegetarian</strong> and <strong>Non-Vegetarian</strong>. The NutriLife suggestion engine uses these daily preferences to recommend the right meals each day.
          </p>
        </div>
      )}

      {/* 7-Day Interactive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
        {DAYS.map((day) => {
          const isDayVeg = isStrictVeg || schedule[day] === 'vegetarian';

          return (
            <div
              key={day}
              onClick={() => toggleDayPreference(day)}
              className={`p-4 rounded-2xl border text-center transition-all ${
                readonly || isStrictVeg ? '' : 'cursor-pointer hover:shadow-md hover:-translate-y-0.5'
              } ${
                isDayVeg
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50/60 border-rose-200 text-rose-950'
              }`}
            >
              <div className="text-xs font-bold uppercase tracking-wider mb-2 text-gray-500">
                {day.substring(0, 3)}
              </div>

              <div
                className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center text-white mb-2 shadow-xs ${
                  isDayVeg ? 'bg-emerald-600' : 'bg-rose-600'
                }`}
              >
                {isDayVeg ? <Leaf className="w-5 h-5" /> : <Drumstick className="w-5 h-5" />}
              </div>

              <div className="font-bold text-sm">
                {isDayVeg ? 'Veg' : 'Non-Veg'}
              </div>

              {!readonly && !isStrictVeg && (
                <div className="text-[10px] text-gray-400 mt-1 font-medium">
                  Click to switch
                </div>
              )}
            </div>
          );
        })}
      </div>

      {hasUnsavedChanges && (
        <div className="flex items-center justify-end gap-3 pt-2">
          <span className="text-xs font-medium text-amber-700 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            You have unsaved changes in your schedule
          </span>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-[#557C55] text-white text-xs font-semibold hover:bg-[#234B35] transition-colors"
          >
            {saving ? 'Saving...' : 'Save Schedule'}
          </button>
        </div>
      )}
    </div>
  );
}
