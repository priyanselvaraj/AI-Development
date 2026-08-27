import React from 'react';

export default function StatusCard({ title, value, subtitle, icon: Icon, color = 'brand', trend }) {
  const colorMap = {
    brand: 'from-brand-500/20 to-brand-700/5 text-brand-400 border-brand-500/30',
    emerald: 'from-emerald-500/20 to-emerald-700/5 text-emerald-400 border-emerald-500/30',
    amber: 'from-amber-500/20 to-amber-700/5 text-amber-400 border-amber-500/30',
    rose: 'from-rose-500/20 to-rose-700/5 text-rose-400 border-rose-500/30',
    purple: 'from-purple-500/20 to-purple-700/5 text-purple-400 border-purple-500/30',
  };

  const selectedColor = colorMap[color] || colorMap.brand;

  return (
    <div className="glass-panel p-5 rounded-2xl relative overflow-hidden glass-panel-hover group">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</span>
          <div className="text-2xl font-bold text-slate-100 tracking-tight">{value}</div>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${selectedColor} border`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span>{subtitle}</span>
          {trend && <span className="font-semibold text-slate-300">{trend}</span>}
        </div>
      )}
    </div>
  );
}
