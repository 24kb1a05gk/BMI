import React from 'react';
import { Activity, Info, ShieldAlert, Sparkles } from 'lucide-react';

export default function BMICard({ profile }) {
  if (!profile) return null;

  const bmi = profile.bmi || 22.0;

  // Determine category and style
  let category = 'Normal weight';
  let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  let gaugePercent = 50; // 0 to 100 on visual gauge

  if (bmi < 18.5) {
    category = 'Underweight';
    badgeColor = 'bg-sky-100 text-sky-800 border-sky-300';
    gaugePercent = Math.max(10, Math.min(25, (bmi / 18.5) * 25));
  } else if (bmi <= 24.9) {
    category = 'Normal weight';
    badgeColor = 'bg-[#DCEBDD] text-[#234B35] border-[#557C55]/40';
    gaugePercent = 25 + ((bmi - 18.5) / (24.9 - 18.5)) * 25;
  } else if (bmi <= 29.9) {
    category = 'Overweight';
    badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
    gaugePercent = 50 + ((bmi - 25.0) / (29.9 - 25.0)) * 25;
  } else {
    category = 'Obesity range';
    badgeColor = 'bg-rose-100 text-rose-800 border-rose-300';
    gaugePercent = Math.min(95, 75 + ((bmi - 30.0) / 10.0) * 20);
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#DCEBDD] shadow-sm space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#DCEBDD] flex items-center justify-center text-[#234B35]">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-[#234B35] text-lg font-heading">
              BMI Health Metric
            </h3>
            <p className="text-xs text-gray-500">Body Mass Index screening status</p>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${badgeColor}`}
        >
          {profile.category || category}
        </span>
      </div>

      {/* Numerical Stats & Physical metrics */}
      <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#F8F8F2] border border-gray-100 text-center">
        <div>
          <div className="text-2xl font-extrabold text-[#234B35] font-heading">{bmi}</div>
          <div className="text-[11px] text-gray-500 font-medium">Your BMI</div>
        </div>
        <div>
          <div className="text-lg font-bold text-[#25312A]">{profile.height} cm</div>
          <div className="text-[11px] text-gray-500 font-medium">Height</div>
        </div>
        <div>
          <div className="text-lg font-bold text-[#25312A]">{profile.weight} kg</div>
          <div className="text-[11px] text-gray-500 font-medium">Weight</div>
        </div>
      </div>

      {/* Visual Segmented Gauge */}
      <div className="space-y-2">
        <div className="flex justify-between text-[11px] font-semibold text-gray-400">
          <span>&lt; 18.5 Under</span>
          <span>18.5 - 24.9 Normal</span>
          <span>25 - 29.9 Over</span>
          <span>30+ Obese</span>
        </div>

        {/* Gauge bar */}
        <div className="relative h-3 w-full bg-gray-100 rounded-full overflow-hidden flex">
          <div className="h-full w-1/4 bg-sky-400" title="Underweight (<18.5)" />
          <div className="h-full w-1/4 bg-[#557C55]" title="Normal (18.5-24.9)" />
          <div className="h-full w-1/4 bg-amber-400" title="Overweight (25-29.9)" />
          <div className="h-full w-1/4 bg-rose-500" title="Obesity range (30+)" />
        </div>

        {/* Indicator marker */}
        <div className="relative w-full h-4">
          <div
            className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-500"
            style={{ left: `${Math.min(95, Math.max(5, gaugePercent))}%` }}
          >
            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-[#234B35]" />
            <span className="text-[10px] font-bold text-[#234B35]">{bmi}</span>
          </div>
        </div>
      </div>

      {/* Advice Box */}
      <div className="p-3.5 rounded-2xl bg-[#DCEBDD]/40 border border-[#DCEBDD] flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-[#557C55] shrink-0 mt-0.5" />
        <p className="text-xs text-[#25312A] leading-relaxed">
          {profile.advice ||
            'Maintain a wholesome balanced routine with adequate fiber, lean protein, and daily hydration.'}
        </p>
      </div>

      {/* Educational Medical Disclaimer */}
      <div className="flex items-center gap-2 text-[11px] text-gray-500 italic">
        <Info className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <span>BMI is a screening tool, not a medical diagnosis of body fatness or health.</span>
      </div>
    </div>
  );
}
