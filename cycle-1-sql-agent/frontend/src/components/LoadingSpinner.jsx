import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = 'Autonomous agent is reasoning and querying...', step }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4 rounded-2xl glass-panel text-center">
      <div className="relative">
        <div className="w-14 h-14 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
        </div>
      </div>

      <div className="space-y-1">
        <p className="font-semibold text-slate-200 text-sm tracking-tight">{message}</p>
        {step && (
          <p className="text-xs text-brand-400 font-mono uppercase tracking-widest animate-pulse">
            Active Phase: {step}
          </p>
        )}
      </div>
    </div>
  );
}
