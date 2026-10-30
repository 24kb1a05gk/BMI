import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  UserCheck,
  Activity,
  Save,
  Leaf,
  Drumstick,
  Scale,
  Sparkles,
  Menu,
  Info
} from 'lucide-react';
import { profileService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Sidebar from '../components/Sidebar';
import BMICard from '../components/BMICard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Profile() {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    height: '',
    weight: '',
    preference_type: 'vegetarian',
    health_goal: 'maintain_weight'
  });
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const { user, refreshUserData } = useAuth();
  const { success, error } = useToast();

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await profileService.getProfile();
      if (res.data.success && res.data.profile) {
        const p = res.data.profile;
        setProfileData(p);
        setFormData({
          age: p.age || '',
          gender: p.gender || 'male',
          height: p.height || '',
          weight: p.weight || '',
          preference_type: p.preference_type || 'vegetarian',
          health_goal: p.health_goal || 'maintain_weight'
        });
      }
    } catch (err) {
      console.error('Fetch profile error:', err);
      error(err.response?.data?.message || 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Live BMI calculated on user input
  const liveBMI = useMemo(() => {
    const h = parseFloat(formData.height);
    const w = parseFloat(formData.weight);
    if (!h || !w || h <= 50 || w <= 20) return null;

    const heightM = h / 100;
    const bmiVal = parseFloat((w / (heightM * heightM)).toFixed(1));

    let cat = 'Normal weight';
    let adv = 'Healthy baseline. Continue wholesome nourishment and moderate physical activity.';
    if (bmiVal < 18.5) {
      cat = 'Underweight';
      adv = 'Consider increasing nutrient-dense whole foods and protein to build healthy lean tissue.';
    } else if (bmiVal <= 24.9) {
      cat = 'Normal weight';
      adv = 'Weight is within optimal range. Maintain balanced meals and hydration.';
    } else if (bmiVal <= 29.9) {
      cat = 'Overweight';
      adv = 'Focus on high-fiber vegetables, lean proteins, portion control, and daily movement.';
    } else {
      cat = 'Obesity range';
      adv = 'Prioritize nutrient-dense lower calorie meals and consider consulting a healthcare professional.';
    }

    return {
      bmi: bmiVal,
      height: h,
      weight: w,
      category: cat,
      advice: adv
    };
  }, [formData.height, formData.weight]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await profileService.updateProfile(formData);
      if (res.data.success) {
        success('Profile and BMI updated successfully!');
        setProfileData(res.data.profile);
        refreshUserData();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F8F2]">
        <LoadingSpinner size="lg" text="Loading your profile data..." />
      </div>
    );
  }

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
            My Health Profile
          </span>
          <div className="w-8" />
        </div>

        <main className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Header */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DCEBDD] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#557C55] uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Account & Biometric Management</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#234B35] font-heading">
                My Health Profile
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Update your height, weight, food preferences, or fitness targets anytime.
              </p>
            </div>

            <div className="text-xs text-gray-500 self-start md:self-auto bg-[#F8F8F2] p-3 rounded-2xl border border-gray-200">
              Account Email: <strong className="text-[#234B35]">{user?.email}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Edit Form */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#DCEBDD] shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-[#234B35] font-heading flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#557C55]" />
                Personal Biometrics & Preferences
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Physical metrics row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                      Age (Years)
                    </label>
                    <input
                      type="number"
                      name="age"
                      min="10"
                      max="120"
                      value={formData.age}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#557C55] bg-[#F8F8F2]/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#557C55] bg-[#F8F8F2]/40"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      name="height"
                      step="0.1"
                      min="60"
                      max="250"
                      value={formData.height}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#557C55] bg-[#F8F8F2]/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      step="0.1"
                      min="20"
                      max="300"
                      value={formData.weight}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#557C55] bg-[#F8F8F2]/40"
                    />
                  </div>
                </div>

                {/* Primary Food Preference */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
                    Primary Food Preference
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer ${
                        formData.preference_type === 'vegetarian'
                          ? 'border-[#557C55] bg-[#DCEBDD]/50 text-[#234B35] font-bold'
                          : 'border-gray-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="preference_type"
                        value="vegetarian"
                        checked={formData.preference_type === 'vegetarian'}
                        onChange={handleChange}
                        className="text-[#557C55]"
                      />
                      <Leaf className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm">Vegetarian</span>
                    </label>

                    <label
                      className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer ${
                        formData.preference_type === 'non_vegetarian'
                          ? 'border-[#557C55] bg-[#DCEBDD]/50 text-[#234B35] font-bold'
                          : 'border-gray-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="preference_type"
                        value="non_vegetarian"
                        checked={formData.preference_type === 'non_vegetarian'}
                        onChange={handleChange}
                        className="text-[#557C55]"
                      />
                      <Drumstick className="w-4 h-4 text-rose-600" />
                      <span className="text-sm">Non-Vegetarian</span>
                    </label>
                  </div>
                </div>

                {/* Health Goal */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
                    Health Goal
                  </label>
                  <select
                    name="health_goal"
                    value={formData.health_goal}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#557C55] bg-[#F8F8F2]/40"
                  >
                    <option value="weight_loss">Weight Loss (Caloric Deficit & High Satiety)</option>
                    <option value="maintain_weight">Maintain Weight (Balanced Vitality)</option>
                    <option value="weight_gain">Weight Gain (Caloric Surplus & Protein)</option>
                  </select>
                </div>

                {/* Submit button */}
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#557C55] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#234B35] transition-all shadow-md shadow-[#557C55]/20 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Update Health Profile'}</span>
                  </button>
                </div>

              </form>
            </div>

            {/* Right Column: Live Recalculated BMI Card */}
            <div className="lg:col-span-5 space-y-6">
              <BMICard profile={liveBMI || profileData} />

              <div className="p-5 rounded-3xl bg-white border border-[#DCEBDD] shadow-sm space-y-2 text-xs text-gray-600 leading-relaxed">
                <div className="font-bold text-[#234B35] flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-[#557C55]" />
                  Automatic Dynamic Synchronization
                </div>
                <p>
                  Any updates to your weight or height will immediately recalculate your BMI and adjust all meal recommendations across Breakfast, Lunch, and Dinner.
                </p>
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
