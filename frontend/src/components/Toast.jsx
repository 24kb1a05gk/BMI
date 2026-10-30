import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ id, type = 'info', message, onClose }) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-sky-600 shrink-0" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-emerald-200 bg-white/95 text-emerald-950 shadow-emerald-900/10';
      case 'error':
        return 'border-rose-200 bg-white/95 text-rose-950 shadow-rose-900/10';
      default:
        return 'border-sky-200 bg-white/95 text-sky-950 shadow-sky-900/10';
    }
  };

  return (
    <div
      role="alert"
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 animate-slide-in max-w-md ${getBorderColor()}`}
    >
      {getIcon()}
      <p className="text-sm font-medium leading-relaxed flex-1">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="p-1 rounded-lg hover:bg-black/5 text-gray-400 hover:text-gray-700 transition-colors"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
