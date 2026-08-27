import React, { useState, useEffect } from 'react';
import { Database, Table, Key, Layers, RefreshCw, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';
import DataTable from '../components/DataTable';
import apiService from '../services/api';

export default function DatabasePage() {
  const [schema, setSchema] = useState({});
  const [selectedTable, setSelectedTable] = useState('students');
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchSchema = async () => {
    try {
      setLoading(true);
      const data = await apiService.getDatabaseSchema();
      setSchema(data || {});
      const tables = Object.keys(data || {});
      if (tables.length > 0 && !data[selectedTable]) {
        setSelectedTable(tables[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchema();
  }, []);

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset the database to original seed state?')) return;
    try {
      setResetting(true);
      const res = await apiService.resetDatabase();
      setMessage(res.message);
      await fetchSchema();
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setResetting(false);
    }
  };

  const currentTableData = schema[selectedTable] || null;

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              University Database Explorer
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-semibold">
              SQLite Introspection
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Browse schema metadata, column types, primary & foreign key relationships, and live sample data.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            disabled={resetting}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
            <span>Reset Seed Database</span>
          </button>

          <button
            onClick={fetchSchema}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-brand-400' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {/* Table Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {Object.entries(schema).map(([tblName, details]) => (
          <button
            key={tblName}
            onClick={() => setSelectedTable(tblName)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              selectedTable === tblName
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25 border border-brand-400/30'
                : 'glass-panel text-slate-300 hover:text-white'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span className="font-mono">{tblName}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-white/15 text-[10px] font-mono">
              {details.row_count}
            </span>
          </button>
        ))}
      </div>

      {/* Selected Table Inspection */}
      {currentTableData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Schema & Columns List */}
          <div className="lg:col-span-5 glass-panel rounded-2xl p-5 space-y-4 border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-400" />
                <h3 className="font-bold text-sm text-slate-200">
                  Schema: <code className="text-brand-300 font-mono">{selectedTable}</code>
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {currentTableData.columns.length} columns
              </span>
            </div>

            {/* Column Specs */}
            <div className="space-y-2 overflow-y-auto max-h-[480px] pr-1">
              {currentTableData.columns.map((col, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    {col.pk ? (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                        PK
                      </span>
                    ) : (
                      <span className="w-6" />
                    )}
                    <span className="font-mono font-semibold text-slate-200">{col.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-white/5 text-slate-400 font-mono text-[11px]">
                      {col.type}
                    </span>
                    {col.notnull && (
                      <span className="text-[10px] text-slate-500 font-sans">NOT NULL</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Foreign Keys Info */}
            {currentTableData.foreign_keys && currentTableData.foreign_keys.length > 0 && (
              <div className="pt-3 border-t border-white/10 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Foreign Key Constraints
                </span>
                <div className="space-y-1.5">
                  {currentTableData.foreign_keys.map((fk, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-white/[0.02] text-xs font-mono text-slate-300 border border-white/5"
                    >
                      <span className="text-brand-300">{fk.from}</span>
                      <span className="text-slate-500 mx-2">➔</span>
                      <span className="text-emerald-400">
                        {fk.to_table}.{fk.to_column}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sample Rows Data Preview */}
          <div className="lg:col-span-7 space-y-4">
            <DataTable
              columns={currentTableData.columns.map((c) => c.name)}
              rows={currentTableData.sample_rows}
              title={`Sample Preview for '${selectedTable}'`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
