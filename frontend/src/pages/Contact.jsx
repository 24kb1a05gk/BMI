import React, { useState } from 'react';
import { Mail, MapPin, Send, HelpCircle, CheckCircle2, MessageSquare, Github } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const { success } = useToast();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
    success('Thank you! Your inquiry has been dispatched to our nutrition support team.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const faqs = [
    {
      q: 'How does NutriLife calculate my daily caloric targets?',
      a: 'We use the Mifflin-St Jeor metabolic expenditure framework based on your height, weight, age, and biological sex, then adjust for your target goal (caloric deficit for weight loss or surplus for weight gain).'
    },
    {
      q: 'Will vegetarian accounts ever see non-vegetarian suggestions?',
      a: 'Never. Our database queries strictly enforce your food preference constraint at the MySQL backend level, ensuring complete dietary integrity.'
    },
    {
      q: 'Can I change my weekly vegetarian vs non-vegetarian days anytime?',
      a: 'Yes, absolutely. Visit your Weekly Schedule page at any time to toggle individual days of the week, and your daily recommendations will immediately update.'
    },
    {
      q: 'Are the recipes feasible for busy daily cooking?',
      a: 'Yes! All 40+ Indian recipes are specifically chosen for standard home cooking times (under 25-30 minutes), using widely accessible whole ingredients.'
    }
  ];

  return (
    <div className="space-y-16 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#557C55] bg-[#DCEBDD] px-3.5 py-1.5 rounded-full">
          We are Here to Help
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#234B35] font-heading">
          Get in Touch with the NutriLife Team
        </h1>
        <p className="text-sm text-gray-600">
          Have questions about your BMI calculation, dietary preferences, or meal suggestions? Send us a message below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-[#DCEBDD] shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-[#234B35] font-heading flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#557C55]" />
            Send Us a Message
          </h2>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-emerald-950 font-heading">
                Message Dispatched!
              </h3>
              <p className="text-xs text-emerald-800">
                Thank you for contacting NutriLife. Our team will review your message and get back to your email shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-xs font-bold text-emerald-700 underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#557C55] bg-[#F8F8F2]/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#557C55] bg-[#F8F8F2]/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Question about vegetarian meal recommendations"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#557C55] bg-[#F8F8F2]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Your Message *
                </label>
                <textarea
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Write your question or feedback in detail..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#557C55] bg-[#F8F8F2]/40 resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#557C55] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#234B35] transition-all shadow-md shadow-[#557C55]/20"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Contact Info & Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DCEBDD] shadow-sm space-y-5">
            <h3 className="font-bold text-lg text-[#234B35] font-heading">
              Contact Information
            </h3>

            <div className="space-y-4 text-sm text-[#25312A]">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#DCEBDD] text-[#234B35] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase text-gray-400">Email Address</div>
                  <a href="mailto:24kb1a05gk@nbkrist.org" className="text-[#234B35] font-semibold hover:underline">
                    24kb1a05gk@nbkrist.org
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#DCEBDD] text-[#234B35] flex items-center justify-center shrink-0">
                  <Github className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase text-gray-400">GitHub Repository</div>
                  <a
                    href="https://github.com/24kb1a05gk/BMI.git"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#234B35] font-semibold hover:underline break-all"
                  >
                    github.com/24kb1a05gk/BMI
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#DCEBDD] text-[#234B35] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase text-gray-400">Location</div>
                  <span className="text-[#234B35] font-semibold">Andhra Pradesh, India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DCEBDD] shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-[#234B35] font-heading flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#557C55]" />
              Quick FAQs
            </h3>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-[#F8F8F2] border border-gray-100 space-y-1">
                  <h4 className="text-xs font-bold text-[#234B35]">{faq.q}</h4>
                  <p className="text-[11px] text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
