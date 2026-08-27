import React, { useState, useEffect } from 'react';
import { GitCommit, History, RefreshCw, Eye, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import TraceTimeline from '../components/TraceTimeline';
import apiService from '../services/api';

export default function TracePage() {
  const [history, setHistory] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await apiService.getQueryHistory(20);
      setHistory(data || []);
      if (data && data.length > 0) {
        setSelectedQuery(data[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Agent Execution Traces
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-semibold">
              Cognitive History
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Deep-dive into full iteration history, tool execution parameters, error recovery, and LLM reasoning steps.
          </p>
        </div>

        <button
          onClick={fetchHistory}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-200 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-brand-400' : ''}`} />
          <span>Refresh History</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List of Past Runs */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-4 space-y-3 h-[680px] flex flex-col border border-white/10">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
              <History className="w-4 h-4 text-brand-400" />
              <span>Query Sessions ({history.length})</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {history.length > 0 ? (
              history.map((q) => {
                const isSelected = selectedQuery?.query_id === q.query_id;
                return (
                  <div
                    key={q.query_id}
                    onClick={() => setSelectedQuery(q)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all text-xs ${
                      isSelected
                        ? 'bg-brand-600/15 border-brand-500/40 text-white shadow-md'
                        : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/5 text-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium line-clamp-2 leading-snug">{q.question}</p>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                          q.is_success
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {q.is_success ? 'OK' : 'FAIL'}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>{q.total_iterations} iter</span>
                      <span>{q.total_duration_ms} ms</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                No traces available yet.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Selected Query Trace Timeline */}
        <div className="lg:col-span-8 space-y-4">
          {selectedQuery ? (
            <div className="space-y-4">
              {/* Selected Trace Header */}
              <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">ID: {selectedQuery.query_id}</span>
                  <span className="text-xs text-slate-400">{selectedQuery.timestamp}</span>
                </div>
                <h3 className="text-base font-bold text-white">"{selectedQuery.question}"</h3>
                <div className="flex items-center gap-4 text-xs font-mono text-slate-300 pt-1">
                  <span>Total Iterations: <strong>{selectedQuery.total_iterations}</strong></span>
                  <span>•</span>
                  <span>Execution Time: <strong>{selectedQuery.total_duration_ms} ms</strong></span>
                  <span>•</span>
                  <span className={selectedQuery.is_success ? 'text-emerald-400' : 'text-rose-400'}>
                    Status: {selectedQuery.is_success ? 'Success' : 'Failed'}
                  </span>
                </div>
              </div>

              {/* Timeline of iterations */}
              <TraceTimeline iterations={selectedQuery.iterations_trace} />
            </div>
          ) : (
            <div className="glass-panel p-16 text-center rounded-2xl text-slate-500 text-sm">
              Select a query session from the left panel to inspect its execution timeline.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
