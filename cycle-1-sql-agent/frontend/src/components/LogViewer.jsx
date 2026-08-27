import React, { useState, useEffect } from 'react';
import { Terminal, RefreshCw, Filter, Download, Trash2 } from 'lucide-react';
import apiService from '../services/api';

export default function LogViewer({ autoRefresh = true, initialLimit = 100 }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAutoRefresh, setIsAutoRefresh] = useState(autoRefresh);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await apiService.getLogs(initialLimit, selectedLevel);
      setLogs(data || []);
    } catch (err) {
      console.error('Failed to fetch logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    let interval;
    if (isAutoRefresh) {
      interval = setInterval(fetchLogs, 4000);
    }
    return () => clearInterval(interval);
  }, [selectedLevel, isAutoRefresh]);

  const filteredLogs = logs.filter((log) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      log.message.toLowerCase().includes(term) ||
      (log.logger && log.logger.toLowerCase().includes(term)) ||
      (log.agent_step && log.agent_step.toLowerCase().includes(term))
    );
  });

  const getLevelBadge = (level) => {
    switch (level) {
      case 'ERROR':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'WARNING':
      case 'WARN':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'INFO':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      case 'DEBUG':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden flex flex-col h-[600px] border border-white/10">
      {/* Header Toolbar */}
      <div className="p-4 border-b border-white/10 bg-[#090c14] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-brand-400" />
          <h3 className="font-bold text-sm text-slate-200">Runtime Application Logs</h3>
          <span className="px-2 py-0.5 text-xs rounded-full bg-white/5 text-slate-400 font-mono">
            {filteredLogs.length} events
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search log messages..."
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 w-44"
          />

          {/* Level Filter */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="ALL">All Levels</option>
            <option value="INFO">INFO</option>
            <option value="WARN">WARN</option>
            <option value="ERROR">ERROR</option>
            <option value="DEBUG">DEBUG</option>
          </select>

          {/* Auto Refresh Toggle */}
          <button
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              isAutoRefresh
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isAutoRefresh ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
            <span>Auto-Refresh</span>
          </button>

          {/* Manual Refresh */}
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors"
            title="Refresh now"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Log Console Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs bg-[#06080d]">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((item, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-lg bg-white/[0.015] hover:bg-white/[0.04] border border-white/5 flex items-start justify-between gap-3 transition-colors"
            >
              <div className="flex items-start gap-3 overflow-hidden">
                <span className="text-slate-500 shrink-0 select-none text-[11px]">
                  {item.timestamp}
                </span>

                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 border ${getLevelBadge(
                    item.level
                  )}`}
                >
                  {item.level}
                </span>

                {item.agent_step && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30 shrink-0">
                    {item.agent_step}
                  </span>
                )}

                <span className="text-slate-300 break-all select-text leading-relaxed">
                  {item.message}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500">
            No logs recorded yet matching criteria.
          </div>
        )}
      </div>
    </div>
  );
}
