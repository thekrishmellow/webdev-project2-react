import React, { useCallback, useEffect, useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../hooks/useTransactions';
import { getFinancialInsights } from '../lib/gemini';
import { useAuth } from '../context/useAuth';

const Insights = () => {
  const [data, setData] = useState({ summary: '', insights: [] });
  const [isGenerating, setIsGenerating] = useState(false);
  const { transactions, loading: txLoading } = useTransactions();
  const { signOut, isDemoMode } = useAuth();
  const navigate = useNavigate();

  const generateAIInsights = useCallback(async () => {
    if (transactions.length === 0) return;

    setIsGenerating(true);
    try {
      const results = await getFinancialInsights(transactions);
      setData(results);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  }, [transactions]);

  useEffect(() => {
    let active = true;

    const initializeInsights = async () => {
      if (transactions.length === 0 || data.insights.length > 0) return;

      setIsGenerating(true);
      try {
        const results = await getFinancialInsights(transactions);
        if (active) setData(results);
      } catch (error) {
        console.error(error);
      } finally {
        if (active) setIsGenerating(false);
      }
    };

    initializeInsights();

    return () => {
      active = false;
    };
  }, [transactions, data.insights.length]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] md:flex">
      <Sidebar onLogout={handleLogout} onNavigate={navigate} />

      <main className="flex-1 overflow-y-auto p-6 md:p-12">
        <header className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-4xl font-black tracking-tight text-slate-900">
              <BrainCircuit className="text-blue-500" />
              AI Expense Summary
            </h1>
            <p className="mt-2 text-lg font-medium text-slate-400">
              Understand your spending habits in plain language.
            </p>
          </div>

          <Motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={generateAIInsights}
            disabled={isGenerating || txLoading || transactions.length === 0}
            className="btn-primary px-8 py-4 disabled:opacity-50"
          >
            {isGenerating ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
            Refresh Summary
          </Motion.button>
        </header>

        {isDemoMode && (
          <div className="mb-8 rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-900">
            No `VITE_GEMINI_API_KEY` was found, so the app is using a built-in summary engine. Add the API key to enable live AI summaries.
          </div>
        )}

        <AnimatePresence mode="wait">
          {isGenerating ? (
            <Motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex min-h-[320px] flex-col items-center justify-center gap-6"
            >
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-100 border-t-blue-500" />
              <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-400">
                Summarizing your expenses
              </p>
            </Motion.div>
          ) : data.insights.length > 0 ? (
            <div className="space-y-8">
              <Motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-[2.5rem] bg-black p-10 text-white"
              >
                <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-blue-500/20 blur-[90px]" />
                <div className="relative z-10">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-black">Student Spend Summary</h2>
                  </div>
                  <p className="max-w-4xl text-xl font-medium leading-relaxed text-slate-300">
                    {data.summary}
                  </p>
                </div>
              </Motion.div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {data.insights.map((insight, index) => (
                  <InsightCard key={index} content={insight} index={index} />
                ))}
              </div>
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
                <BrainCircuit className="h-8 w-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No transactions yet</h3>
              <p className="mx-auto mt-2 max-w-md font-medium text-slate-500">
                Add a few expenses first, then come back here to get a quick summary of your spending patterns.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="mt-8 text-sm font-black uppercase tracking-[0.25em] text-blue-500 hover:underline"
              >
                Go to dashboard
              </button>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

const Sidebar = ({ onNavigate, onLogout }) => (
  <aside className="flex w-full flex-col border-r border-slate-100 bg-white p-8 md:w-72">
    <div className="mb-10 flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white shadow-xl shadow-black/10">
        <Wallet className="h-6 w-6" />
      </div>
      <span className="text-2xl font-black tracking-tighter">StudySpend</span>
    </div>

    <nav className="flex-1 space-y-2">
      <SidebarLink icon={<LayoutDashboard size={22} />} label="Overview" onClick={() => onNavigate('/dashboard')} />
      <SidebarLink icon={<BarChart3 size={22} />} label="Analytics" onClick={() => onNavigate('/analytics')} />
      <SidebarLink icon={<Sparkles size={22} />} label="AI Summary" active />
    </nav>

    <button
      onClick={onLogout}
      className="mt-8 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-400 transition hover:bg-red-50 hover:text-red-500"
    >
      <LogOut size={20} />
      Log out
    </button>
  </aside>
);

const InsightCard = ({ content, index }) => {
  const iconSets = [
    { icon: <TrendingUp className="text-emerald-500" />, bg: 'bg-emerald-50' },
    { icon: <AlertTriangle className="text-amber-500" />, bg: 'bg-amber-50' },
    { icon: <Lightbulb className="text-blue-500" />, bg: 'bg-blue-50' },
  ];
  const current = iconSets[index % iconSets.length];

  return (
    <Motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * (index + 1) }}
      className="glass-card rounded-3xl border border-slate-50 bg-white p-8"
    >
      <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl ${current.bg}`}>
        {current.icon}
      </div>
      <p className="mb-6 font-bold leading-relaxed text-slate-800">{content}</p>
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
        Actionable insight
      </div>
    </Motion.div>
  );
};

const SidebarLink = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center gap-4 rounded-2xl px-6 py-4 text-sm font-bold transition ${
      active ? 'bg-black text-white shadow-2xl shadow-black/20' : 'text-slate-400 hover:bg-slate-50 hover:text-black'
    }`}
  >
    {icon}
    {label}
  </button>
);

export default Insights;
