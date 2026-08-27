import React from 'react';
import LogViewer from '../components/LogViewer';
import { Terminal, Shield } from 'lucide-react';

export default function LogsPage() {
  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Backend Structured Agent Logs
          </h2>
          <span className="px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-semibold">
            Real-Time Stream
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Inspect backend events, agent cognitive phases (PERCEIVE, PLAN, ACT, OBSERVE), and SQLite execution audits.
        </p>
      </div>

      <LogViewer autoRefresh={true} initialLimit={150} />
    </div>
  );
}
