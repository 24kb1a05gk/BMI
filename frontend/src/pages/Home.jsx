import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf,
  ArrowRight,
  Activity,
  CalendarDays,
  Utensils,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Heart,
  Star,
  Flame,
  Dumbbell
} from 'lucide-react';

export default function Home() {
  const [previewTab, setPreviewTab] = useState('breakfast');

  const previewMeals = {
    breakfast: [
      {
        name: 'Idli & Sambar',
        category: 'Veg',
        calories: 290,
        protein: 9.5,
        desc: 'Traditional steamed fermented rice cakes with vegetable lentil broth, rich in gut-healthy probiotics.',
        img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80'
      },
      {
        name: 'Moong Dal Chilla',
        category: 'Veg',
        calories: 240,
        protein: 14.0,
        desc: 'Savory split yellow moong crepes packed with plant protein, fresh onions, and grated paneer.',
        img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80'
      },
      {
        name: 'Boiled Eggs with Whole Wheat Toast',
        category: 'Non-Veg',
        calories: 310,
        protein: 19.0,
        desc: 'Farm eggs paired with fiber-rich 100% whole wheat bread and cracked black pepper for maximum mental focus.',
        img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80'
      }
    ],
    lunch: [
      {
        name: 'Brown Rice & Dal Tadka',
        category: 'Veg',
        calories: 410,
        protein: 15.0,
        desc: 'Wholesome brown basmati rice combined with protein-packed yellow lentils and garlic-cumin tadka.',
        img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80'
      },
      {
        name: 'Palak Paneer & Multigrain Roti',
        category: 'Veg',
        calories: 440,
        protein: 20.0,
        desc: 'Creamy iron-rich spinach gravy with slow-digesting low-fat cottage cheese and rustic multigrain rotis.',
        img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80'
      },
      {
        name: 'Grilled Chicken Brown Rice Bowl',
        category: 'Non-Veg',
        calories: 480,
        protein: 38.0,
        desc: 'Lean lemon-herb chicken breast served over fluffy brown rice and steamed garden broccoli florets.',
        img: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&auto=format&fit=crop&q=80'
      }
    ],
    dinner: [
      {
        name: 'Paneer Bhurji with Phulka',
        category: 'Veg',
        calories: 370,
        protein: 19.5,
        desc: 'Lightly spiced scrambled low-fat paneer tossed with capsicum and paired with oil-free wheat phulkas.',
        img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80'
      },
      {
        name: 'Vegetable Clear Soup & Tofu Stir-Fry',
        category: 'Veg',
        calories: 290,
        protein: 16.0,
        desc: 'A calming detox dinner featuring broccoli, shiitake mushrooms, and seared firm tofu cubes.',
        img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=80'
      },
      {
        name: 'Grilled Fish with Roasted Vegetables',
        category: 'Non-Veg',
        calories: 360,
        protein: 32.0,
        desc: 'Fresh white fish fillet roasted with garlic, herbs, tender zucchini, and asparagus for nighttime muscle repair.',
        img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80'
      }
    ]
  };

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden bg-gradient-to-b from-white to-[#F8F8F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#DCEBDD] text-[#234B35] text-xs font-bold uppercase tracking-wider shadow-xs">
                <Sparkles className="w-4 h-4 text-[#557C55]" />
                Next-Gen Personalized Nutrition
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#234B35] font-heading tracking-tight leading-[1.15]">
                Eat Smart.{' '}
                <span className="text-[#557C55] underline decoration-[#DCEBDD] decoration-wavy underline-offset-8">
                  Live Healthy.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-[#25312A]/85 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                Your health journey deserves a personalized plate. Discover healthy meals designed around your BMI, lifestyle, and food preferences.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#557C55] text-white font-bold text-base hover:bg-[#234B35] transition-all shadow-lg shadow-[#557C55]/25 hover:-translate-y-0.5"
                >
                  <span>Start Your Journey</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <a
                  href="#preview-meals"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-[#234B35] font-bold text-base border border-[#DCEBDD] hover:bg-[#DCEBDD]/30 transition-all shadow-sm"
                >
                  <Utensils className="w-5 h-5 text-[#557C55]" />
                  <span>Explore Meals</span>
                </a>
              </div>

              {/* Trust badges */}
              <div className="pt-6 border-t border-gray-200/60 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#557C55]" />
                  <span>Automated BMI Screening</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#557C55]" />
                  <span>Flexible Weekly Veg / Non-Veg</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#557C55]" />
                  <span>40+ Authentic Healthy Recipes</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Photography & Floating Cards */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md lg:max-w-none">
                
                {/* Main Hero Image */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/3 lg:aspect-square">
                  <img
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000&auto=format&fit=crop&q=80"
                    alt="Fresh Healthy Indian Salad and Greens"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                {/* Floating Card 1: BMI Metric Preview */}
                <div className="absolute -top-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-[#DCEBDD] flex items-center gap-3 animate-bounce-subtle">
                  <div className="w-11 h-11 rounded-xl bg-[#DCEBDD] text-[#234B35] flex items-center justify-center">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase">BMI Status</div>
                    <div className="text-sm font-bold text-[#234B35]">21.8 • Normal Range</div>
                  </div>
                </div>

                {/* Floating Card 2: Protein & Macro preview */}
                <div className="absolute -bottom-6 -right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-[#DCEBDD] flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase">Target Nutrition</div>
                    <div className="text-sm font-bold text-[#234B35]">38g Protein • 420 kcal</div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Key Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#557C55] bg-[#DCEBDD] px-3.5 py-1.5 rounded-full">
            Why NutriLife
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#234B35] font-heading">
            Smarter Nutrition, Designed for Indian Lifestyles
          </h2>
          <p className="text-base text-gray-600 leading-relaxed">
            Generic diet plans fail because they ignore your unique body mass index, cultural habits, and day-to-day dietary flexibility. NutriLife changes that forever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-8 rounded-3xl bg-white border border-[#DCEBDD] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#DCEBDD] text-[#234B35] flex items-center justify-center">
              <Activity className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#234B35] font-heading">
              Dynamic BMI Screening
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Instantly calculates your Body Mass Index and adjusts caloric priorities whether your goal is healthy weight loss, muscle gain, or vitality maintenance.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-3xl bg-white border border-[#DCEBDD] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#557C55]/15 text-[#557C55] flex items-center justify-center">
              <CalendarDays className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#234B35] font-heading">
              Weekly Veg/Non-Veg Flexibility
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Observe vegetarian Tuesdays or non-veg weekends effortlessly. Our interactive 7-day scheduler respects your traditions and serves matching dishes automatically.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-3xl bg-white border border-[#DCEBDD] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Utensils className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#234B35] font-heading">
              40+ Nutrient-Rich Recipes
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              From steamed Idli-Sambar to grilled fish and paneer bhurji, enjoy complete recipes with accurate calories, macros, step-by-step instructions, and health benefits.
            </p>
          </div>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section id="how-it-works" className="bg-[#234B35] text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-white/10 px-3.5 py-1.5 rounded-full">
              Seamless 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
              How NutriLife Works
            </h2>
            <p className="text-sm sm:text-base text-[#DCEBDD]/80">
              Transforming your daily meals into a personalized wellness roadmap in three straightforward steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4 backdrop-blur-xs">
              <div className="w-12 h-12 rounded-2xl bg-[#557C55] text-white font-extrabold text-xl flex items-center justify-center">
                1
              </div>
              <h3 className="text-xl font-bold font-heading text-white">
                Input Profile & Metrics
              </h3>
              <p className="text-sm text-[#DCEBDD]/80 leading-relaxed">
                Provide your height, weight, and age. NutriLife instantly computes your BMI category and determines your nutritional target.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4 backdrop-blur-xs">
              <div className="w-12 h-12 rounded-2xl bg-[#557C55] text-white font-extrabold text-xl flex items-center justify-center">
                2
              </div>
              <h3 className="text-xl font-bold font-heading text-white">
                Customize Weekly Diet
              </h3>
              <p className="text-sm text-[#DCEBDD]/80 leading-relaxed">
                Choose pure vegetarian or fine-tune specific vegetarian and non-vegetarian days on your personal interactive calendar.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4 backdrop-blur-xs">
              <div className="w-12 h-12 rounded-2xl bg-[#557C55] text-white font-extrabold text-xl flex items-center justify-center">
                3
              </div>
              <h3 className="text-xl font-bold font-heading text-white">
                Receive Smart Meal Suggestions
              </h3>
              <p className="text-sm text-[#DCEBDD]/80 leading-relaxed">
                Every morning, afternoon, and evening, open your dashboard to discover balanced, delicious suggestions with complete recipes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Healthy Meal Preview Section */}
      <section id="preview-meals" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#557C55] bg-[#DCEBDD] px-3.5 py-1.5 rounded-full">
              Culinary Sneak Peek
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#234B35] font-heading">
              Explore Our Healthy Recipe Collection
            </h2>
            <p className="text-sm text-gray-600 max-w-xl">
              Authentic Indian flavors crafted with wholesome ingredients, calibrated macros, and minimum processed oils.
            </p>
          </div>

          {/* Meal Time Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-gray-100 rounded-2xl self-start md:self-auto">
            {['breakfast', 'lunch', 'dinner'].map((tab) => (
              <button
                key={tab}
                onClick={() => setPreviewTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  previewTab === tab
                    ? 'bg-[#557C55] text-white shadow-sm'
                    : 'text-gray-600 hover:text-[#234B35]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Meal Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {previewMeals[previewTab].map((meal, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl overflow-hidden border border-[#DCEBDD] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                <img
                  src={meal.img}
                  alt={meal.name}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      meal.category === 'Veg'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    {meal.category}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-semibold backdrop-blur-md">
                  {meal.calories} kcal
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-[#25312A] font-heading">
                    {meal.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                    {meal.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#557C55]">Protein: {meal.protein}g</span>
                  <Link
                    to="/register"
                    className="text-[#234B35] hover:underline flex items-center gap-1"
                  >
                    <span>View full recipe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#234B35] text-white text-sm font-bold hover:bg-[#557C55] transition-colors shadow-sm"
          >
            <span>Unlock All 40+ Recipes with Free Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 5. Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F8F8F2] border border-[#DCEBDD] rounded-3xl p-8 sm:p-14">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <div className="flex items-center justify-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400" />
              ))}
            </div>
            <h2 className="text-3xl font-extrabold text-[#234B35] font-heading">
              Loved by Health Seekers Across India
            </h2>
            <p className="text-sm text-gray-600">
              Real stories from users transforming their dietary routine with NutriLife.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#DCEBDD] space-y-3 shadow-xs">
              <p className="text-sm text-gray-700 leading-relaxed italic">
                "The weekly veg/non-veg toggle is brilliant! On Tuesdays and Thursdays my family only eats vegetarian, and NutriLife gives me great suggestions without any manual searching."
              </p>
              <div className="pt-2 border-t border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#557C55]/20 text-[#234B35] font-bold text-xs flex items-center justify-center">
                  AR
                </div>
                <div>
                  <div className="text-xs font-bold text-[#25312A]">Ananya Rao</div>
                  <div className="text-[10px] text-gray-400">Bengaluru • Lost 4 kg in 2 months</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#DCEBDD] space-y-3 shadow-xs">
              <p className="text-sm text-gray-700 leading-relaxed italic">
                "As someone tracking BMI and protein intake, having Indian recipes with authentic calories and portion guidance saved me from expensive western meal subscription plans."
              </p>
              <div className="pt-2 border-t border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#557C55]/20 text-[#234B35] font-bold text-xs flex items-center justify-center">
                  RS
                </div>
                <div>
                  <div className="text-xs font-bold text-[#25312A]">Rahul Sharma</div>
                  <div className="text-[10px] text-gray-400">Hyderabad • Fitness Enthusiast</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#DCEBDD] space-y-3 shadow-xs">
              <p className="text-sm text-gray-700 leading-relaxed italic">
                "The UI is clean, fast, and gorgeous. No ads, no spam, just real science-backed meal ideas for breakfast, lunch, and dinner."
              </p>
              <div className="pt-2 border-t border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#557C55]/20 text-[#234B35] font-bold text-xs flex items-center justify-center">
                  PM
                </div>
                <div>
                  <div className="text-xs font-bold text-[#25312A]">Pooja Menon</div>
                  <div className="text-[10px] text-gray-400">Kochi • Healthy Lifestyle Parent</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#234B35] to-[#557C55] p-10 sm:p-16 text-center text-white space-y-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading tracking-tight">
              Ready to Upgrade Your Plate?
            </h2>
            <p className="text-base sm:text-lg text-[#DCEBDD] leading-relaxed">
              Create your free NutriLife account, calculate your BMI, and unlock personalized meal suggestions in under 2 minutes.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-[#234B35] font-bold text-base hover:bg-[#DCEBDD] transition-colors shadow-lg shadow-black/10"
              >
                Create Free Account
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-base transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
