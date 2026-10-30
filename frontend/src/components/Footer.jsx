import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Heart, ShieldCheck, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#234B35] text-[#DCEBDD] pt-16 pb-12 border-t border-[#315D44]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#315D44]">
          
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#557C55] flex items-center justify-center text-white shadow-sm">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white font-heading">
                Nutri<span className="text-[#DCEBDD]">Life</span>
              </span>
            </Link>
            <p className="text-sm text-[#DCEBDD]/80 leading-relaxed">
              Empowering your wellness through smart, personalized Indian meal planning based on your real-time BMI, metabolic goals, and dietary lifestyle.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-300 font-medium pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Evidence-based nutritional screening</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4 font-heading">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/#features" className="hover:text-white transition-colors">Features & Benefits</Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="hover:text-white transition-colors">How It Works</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About NutriLife</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Support & Contact</Link>
              </li>
            </ul>
          </div>

          {/* Health & Nutrition */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4 font-heading">Dietary Tools</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">BMI Screening Calculator</Link>
              </li>
              <li>
                <Link to="/suggestions" className="hover:text-white transition-colors">Smart Meal Recommender</Link>
              </li>
              <li>
                <Link to="/schedule" className="hover:text-white transition-colors">Weekly Veg/Non-Veg Scheduler</Link>
              </li>
              <li>
                <Link to="/saved-meals" className="hover:text-white transition-colors">Personal Recipe Vault</Link>
              </li>
            </ul>
          </div>

          {/* Contact & Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-base mb-4 font-heading">Support & Care</h4>
            <p className="text-sm text-[#DCEBDD]/80 flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>support@nutrilife.com</span>
            </p>
            <div className="p-3 rounded-xl bg-[#1b3d2b] border border-[#2b563c] mt-4 text-xs text-[#DCEBDD]/70 leading-relaxed">
              <strong className="text-white block mb-0.5">Medical Disclaimer:</strong>
              BMI and meal recommendations are educational screening tools and not medical prescriptions. Always consult a certified healthcare professional.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#DCEBDD]/70">
          <p>© {new Date().getFullYear()} NutriLife. Built with passion for healthy living.</p>
          <div className="flex items-center gap-2">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 inline" />
            <span>for personalized nutrition</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
