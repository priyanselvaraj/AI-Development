import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Terminal, 
  Play, 
  RotateCcw, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Clock, 
  Code,
  Sparkles,
  Info
} from 'lucide-react';
import LoopVisualizer from '../components/LoopVisualizer';
import SqlViewer from '../components/SqlViewer';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAgentQuery } from '../hooks/useAgentQuery';

const EXAMPLE_QUERIES = [
  'Show all students who scored above 80 marks',
  'Find students with GPA greater than 3.7 with their major department name',
  'Show average salary and professor count for each department',
  'List all courses and the professors teaching them',
  'Show course code, title, and total enrolled students ordered by popularity',
];

export default function SqlAgentPage() {
  const location = useLocation();
  const [question, setQuestion] = useState(
    location.state?.initialPrompt || 'Show all students who scored above 80 marks'
  );
  const [simulateError, setSimulateError] = useState(location.state?.simulateError || false);
  const [selectedIterationIndex, setSelectedIterationIndex] = useState(0);

  const { loading, result, error, currentStep, executeQuery, reset } = useAgentQuery();

  useEffect(() => {
    if (location.state?.initialPrompt) {
      setQuestion(location.state.initialPrompt);
      if (location.state.simulateError !== undefined) {
        setSimulateError(location.state.simulateError);
      }
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!question.trim() || loading) return;
    const res = await executeQuery(question, simulateError);
    if (res?.iterations_trace) {
      setSelectedIterationIndex(res.iterations_trace.length - 1);
    }
  };

  const currentIteration = result?.iterations_trace?.[selectedIterationIndex] || null;

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Autonomous SQL Agent Loop
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-semibold">
              Perceive ➔ Plan ➔ Act ➔ Observe
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Submit a natural language database question and watch the agent reason, generate SQL, execute tools, and self-correct runtime errors.
          </p>
        </div>

        {/* Demo Self-Correction Switch */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl glass-panel border border-amber-500/30">
          <Zap className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="text-left">
            <div className="text-xs font-bold text-slate-200">Self-Correction Demo Mode</div>
            <div className="text-[10px] text-slate-400">Injects initial column typo to demo recovery</div>
          </div>
          <input
            type="checkbox"
            checked={simulateError}
            onChange={(e) => setSimulateError(e.target.checked)}
            className="w-4 h-4 text-brand-600 rounded bg-white/10 border-white/20 focus:ring-brand-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Query Input Box */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            Natural Language Database Question
          </label>
          <div className="relative">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Show all students who scored above 80 marks..."
              className="w-full pl-4 pr-32 py-3.5 rounded-2xl bg-[#07090f] border border-white/15 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 font-medium"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-md shadow-brand-500/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{loading ? 'Running...' : 'Execute Loop'}</span>
            </button>
          </div>
        </form>

        {/* Preset Prompt Pills */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-[11px] text-slate-400 font-semibold">Try examples:</span>
          {EXAMPLE_QUERIES.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setQuestion(q)}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 text-xs transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Agent Cognitive Loop Visualizer */}
      <LoopVisualizer
        currentStep={currentStep}
        activeIteration={result ? selectedIterationIndex + 1 : (loading ? 1 : null)}
        totalIterations={result?.total_iterations}
        isRetrying={result?.total_iterations > 1 && selectedIterationIndex === 0}
      />

      {/* Loading State */}
      {loading && (
        <LoadingSpinner
          message="Agent is evaluating database schema & generating SQL query..."
          step={currentStep}
        />
      )}

      {/* Error Banner */}
      {error && !loading && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <div>
            <strong>Execution Error:</strong> {error}
          </div>
        </div>
      )}

      {/* Execution Results View */}
      {result && !loading && (
        <div className="space-y-6">
          {/* Summary Status Strip */}
          <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl border ${
                  result.is_success
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}
              >
                {result.is_success ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-100">
                    {result.is_success ? 'Query Resolved Successfully' : 'Execution Failed'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 font-mono">
                    {result.total_iterations} iteration(s)
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Completed in <strong>{result.total_duration_ms} ms</strong> with autonomous self-correction.
                </p>
              </div>
            </div>

            {/* Iteration Selector Tabs */}
            {result.iterations_trace && result.iterations_trace.length > 1 && (
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[11px] text-slate-400 px-2 font-medium">Inspect:</span>
                {result.iterations_trace.map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedIterationIndex(idx)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedIterationIndex === idx
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Iteration {step.iteration}
                    {step.status === 'SUCCESS' && ' (Passed)'}
                    {step.status === 'RETRYING' && ' (Retried)'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Current Iteration Deep Dive */}
          {currentIteration && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Perception & Plan */}
              <div className="lg:col-span-5 space-y-4">
                {/* 1. Perceive Box */}
                <div className="glass-panel p-5 rounded-2xl border border-sky-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>1. Perceive Analysis</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentIteration.perceive?.user_intent}
                  </p>
                  {currentIteration.perceive?.previous_error_context && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                      <strong>Self-Correction Feedback:</strong> {currentIteration.perceive.previous_error_context}
                    </div>
                  )}
                </div>

                {/* 2. Plan Box */}
                <div className="glass-panel p-5 rounded-2xl border border-indigo-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    <Layers className="w-3.5 h-3.5" />
                    <span>2. Plan Strategy & SQL</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentIteration.plan?.strategy}
                  </p>
                  <SqlViewer sql={currentIteration.plan?.generated_sql} title="Candidate Query" />
                </div>

                {/* 4. Observe Box */}
                <div
                  className={`p-5 rounded-2xl border space-y-2 ${
                    currentIteration.observe?.status === 'PASS'
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>4. Observation Result</span>
                  </div>
                  <p className="text-xs leading-relaxed font-mono">
                    {currentIteration.observe?.observation_text}
                  </p>
                </div>
              </div>

              {/* Right Column: Query Results Table */}
              <div className="lg:col-span-7 space-y-4">
                {currentIteration.observe?.rows && currentIteration.observe.rows.length > 0 ? (
                  <DataTable
                    columns={currentIteration.observe.columns}
                    rows={currentIteration.observe.rows}
                    title="Executed Query Result Set"
                  />
                ) : (
                  <div className="glass-panel p-12 text-center rounded-2xl border border-white/10 space-y-2">
                    <Info className="w-8 h-8 text-slate-500 mx-auto" />
                    <p className="text-sm font-semibold text-slate-300">No rows returned in this iteration</p>
                    <p className="text-xs text-slate-500">
                      {currentIteration.observe?.error || 'Query returned 0 records.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
