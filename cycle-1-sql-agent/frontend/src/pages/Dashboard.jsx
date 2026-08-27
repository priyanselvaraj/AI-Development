import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Database, 
  Terminal, 
  CheckCircle, 
  AlertCircle, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  RefreshCcw,
  Zap,
  ShieldAlert
} from 'lucide-react';
import StatusCard from '../components/StatusCard';
import apiService from '../services/api';

const QUICK_PROMPTS = [
  {
    title: 'High Scorer Students',
    prompt: 'Show all students who scored above 80 marks',
    badge: 'Standard Query',
  },
  {
    title: 'Department Budget Analysis',
    prompt: 'Show department budgets and faculty counts ordered by budget',
    badge: 'Aggregation & JOIN',
  },
  {
    title: 'Top GPA Students',
    prompt: 'Find the top 5 students ranked by GPA with their major department',
    badge: 'Sorting & Limit',
  },
  {
    title: 'Course Popularity & Scores',
    prompt: 'List course titles, total enrolled students, and average marks',
    badge: 'Multi-table Aggregation',
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, historyData, tablesData] = await Promise.all([
        apiService.getStats().catch(() => null),
        apiService.getQueryHistory(5).catch(() => []),
        apiService.getDatabaseTables().catch(() => []),
      ]);
      setStats(statsData);
      setHistory(historyData || []);
      setTables(tablesData || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleLaunchPrompt = (promptText, simulateError = false) => {
    navigate('/agent', { state: { initialPrompt: promptText, simulateError } });
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl relative overflow-hidden bg-gradient-to-br from-brand-950/40 via-dark-850 to-[#0a0d14] border border-brand-500/20 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cycle 1 — Autonomous Self-Correction</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            AI Self-Correcting SQL Agent
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Experience the 4-phase cognitive cycle (<strong>Perceive → Plan → Act → Observe</strong>).
            If an SQL error occurs, the agent introspects the SQLite runtime failure and automatically self-corrects up to maximum iteration limits.
          </p>
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/agent')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-all shadow-lg shadow-brand-500/25"
            >
              <Terminal className="w-4 h-4" />
              <span>Launch SQL Agent Loop</span>
            </button>
            <button
              onClick={() => handleLaunchPrompt('Show all students who scored above 80 marks', true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-semibold text-sm transition-all"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Demo Self-Correction Recovery</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatusCard
          title="Total Queries"
          value={stats?.total_queries ?? 0}
          subtitle="Agent runs recorded"
          icon={Terminal}
          color="brand"
        />
        <StatusCard
          title="Success Rate"
          value={
            stats?.total_queries > 0
              ? `${Math.round((stats.successful_queries / stats.total_queries) * 100)}%`
              : '100%'
          }
          subtitle={`${stats?.successful_queries ?? 0} queries resolved`}
          icon={CheckCircle}
          color="emerald"
        />
        <StatusCard
          title="Avg Iterations"
          value={stats?.average_iterations ? `${stats.average_iterations}x` : '1.0x'}
          subtitle="Self-correction cycles"
          icon={RefreshCcw}
          color="amber"
        />
        <StatusCard
          title="Database Tables"
          value={stats?.total_tables ?? 5}
          subtitle={`${stats?.total_records ?? 40}+ seed records`}
          icon={Database}
          color="purple"
        />
      </div>

      {/* Quick Launch Prompts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-100 text-base">Quick Academic Prompts</h3>
            <p className="text-xs text-slate-400">Click any prompt to run it directly in the Agent Loop</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {QUICK_PROMPTS.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleLaunchPrompt(item.prompt)}
              className="glass-panel p-5 rounded-2xl glass-panel-hover cursor-pointer group flex items-start justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-200 text-sm group-hover:text-brand-300 transition-colors">
                    {item.title}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] rounded-md bg-white/5 text-slate-400 border border-white/10 font-mono">
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1 italic">"{item.prompt}"</p>
              </div>
              <div className="p-2 rounded-xl bg-white/5 group-hover:bg-brand-600 group-hover:text-white text-slate-400 transition-all shrink-0">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Section: Recent History & Schema Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Executions */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100 text-sm">Recent Agent Executions</h3>
            <button
              onClick={() => navigate('/trace')}
              className="text-xs text-brand-400 hover:text-brand-300 transition-colors font-medium"
            >
              View All Traces →
            </button>
          </div>

          <div className="space-y-2.5">
            {history.length > 0 ? (
              history.map((q, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate('/trace')}
                  className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 flex items-center justify-between cursor-pointer transition-colors text-xs"
                >
                  <div className="space-y-1 overflow-hidden pr-2">
                    <p className="font-medium text-slate-200 line-clamp-1">{q.question}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                      <span>{q.total_iterations} iteration(s)</span>
                      <span>•</span>
                      <span>{q.total_duration_ms} ms</span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                      q.is_success
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {q.is_success ? 'Success' : 'Failed'}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                No recent queries. Click a prompt above to start the agent!
              </div>
            )}
          </div>
        </div>

        {/* Database Schema Overview */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100 text-sm">Target Database Tables</h3>
            <button
              onClick={() => navigate('/database')}
              className="text-xs text-brand-400 hover:text-brand-300 transition-colors font-medium"
            >
              Explore Full Schema →
            </button>
          </div>

          <div className="space-y-2.5">
            {tables.map((tbl, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <Database className="w-4 h-4 text-brand-400 shrink-0" />
                  <div>
                    <span className="font-mono font-semibold text-slate-200">{tbl.name}</span>
                    <p className="text-[10px] text-slate-400 line-clamp-1">
                      {tbl.columns.join(', ')}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 font-mono text-[11px] shrink-0">
                  {tbl.row_count} rows
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
