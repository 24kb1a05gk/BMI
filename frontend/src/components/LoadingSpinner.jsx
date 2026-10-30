import React from 'react';

export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-9 h-9 border-3',
    lg: 'w-14 h-14 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-[#DCEBDD] border-t-[#557C55] animate-spin`}
      />
      {text && <p className="text-xs font-medium text-[#25312A]/70 tracking-wide">{text}</p>}
    </div>
  );
}
