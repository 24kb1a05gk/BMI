import React from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf,
  ShieldCheck,
  Heart,
  Activity,
  Award,
  Users,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero */}
      <section className="bg-gradient-to-b from-white to-[#F8F8F2] pt-16 pb-20 border-b border-[#DCEBDD]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DCEBDD] text-[#234B35] text-xs font-bold uppercase tracking-wider">
            <Leaf className="w-4 h-4 text-[#557C55]" />
            About NutriLife
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#234B35] font-heading tracking-tight leading-tight">
            Bridging Traditional Indian Nutrition with Modern Biometric Science
          </h1>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            NutriLife was founded on a simple observation: most diet apps promote generic, Westernized meal plans that clash with Indian culinary habits and dietary routines. We believe true sustainable health happens when nutrition respects your lifestyle.
          </p>
        </div>
      </section>

      {/* Philosophy Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#557C55] bg-[#DCEBDD] px-3.5 py-1.5 rounded-full">
            Our Core Principles
          </span>
          <h2 className="text-3xl font-extrabold text-[#234B35] font-heading">
            What Drives NutriLife
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-[#DCEBDD] shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#DCEBDD] text-[#234B35] flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#234B35] font-heading">
              Evidence-Based Screening
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              We leverage World Health Organization adult BMI classification standards to screen baseline caloric requirements, providing tailored meal choices rather than one-size-fits-all restrictions.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#DCEBDD] shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#557C55]/15 text-[#557C55] flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#234B35] font-heading">
              Indian Culinary Heritage
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              From comforting yellow moong dal to fermented idlis, paneer bhurji, and fresh fish curries, our database celebrates diverse regional ingredients without sacrificing flavor.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#DCEBDD] shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#234B35] font-heading">
              Weekly Dietary Autonomy
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Many households observe vegetarian days during the week while enjoying poultry or seafood on weekends. Our dynamic weekly preference scheduler was engineered specifically for this cultural flexibility.
            </p>
          </div>
        </div>
      </section>

      {/* Scientific Transparency */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#234B35] text-white grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-white/10 px-3 py-1 rounded-full">
              Medical Transparency
            </span>
            <h2 className="text-3xl font-bold font-heading">
              Understanding BMI & Screening Limits
            </h2>
            <p className="text-sm text-[#DCEBDD]/90 leading-relaxed">
              Body Mass Index (BMI) is calculated as weight in kilograms divided by the square of height in meters. While BMI is a widely accepted statistical indicator of body weight categories, it does not directly evaluate muscle mass, bone density, or metabolic markers.
            </p>
            <p className="text-sm text-[#DCEBDD]/90 leading-relaxed">
              NutriLife provides educational meal guidance to help maintain energy balance. We encourage everyone to work with healthcare professionals for clinical diagnosis or specialized medical conditions.
            </p>
          </div>

          <div className="bg-white/10 rounded-2xl p-6 border border-white/15 space-y-3">
            <h4 className="font-bold text-white text-base">Standard BMI Categories:</h4>
            <ul className="space-y-2 text-xs text-[#DCEBDD]">
              <li className="flex items-center justify-between pb-1 border-b border-white/10">
                <span>Below 18.5</span>
                <strong className="text-sky-300">Underweight Range</strong>
              </li>
              <li className="flex items-center justify-between pb-1 border-b border-white/10">
                <span>18.5 – 24.9</span>
                <strong className="text-emerald-300">Normal Healthy Weight</strong>
              </li>
              <li className="flex items-center justify-between pb-1 border-b border-white/10">
                <span>25.0 – 29.9</span>
                <strong className="text-amber-300">Overweight Range</strong>
              </li>
              <li className="flex items-center justify-between">
                <span>30.0 and above</span>
                <strong className="text-rose-300">Obesity Range</strong>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center max-w-xl mx-auto px-4 space-y-4">
        <h2 className="text-2xl font-bold text-[#234B35] font-heading">
          Ready to Personalize Your Daily Meals?
        </h2>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#557C55] text-white text-sm font-bold hover:bg-[#234B35] transition-colors shadow-sm"
        >
          <span>Get Started Free</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

    </div>
  );
}
