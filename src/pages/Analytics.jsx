import React, { useMemo, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import {
  BarChart3,
  Filter,
  LayoutDashboard,
  LogOut,
  PieChart as PieChartIcon,
  Sparkles,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../hooks/useTransactions';
import { useAuth } from '../context/useAuth';
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#0f172a', '#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30days');
  const { transactions, loading } = useTransactions();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const filteredTransactions = useMemo(() => {
    const days = { '7days': 7, '30days': 30, '90days': 90 }[timeRange] || 30;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return transactions.filter((transaction) => new Date(transaction.date) >= cutoff);
  }, [transactions, timeRange]);

  const categoryData = useMemo(() => {
    const categories = filteredTransactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + Number(transaction.amount);
        return acc;
      }, {});

    return Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  const trendData = useMemo(() => {
    const byDate = filteredTransactions.reduce((acc, transaction) => {
      const key = transaction.date;
      if (!acc[key]) {
        acc[key] = {
          date: new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          income: 0,
          expense: 0,
        };
      }

      if (transaction.type === 'income') {
        acc[key].income += Number(transaction.amount);
      } else {
        acc[key].expense += Number(transaction.amount);
      }

      return acc;
    }, {});

    return Object.values(byDate).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [filteredTransactions]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] md:flex">
      <aside className="flex w-full flex-col border-r border-slate-100 bg-white p-8 md:w-72">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white shadow-xl shadow-black/10">
            <Wallet className="h-6 w-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter">StudySpend</span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarLink icon={<LayoutDashboard size={22} />} label="Overview" onClick={() => navigate('/dashboard')} />
          <SidebarLink icon={<BarChart3 size={22} />} label="Analytics" active />
          <SidebarLink icon={<Sparkles size={22} />} label="AI Summary" onClick={() => navigate('/insights')} />
        </nav>

        <button
          onClick={handleLogout}
          className="mt-8 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-400 transition hover:bg-red-50 hover:text-red-500"
        >
          <LogOut size={20} />
          Log out
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 md:p-12">
        <header className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Spending Analytics</h1>
            <p className="mt-2 text-lg font-medium text-slate-400">
              Spot which categories are using the most of your student budget.
            </p>
          </div>

          <div className="flex rounded-2xl bg-slate-100 p-1.5">
            <FilterButton label="7 Days" active={timeRange === '7days'} onClick={() => setTimeRange('7days')} />
            <FilterButton label="30 Days" active={timeRange === '30days'} onClick={() => setTimeRange('30days')} />
            <FilterButton label="90 Days" active={timeRange === '90days'} onClick={() => setTimeRange('90days')} />
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-100 border-t-black" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-[2.5rem] bg-white p-10"
            >
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black">Expense Breakdown</h2>
                  <p className="text-sm font-medium text-slate-400">Your top categories for the selected range</p>
                </div>
                <PieChartIcon className="text-slate-300" />
              </div>

              <div className="h-80">
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={6}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={entry.name} fill={COLORS[index % COLORS.length]} cornerRadius={8} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']}
                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm font-bold text-slate-400">
                    No expense data yet
                  </div>
                )}
              </div>
            </Motion.div>

            <Motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="relative overflow-hidden rounded-[2.5rem] bg-black p-10 text-white"
            >
              <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-blue-500/15 blur-[100px]" />
              <div className="relative z-10">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black">Cash Flow</h2>
                    <p className="text-sm font-medium text-slate-400">Income versus expense over time</p>
                  </div>
                  <TrendingUp className="text-blue-400" />
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.08)" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <YAxis hide />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderRadius: '16px',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: '#fff',
                        }}
                      />
                      <Area type="monotone" dataKey="income" stroke="#3b82f6" strokeWidth={3} fill="url(#incomeFill)" />
                      <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} fillOpacity={0} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Motion.div>

            <Motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="glass-card rounded-[2.5rem] bg-white p-10 lg:col-span-2"
            >
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black">Recent Transactions</h2>
                  <p className="text-sm font-medium text-slate-400">Everything in the selected time range</p>
                </div>
                <Filter className="text-slate-300" />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-4 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Date</th>
                      <th className="pb-4 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Category</th>
                      <th className="pb-4 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Note</th>
                      <th className="pb-4 text-right text-xs font-black uppercase tracking-[0.2em] text-slate-400">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-slate-50 last:border-b-0">
                        <td className="py-5 text-sm font-bold text-slate-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="py-5">
                          <span
                            className={`rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] ${
                              transaction.type === 'income'
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-red-50 text-red-600'
                            }`}
                          >
                            {transaction.category}
                          </span>
                        </td>
                        <td className="py-5 font-semibold text-slate-900">{transaction.note || 'No note added'}</td>
                        <td
                          className={`py-5 text-right font-black ${
                            transaction.type === 'income' ? 'text-emerald-500' : 'text-slate-900'
                          }`}
                        >
                          {transaction.type === 'income' ? '+' : '-'}$
                          {Number(transaction.amount).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Motion.div>
          </div>
        )}
      </main>
    </div>
  );
};

const FilterButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-[0.2em] transition ${
      active ? 'bg-black text-white shadow-lg' : 'text-slate-400 hover:text-black'
    }`}
  >
    {label}
  </button>
);

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

export default Analytics;
