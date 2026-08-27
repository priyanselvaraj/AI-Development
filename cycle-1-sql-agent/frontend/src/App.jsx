import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import SqlAgentPage from './pages/SqlAgentPage';
import TracePage from './pages/TracePage';
import DatabasePage from './pages/DatabasePage';
import LogsPage from './pages/LogsPage';

export default function App() {
  return (
    <Router>
      <div className="flex h-screen overflow-hidden bg-[#0a0d14] text-slate-100 font-sans">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Workspace */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto bg-gradient-to-b from-[#0a0d14] via-[#0c101a] to-[#07090f]">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/agent" element={<SqlAgentPage />} />
              <Route path="/trace" element={<TracePage />} />
              <Route path="/database" element={<DatabasePage />} />
              <Route path="/logs" element={<LogsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
