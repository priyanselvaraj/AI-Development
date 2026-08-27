import React from 'react';
import { Eye, BrainCircuit, Play, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';

const STAGES = [
  {
    key: 'PERCEIVE',
    title: '1. Perceive',
    desc: 'Schema Introspection & Intent Analysis',
    icon: Eye,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30',
  },
  {
    key: 'PLAN',
    title: '2. Plan',
    desc: 'LLM Reasoning & SQL Generation',
    icon: BrainCircuit,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/30',
  },
  {
    key: 'ACT',
    title: '3. Act',
    desc: 'Tool: execute_sql on SQLite',
    icon: Play,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
  },
  {
    key: 'OBSERVE',
    title: '4. Observe',
    desc: 'Result Evaluation & Error Detection',
    icon: CheckCircle2,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
  },
];

export default function LoopVisualizer({ currentStep, activeIteration, totalIterations, isRetrying }) {
  return (
    <div className="glass-panel p-6 rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-slate-100 text-sm">Agent Loop Execution Pipeline</h3>
          {activeIteration && (
            <span className="px-2.5 py-0.5 text-xs font-mono font-medium rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
              Iteration {activeIteration} {totalIterations ? `/ ${totalIterations}` : ''}
            </span>
          )}
        </div>
        {isRetrying && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Self-Correcting & Retrying...</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isActive = currentStep === stage.key;
          const isDone = currentStep === 'DONE';

          return (
            <div
              key={stage.key}
              className={`p-4 rounded-xl border transition-all duration-300 relative ${
                isActive
                  ? `${stage.bg} ${stage.border} ring-2 ring-brand-500/50 shadow-lg`
                  : isDone
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : 'bg-white/[0.02] border-white/5 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${stage.bg} ${stage.color}`}>
                  <Icon className={`w-4 h-4 ${isActive ? 'animate-bounce' : ''}`} />
                </div>
                {isActive && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                  </span>
                )}
                {isDone && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
              </div>

              <div className="text-xs font-bold text-slate-200">{stage.title}</div>
              <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">{stage.desc}</div>

              {idx < STAGES.length - 1 && (
                <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-[#0a0d14] border border-white/10 text-slate-400">
                  <ArrowRight className="w-3 h-3" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
