import React, { useEffect, useState } from 'react';
import { Database, Cpu, Activity, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import apiService from '../services/api';

export default function Navbar({ onRefresh }) {
  const [backendHealth, setBackendHealth] = useState(null);
  const [stats, setStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStatus = async () => {
    try {
      setRefreshing(true);
      const [healthData, statsData] = await Promise.all([
        apiService.getHealth().catch(() => null),
        apiService.getStats().catch(() => null),
      ]);
      setBackendHealth(healthData);
      setStats(statsData);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    fetchStatus();
    if (onRefresh) onRefresh();
  };

  return (
    <header className="h-16 border-b border-white/10 bg-[#0c101a]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
          <Database className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-slate-100 text-base tracking-tight">Cycle 1: AI Self-Correcting SQL Agent</h1>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
              Agent Loop
            </span>
          </div>
          <p className="text-xs text-slate-400">Autonomous Perceive → Plan → Act → Observe Cognitive Engine</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* LLM Engine Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs">
          <Cpu className="w-3.5 h-3.5 text-brand-400" />
          <span className="text-slate-400">Engine:</span>
          <span className="font-mono font-medium text-slate-200 uppercase">
            {stats?.active_llm_provider || 'Auto / Local'}
          </span>
        </div>

        {/* Backend Connectivity Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs">
          {backendHealth?.status === 'healthy' ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-medium">Backend Online</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-amber-400 font-medium">Connecting...</span>
            </>
          )}
        </div>

        {/* Manual Refresh Button */}
        <button
          onClick={handleManualRefresh}
          disabled={refreshing}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/10"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-brand-400' : ''}`} />
        </button>
      </div>
    </header>
  );
}
