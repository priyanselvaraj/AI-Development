import React, { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle, XCircle, RefreshCcw, Clock, Code, FileSearch, Play, Activity } from 'lucide-react';
import SqlViewer from './SqlViewer';

export default function TraceTimeline({ iterations = [] }) {
  const [expandedIndex, setExpandedIndex] = useState(iterations.length > 0 ? iterations.length - 1 : 0);

  if (!iterations || iterations.length === 0) {
    return (
      <div className="glass-panel p-8 text-center rounded-2xl text-slate-400">
        No iteration trace available. Run a query in the Agent Loop page to view execution traces.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {iterations.map((step, idx) => {
        const isExpanded = expandedIndex === idx;
        const isSuccess = step.status === 'SUCCESS';
        const isFail = step.status === 'FAILED' || step.status === 'RETRYING';

        return (
          <div
            key={idx}
            className={`glass-panel rounded-2xl border transition-all duration-200 overflow-hidden ${
              isSuccess
                ? 'border-emerald-500/30'
                : 'border-amber-500/30'
            }`}
          >
            {/* Header / Accordion trigger */}
            <button
              onClick={() => setExpandedIndex(isExpanded ? null : idx)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/[0.02] text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl border ${
                    isSuccess
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  }`}
                >
                  {isSuccess ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <RefreshCcw className="w-4 h-4 animate-spin-slow" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-200">
                      Iteration {step.iteration}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                        isSuccess
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {step.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                    {step.observe?.observation_text || step.plan?.strategy || 'Trace step recorded'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{step.duration_ms} ms</span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </button>

            {/* Expanded Step Body */}
            {isExpanded && (
              <div className="px-5 pb-5 pt-2 border-t border-white/5 space-y-4 text-xs">
                {/* 1. Perceive Section */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                  <div className="flex items-center gap-2 font-semibold text-sky-400 uppercase tracking-wider text-[11px]">
                    <FileSearch className="w-3.5 h-3.5" />
                    <span>1. Perceive Analysis</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-sans">
                    {step.perceive?.user_intent && <strong>Intent:</strong>} {step.perceive?.user_intent}
                  </p>
                  {step.perceive?.previous_error_context && (
                    <div className="mt-1 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300">
                      <strong>Self-Correction Input:</strong> {step.perceive.previous_error_context}
                    </div>
                  )}
                </div>

                {/* 2. Plan Section */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-indigo-400 uppercase tracking-wider text-[11px]">
                    <Activity className="w-3.5 h-3.5" />
                    <span>2. Plan & Reasoning Strategy</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{step.plan?.strategy}</p>
                  {step.plan?.generated_sql && (
                    <SqlViewer sql={step.plan.generated_sql} title="Generated SQL Candidate" />
                  )}
                </div>

                {/* 3. Act Section */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-amber-400 uppercase tracking-wider text-[11px]">
                    <Play className="w-3.5 h-3.5" />
                    <span>3. Act Tool Execution</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-300">
                    <div>
                      <span className="text-slate-500">Tool:</span>{' '}
                      <code className="text-brand-300 bg-brand-950/40 px-1.5 py-0.5 rounded">
                        {step.act?.tool_called}
                      </code>
                    </div>
                    <div>
                      <span className="text-slate-500">Execution Result:</span>{' '}
                      <span className={step.act?.execution_success ? 'text-emerald-400' : 'text-rose-400 font-semibold'}>
                        {step.act?.execution_success ? 'Success' : 'Failed'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. Observe Section */}
                <div
                  className={`p-3.5 rounded-xl border space-y-1.5 ${
                    step.observe?.status === 'PASS'
                      ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300'
                      : 'bg-rose-950/20 border-rose-500/20 text-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold uppercase tracking-wider text-[11px]">
                    {step.observe?.status === 'PASS' ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                    )}
                    <span>4. Observe Evaluation</span>
                  </div>
                  <p className="font-mono text-[11px] leading-relaxed">
                    {step.observe?.observation_text}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
