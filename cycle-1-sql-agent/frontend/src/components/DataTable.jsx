import React, { useState, useMemo } from 'react';
import { Download, Search, Table as TableIcon } from 'lucide-react';

export default function DataTable({ columns = [], rows = [], title = 'Query Execution Results' }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return rows;
    const term = searchTerm.toLowerCase();
    return rows.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(term)
      )
    );
  }, [rows, searchTerm]);

  const handleExportCsv = () => {
    if (rows.length === 0 || columns.length === 0) return;
    const header = columns.join(',');
    const body = rows
      .map((r) => columns.map((c) => `"${r[c] !== undefined ? r[c] : ''}"`).join(','))
      .join('\n');
    const csvContent = `data:text/csv;charset=utf-8,${header}\n${body}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `query_result_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!columns || columns.length === 0) {
    return (
      <div className="p-8 text-center rounded-xl bg-white/[0.02] border border-white/5 text-slate-400 text-xs">
        No tabular rows returned for this query.
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[#090c14] border border-white/10 overflow-hidden space-y-3 p-4">
      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <TableIcon className="w-4 h-4 text-brand-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            {title} ({filteredRows.length} {filteredRows.length === 1 ? 'row' : 'rows'})
          </h4>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter results..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600/20 hover:bg-brand-600/30 text-brand-300 border border-brand-500/30 text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto rounded-xl border border-white/5">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-white/[0.04] text-slate-400 font-semibold border-b border-white/10 uppercase tracking-wider text-[10px]">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-4 py-3">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredRows.length > 0 ? (
              filteredRows.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-white/[0.02] transition-colors">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-4 py-2.5 font-mono text-slate-200">
                      {row[col] !== null && row[col] !== undefined ? String(row[col]) : (
                        <span className="text-slate-600 italic">NULL</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-slate-500">
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
