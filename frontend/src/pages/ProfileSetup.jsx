import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Leaf,
  Drumstick,
  TrendingDown,
  TrendingUp,
  Scale,
  Sparkles,
  Info
} from 'lucide-react';
import { profileService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function ProfileSetup() {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    height: '',
    weight: '',
    preference_type: 'vegetarian',
    health_goal: 'maintain_weight'
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { markProfileCreated } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMsg('');
  };

  // Live BMI calculation
  const liveBMI = useMemo(() => {
    const h = parseFloat(formData.height);
    const w = parseFloat(formData.weight);
    if (!h || !w || h <= 50 || w <= 20) return null;

    const heightM = h / 100;
    const val = parseFloat((w / (heightM * heightM)).toFixed(1));

    let cat = 'Normal weight';
    let color = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (val < 18.5) {
      cat = 'Underweight';
      color = 'text-sky-700 bg-sky-50 border-sky-200';
    } else if (val <= 24.9) {
      cat = 'Normal weight';
      color = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    } else if (val <= 29.9) {
      cat = 'Overweight';
      color = 'text-amber-700 bg-amber-50 border-amber-200';
    } else {
      cat = 'Obesity range';
      color = 'text-rose-700 bg-rose-50 border-rose-200';
    }

    return { value: val, category: cat, style: color };
  }, [formData.height, formData.weight]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.age || !formData.height || !formData.weight) {
      setErrorMsg('Please enter your age, height, and weight.');
      return;
    }

    const h = parseFloat(formData.height);
    const w = parseFloat(formData.weight);
    if (h < 60 || h > 250 || w < 20 || w > 300) {
      setErrorMsg('Please provide a realistic height (60-250 cm) and weight (20-300 kg).');
      return;
    }

    try {
      setLoading(true);
      const res = await profileService.createProfile(formData);
      if (res.data.success) {
        success('Health profile established! Calculating your optimal meal roadmap...');
        markProfileCreated(res.data.profile);
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save health profile.';
      setErrorMsg(msg);
      error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DCEBDD] text-[#234B35] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-[#557C55]" />
          Step 2 of 2: Personalization
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#234B35] font-heading">
          Configure Your Health Profile
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
          We use your metrics to calculate your Body Mass Index (BMI) and curate nutritionally aligned Indian meals.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Physical Metrics Grid */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DCEBDD] shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-[#234B35] font-heading flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#557C55]" />
            Body & Biometric Metrics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Age */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                Age (Years) *
              </label>
              <input
                type="number"
                name="age"
                min="10"
                max="120"
                value={formData.age}
                onChange={handleChange}
                placeholder="e.g. 26"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#557C55] text-sm text-[#25312A] bg-[#F8F8F2]/50"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                Gender (Optional)
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#557C55] text-sm text-[#25312A] bg-[#F8F8F2]/50"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>

            {/* Height */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                Height (cm) *
              </label>
              <input
                type="number"
                name="height"
                step="0.1"
                min="60"
                max="250"
                value={formData.height}
                onChange={handleChange}
                placeholder="e.g. 172"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#557C55] text-sm text-[#25312A] bg-[#F8F8F2]/50"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                Weight (kg) *
              </label>
              <input
                type="number"
                name="weight"
                step="0.1"
                min="20"
                max="300"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g. 68"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#557C55] text-sm text-[#25312A] bg-[#F8F8F2]/50"
              />
            </div>
          </div>

          {/* Live BMI Preview Card */}
          {liveBMI ? (
            <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${liveBMI.style}`}>
              <div>
                <span className="text-xs uppercase tracking-wider font-bold">Estimated Live BMI</span>
                <div className="flex items-baseline gap-3 mt-0.5">
                  <span className="text-3xl font-extrabold font-heading">{liveBMI.value}</span>
                  <span className="text-sm font-bold uppercase tracking-wide">
                    {liveBMI.category}
                  </span>
                </div>
              </div>
              <p className="text-xs max-w-xs leading-relaxed opacity-90">
                Formula: Weight (kg) / [Height (m)]²
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#F8F8F2] border border-dashed border-gray-300 text-center text-xs text-gray-500">
              Enter your height and weight above to see your real-time BMI screening score.
            </div>
          )}

          <div className="flex items-center gap-2 text-[11px] text-gray-400 italic">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>BMI is an educational screening metric, not a definitive clinical diagnosis.</span>
          </div>
        </div>

        {/* Dietary Preference & Health Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Primary Food Preference */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DCEBDD] shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-[#234B35] font-heading flex items-center gap-2">
              <Leaf className="w-5 h-5 text-[#557C55]" />
              Primary Food Preference
            </h2>
            <p className="text-xs text-gray-500">
              Choose your baseline dietary restriction:
            </p>

            <div className="space-y-3">
              {/* Vegetarian Option */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  formData.preference_type === 'vegetarian'
                    ? 'border-[#557C55] bg-[#DCEBDD]/50 shadow-xs'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="preference_type"
                  value="vegetarian"
                  checked={formData.preference_type === 'vegetarian'}
                  onChange={handleChange}
                  className="mt-1 text-[#557C55] focus:ring-[#557C55]"
                />
                <div>
                  <div className="font-bold text-sm text-[#234B35] flex items-center gap-1.5">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                    Vegetarian
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                    100% plant-based and dairy. You will never be shown non-vegetarian recommendations.
                  </p>
                </div>
              </label>

              {/* Non-Vegetarian Option */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  formData.preference_type === 'non_vegetarian'
                    ? 'border-[#557C55] bg-[#DCEBDD]/50 shadow-xs'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="preference_type"
                  value="non_vegetarian"
                  checked={formData.preference_type === 'non_vegetarian'}
                  onChange={handleChange}
                  className="mt-1 text-[#557C55] focus:ring-[#557C55]"
                />
                <div>
                  <div className="font-bold text-sm text-[#234B35] flex items-center gap-1.5">
                    <Drumstick className="w-4 h-4 text-rose-600" />
                    Non-Vegetarian
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                    Includes eggs, poultry, and fish. Unlocks the interactive weekly calendar to schedule vegetarian vs. non-veg days.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Health Goal */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DCEBDD] shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-[#234B35] font-heading flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#557C55]" />
              Primary Health Goal
            </h2>
            <p className="text-xs text-gray-500">
              Calibrates your daily calories and macro distribution:
            </p>

            <div className="space-y-3">
              {/* Weight Loss */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  formData.health_goal === 'weight_loss'
                    ? 'border-[#557C55] bg-[#DCEBDD]/50 shadow-xs'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="health_goal"
                  value="weight_loss"
                  checked={formData.health_goal === 'weight_loss'}
                  onChange={handleChange}
                  className="mt-1 text-[#557C55] focus:ring-[#557C55]"
                />
                <div>
                  <div className="font-bold text-sm text-[#234B35] flex items-center gap-1.5">
                    <TrendingDown className="w-4 h-4 text-emerald-600" />
                    Weight Loss
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Caloric deficit prioritising high-satiety fiber & lean proteins.
                  </p>
                </div>
              </label>

              {/* Maintain Weight */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  formData.health_goal === 'maintain_weight'
                    ? 'border-[#557C55] bg-[#DCEBDD]/50 shadow-xs'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="health_goal"
                  value="maintain_weight"
                  checked={formData.health_goal === 'maintain_weight'}
                  onChange={handleChange}
                  className="mt-1 text-[#557C55] focus:ring-[#557C55]"
                />
                <div>
                  <div className="font-bold text-sm text-[#234B35] flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-[#557C55]" />
                    Maintain Weight
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Energy balance focusing on digestive vitality and micronutrients.
                  </p>
                </div>
              </label>

              {/* Weight Gain */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  formData.health_goal === 'weight_gain'
                    ? 'border-[#557C55] bg-[#DCEBDD]/50 shadow-xs'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="health_goal"
                  value="weight_gain"
                  checked={formData.health_goal === 'weight_gain'}
                  onChange={handleChange}
                  className="mt-1 text-[#557C55] focus:ring-[#557C55]"
                />
                <div>
                  <div className="font-bold text-sm text-[#234B35] flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                    Weight Gain / Muscle Building
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Nutrient-dense caloric surplus rich in healthy fats and proteins.
                  </p>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Submit Action */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-[#557C55] text-white font-bold text-base hover:bg-[#234B35] transition-all shadow-lg shadow-[#557C55]/25 hover:-translate-y-0.5 disabled:opacity-50"
          >
            <span>{loading ? 'Finalizing Profile...' : 'Complete Setup & Open Dashboard'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </form>
    </div>
  );
}
