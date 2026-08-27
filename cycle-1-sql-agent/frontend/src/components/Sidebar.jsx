import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Terminal, 
  GitCommit, 
  Database, 
  FileText, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/agent', label: 'SQL Agent Loop', icon: Terminal, badge: 'Live' },
  { path: '/trace', label: 'Iteration Trace', icon: GitCommit },
  { path: '/database', label: 'Database Schema', icon: Database },
  { path: '/logs', label: 'Agent Logs', icon: FileText },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-white/10 bg-[#090c14] flex flex-col justify-between shrink-0">
      <div className="p-4 space-y-6">
        <div className="px-3 pt-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Agentic Navigation
          </span>
        </div>

        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-600/15 text-brand-400 border border-brand-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-brand-500/20 text-brand-300 rounded border border-brand-500/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Academic Track Footer Banner */}
      <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-brand-950/60 to-dark-850 border border-brand-500/20 space-y-2">
        <div className="flex items-center gap-2 text-brand-400 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>CSE Submission Track</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Cycle 1: Autonomous self-correcting agent with loop state introspection.
        </p>
        <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
          <span className="font-mono">SQLite + FastAPI</span>
          <span className="text-emerald-400">● 100% Offline Ready</span>
        </div>
      </div>
    </aside>
  );
}
