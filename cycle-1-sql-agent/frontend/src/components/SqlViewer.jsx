import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

export default function SqlViewer({ sql, title = 'SQL Query' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!sql) return;
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!sql) return null;

  return (
    <div className="rounded-xl bg-[#07090f] border border-white/10 overflow-hidden shadow-inner font-mono text-xs">
      <div className="flex items-center justify-between px-3.5 py-2 bg-white/[0.03] border-b border-white/5">
        <div className="flex items-center gap-2 text-slate-400">
          <Terminal className="w-3.5 h-3.5 text-brand-400" />
          <span className="font-sans font-semibold text-[11px] uppercase tracking-wider text-slate-300">
            {title}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          title="Copy SQL"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span className="text-[10px]">Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="p-3.5 overflow-x-auto text-emerald-300 leading-relaxed selection:bg-brand-600/30 selection:text-white">
        <code>{sql}</code>
      </div>
    </div>
  );
}
