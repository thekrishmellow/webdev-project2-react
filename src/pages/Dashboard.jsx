import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Calendar as CalendarIcon,
  ChevronRight,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  MoonStar,
  PlusCircle,
  Sparkles,
  Tag,
  TrendingUp,
  Wallet,
  X,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAuth } from '../context/useAuth';
import { useTransactions } from '../hooks/useTransactions';
import { EmptyState, FadeIn, PremiumButton, Skeleton } from '../components/UI';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { transactions, loading, stats, addTransaction } = useTransactions();
  const navigate = useNavigate();

  const firstName =
    user?.user_metadata?.name?.split(' ')[0] ||
    user?.name?.split(' ')[0] ||
    user?.email?.split('@')[0] ||
    'student';

  const budgetUsage = Math.min(
    100,
    stats.availableThisMonth > 0 ? (stats.monthlySpending / stats.availableThisMonth) * 100 : 0
  );

  const spendingData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      return {
        key: date.toISOString().split('T')[0],
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        amount: 0,
      };
    });

    transactions.forEach((transaction) => {
      if (transaction.type !== 'expense') return;
      const day = days.find((entry) => entry.key === transaction.date);
      if (day) day.amount += Number(transaction.amount);
    });

    return days.map(({ name, amount }) => ({ name, amount }));
  }, [transactions]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen md:flex">
      <aside className="paper-panel flex w-full flex-col border-r border-white/70 bg-white/70 p-8 md:w-72">
        <FadeIn>
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-900/10">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <span className="block text-2xl font-black tracking-tighter text-slate-900">StudySpend</span>
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Student finance journal</span>
            </div>
          </div>
        </FadeIn>

        <nav className="flex-1 space-y-2">
          <SidebarLink icon={<LayoutDashboard size={22} />} label="Overview" active />
          <SidebarLink icon={<BarChart3 size={22} />} label="Analytics" onClick={() => navigate('/analytics')} />
          <SidebarLink icon={<Sparkles size={22} />} label="AI Summary" onClick={() => navigate('/insights')} notification />
        </nav>

        <div className="mt-8 space-y-4 border-t border-slate-100 pt-8">
          <div className="rounded-[2rem] bg-[linear-gradient(180deg,#fff7ec_0%,#fff_100%)] p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#d97757]">Student Focus</p>
            <p className="mt-2 text-sm font-medium text-slate-600">
              Treat this like a money notebook. Essentials first, impulse spends second.
            </p>
          </div>
          <PremiumButton
            variant="ghost"
            className="w-full justify-start text-slate-400 hover:bg-red-50 hover:text-red-500"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            Log out
          </PremiumButton>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 md:p-12">
        <FadeIn>
          <header className="mb-12 grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
            <div className="paper-panel rounded-[2.5rem] px-8 py-8">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.28em] text-[#d97757]">This month</p>
              <h1 className="display-face text-5xl leading-[0.95] text-slate-900 md:text-6xl">
                Hi, {firstName}.
                <br />
                Your budget feels calm today.
              </h1>
              <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-slate-500 md:text-lg">
                Keep your everyday spending visible, and the big month-end surprises usually disappear with it.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm">
                  <GraduationCap className="h-4 w-4 text-[#2f5bea]" />
                  Budget left: ${stats.budgetRemaining.toFixed(2)}
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-[#f4f6fb] px-4 py-3 text-sm font-semibold text-slate-600">
                  <MoonStar className="h-4 w-4 text-[#1f9d74]" />
                  Avg spend: ${stats.averageExpense.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2.5rem] bg-[#243b63] px-8 py-8 text-white shadow-[0_22px_50px_rgba(36,59,99,0.2)]">
              <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-white/10 blur-[60px]" />
              <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-[#f08a6c]/20 blur-[50px]" />
              <div className="relative z-10">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-100">Quick Action</p>
                <h2 className="mt-4 text-3xl font-black leading-tight">Capture the next spend while it&apos;s still fresh.</h2>
                <p className="mt-3 text-sm font-medium leading-6 text-blue-100/85">
                  The best finance tracker is the one that feels fast enough to use in real life.
                </p>
                <PremiumButton
                  onClick={() => setIsModalOpen(true)}
                  className="mt-6 w-full justify-center bg-white text-slate-900 hover:bg-slate-100"
                >
                  <PlusCircle size={20} />
                  Add Transaction
                </PremiumButton>
              </div>
            </div>
          </header>
        </FadeIn>

        <section className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          <StatCard
            title="Monthly Budget Left"
            amount={`$${stats.budgetRemaining.toFixed(2)}`}
            trend={`Income added: $${stats.monthlyIncome.toFixed(2)}`}
            isIncrease={stats.budgetRemaining >= 0}
            color="bg-[#2f5bea]"
            loading={loading}
          />
          <StatCard
            title="This Month's Spending"
            amount={`$${stats.monthlySpending.toFixed(2)}`}
            trend={stats.topCategory}
            isIncrease={false}
            color="bg-[#f08a6c]"
            loading={loading}
          />
          <StatCard
            title="Available This Month"
            amount={`$${stats.availableThisMonth.toFixed(2)}`}
            icon={<Sparkles className="text-[#1f9d74]" />}
            color="bg-[#1f9d74]"
            loading={loading}
          />
        </section>

        <div className="mb-12 grid grid-cols-1 gap-8 xl:grid-cols-[1.35fr_0.85fr]">
          <FadeIn delay={0.1}>
            <div className="glass-card rounded-[2.5rem] bg-white p-10">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black tracking-tight">Weekly Rhythm</h2>
                  <p className="mt-1 text-sm font-medium text-slate-400">A softer view of how your recent spending is moving.</p>
                </div>
                <span className="rounded-full bg-[#f4f6fb] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                  7 days
                </span>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={spendingData}>
                    <defs>
                      <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2f5bea" stopOpacity={0.24} />
                        <stop offset="95%" stopColor="#2f5bea" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#98a2b3', fontSize: 12 }} />
                    <YAxis hide />
                    <Tooltip
                      formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Spent']}
                      contentStyle={{ borderRadius: '18px', border: '1px solid #eef2f7', boxShadow: '0 18px 35px rgba(15,23,42,0.08)' }}
                    />
                    <Area type="monotone" dataKey="amount" stroke="#243b63" strokeWidth={3} fill="url(#spendFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </FadeIn>

          <div className="space-y-8">
            <div className="paper-panel rounded-[2.5rem] p-8">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#1f9d74]">Savings Cushion</p>
              <p className="mt-4 text-4xl font-black text-slate-900">${stats.totalBalance.toFixed(2)}</p>
              <div className="mt-4 flex items-center gap-2 text-sm font-bold text-[#1f9d74]">
                <TrendingUp size={16} />
                {stats.savingsRate}% savings rate this month
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2.5rem] bg-[linear-gradient(135deg,#f08a6c_0%,#d97757_100%)] p-8 text-white shadow-[0_20px_40px_rgba(240,138,108,0.22)]">
              <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-white/10 blur-[50px]" />
              <div className="relative z-10">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-white/70">Budget Progress</p>
                <p className="mt-4 text-3xl font-black">${stats.availableThisMonth.toFixed(2)} available</p>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/20">
                  <Motion.div initial={{ width: 0 }} animate={{ width: `${budgetUsage}%` }} className="h-full bg-white" />
                </div>
                <p className="mt-4 text-sm font-medium text-white/85">{budgetUsage.toFixed(0)}% of this month&apos;s available money has been used.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[0.88fr_1.12fr]">
          <div className="paper-panel rounded-[2.5rem] p-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight">Recent Activity</h2>
                <p className="mt-1 text-sm font-medium text-slate-400">A clean log of what actually happened.</p>
              </div>
              <Link
                to="/analytics"
                className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-400 shadow-sm transition hover:text-black"
              >
                View all <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-4">
              {loading ? (
                [1, 2, 3, 4].map((item) => <div key={item} className="h-16 animate-pulse rounded-2xl bg-slate-50" />)
              ) : transactions.length > 0 ? (
                transactions.slice(0, 8).map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    label={transaction.category}
                    category={transaction.type}
                    amount={`${transaction.type === 'expense' ? '-' : '+'}$${Number(transaction.amount).toFixed(2)}`}
                    date={new Date(transaction.date).toLocaleDateString()}
                    isIncome={transaction.type === 'income'}
                  />
                ))
              ) : (
                <EmptyState
                  icon={<Wallet className="h-8 w-8" />}
                  title="No expenses yet"
                  description="Start with your next meal, commute, or book purchase so the dashboard can build a pattern."
                />
              )}
            </div>
          </div>

          <div className="glass-card rounded-[2.5rem] bg-white p-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight">What to Pay Attention To</h2>
                <p className="mt-1 text-sm font-medium text-slate-400">A few grounded signals, not a wall of stats.</p>
              </div>
              <Sparkles className="h-5 w-5 text-[#2f5bea]" />
            </div>

            <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
              <InsightTile
                eyebrow="Biggest category"
                title={stats.topCategory}
                body="This is the first place to review if you want a quick saving win."
                tone="blue"
              />
              <InsightTile
                eyebrow="Average spend"
                title={`$${stats.averageExpense.toFixed(2)}`}
                body="Small repeated purchases around this number are shaping the month."
                tone="coral"
              />
              <InsightTile
                eyebrow="AI summary"
                title="Open insights"
                body="Get a plain-language breakdown instead of decoding the charts yourself."
                tone="green"
                action={() => navigate('/insights')}
              />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />
              <Motion.div
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.96 }}
                className="relative z-10 w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-white shadow-2xl"
              >
                <TransactionForm onClose={() => setIsModalOpen(false)} onAdd={addTransaction} />
              </Motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

const TransactionForm = ({ onClose, onAdd }) => {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const amountRef = useRef(null);

  useEffect(() => {
    amountRef.current?.focus();
  }, []);

  const categories = [
    { name: 'Food', icon: '🍔' },
    { name: 'Transport', icon: '🚌' },
    { name: 'Books', icon: '📚' },
    { name: 'Rent', icon: '🏠' },
    { name: 'Tuition', icon: '🎓' },
    { name: 'Entertainment', icon: '🎬' },
    { name: 'Allowance', icon: '💸' },
    { name: 'Scholarship', icon: '🏅' },
    { name: 'Freelance', icon: '💻' },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!amount || Number(amount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    setLoading(true);
    const { error } = await onAdd({
      amount: Number(amount),
      type,
      category,
      date,
      note,
    });
    setLoading(false);

    if (error) {
      alert(error);
      return;
    }

    onClose();
  };

  return (
    <div className="p-10">
      <div className="mb-10 flex items-center justify-between">
        <h2 className="display-face text-4xl tracking-tight text-slate-900">Add transaction</h2>
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition hover:text-black"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid h-16 grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`rounded-2xl font-bold transition ${
              type === 'expense' ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`rounded-2xl font-bold transition ${
              type === 'income' ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
            }`}
          >
            Income
          </button>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-black text-slate-900">$</span>
            <input
              ref={amountRef}
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0.00"
              className="w-full rounded-3xl bg-slate-50 py-8 pl-14 pr-6 text-4xl font-black text-slate-900 outline-none placeholder:text-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="relative">
              <Tag className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full appearance-none rounded-2xl bg-slate-50 py-4 pl-12 pr-6 text-sm font-bold text-slate-900 outline-none"
              >
                {categories.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.icon} {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <CalendarIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                required
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="w-full rounded-2xl bg-slate-50 py-4 pl-12 pr-6 text-sm font-bold text-slate-900 outline-none"
              />
            </div>
          </div>

          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Examples: hostel lunch, metro card, textbook, tutoring income..."
            className="min-h-[110px] w-full resize-none rounded-2xl bg-slate-50 px-6 py-4 text-sm font-bold text-slate-900 outline-none placeholder:text-slate-300"
          />
        </div>

        <button
          disabled={loading}
          className="flex h-16 w-full items-center justify-center gap-3 rounded-3xl bg-slate-900 text-lg font-bold text-white shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] transition hover:scale-[1.01] disabled:opacity-50"
        >
          {loading ? (
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            'Save Transaction'
          )}
        </button>
      </form>
    </div>
  );
};

const SidebarLink = ({ icon, label, active, onClick, notification }) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center justify-between rounded-2xl px-6 py-4 text-sm font-bold transition ${
      active ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20' : 'text-slate-400 hover:bg-white hover:text-black'
    }`}
  >
    <span className="flex items-center gap-4">
      {icon}
      {label}
    </span>
    {notification && !active && (
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2f5bea] opacity-75" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-[#2f5bea]" />
      </span>
    )}
  </button>
);

const StatCard = ({ title, amount, trend, isIncrease, icon, color, loading }) => (
  <div className="paper-panel rounded-[2rem] p-8">
    {loading ? (
      <div className="space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-32" />
      </div>
    ) : (
      <>
        <div className="mb-6 flex items-start justify-between">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">{title}</span>
          {icon || <div className={`h-2 w-2 rounded-full ${color}`} />}
        </div>
        <div className="flex items-end gap-3">
          <span className="text-3xl font-black tracking-tight text-slate-900">{amount}</span>
          {trend && (
            <span className={`flex items-center gap-1 pb-1 text-xs font-bold ${isIncrease ? 'text-[#1f9d74]' : 'text-[#d97757]'}`}>
              {isIncrease ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {trend}
            </span>
          )}
        </div>
      </>
    )}
  </div>
);

const TransactionItem = ({ label, category, amount, date, isIncome }) => (
  <div className="group flex cursor-pointer items-center justify-between rounded-2xl border border-transparent bg-white/70 p-4 transition hover:border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-black/5">
    <div className="flex items-center gap-4">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${
          isIncome ? 'bg-[#1f9d74]/10 text-[#1f9d74]' : 'bg-slate-900 text-white'
        }`}
      >
        {isIncome ? <TrendingUp size={20} /> : <div className="h-1.5 w-1.5 rounded-full bg-white" />}
      </div>
      <div>
        <p className="text-sm font-black text-slate-900">{label}</p>
        <p className="text-xs font-bold lowercase text-slate-400">{category}</p>
      </div>
    </div>
    <div className="text-right">
      <p className={`text-sm font-black ${isIncome ? 'text-[#1f9d74]' : 'text-slate-900'}`}>{amount}</p>
      <p className="text-[10px] font-bold text-slate-400">{date}</p>
    </div>
  </div>
);

const InsightTile = ({ eyebrow, title, body, tone, action }) => {
  const toneClasses = {
    blue: 'bg-[#f4f6fb]',
    coral: 'bg-[#fff1eb]',
    green: 'bg-[#eef9f4]',
  };

  return (
    <button
      onClick={action}
      className={`rounded-[1.75rem] p-6 text-left transition ${toneClasses[tone] || toneClasses.blue} ${action ? 'cursor-pointer hover:-translate-y-0.5' : 'cursor-default'}`}
    >
      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">{eyebrow}</p>
      <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-900">{title}</h3>
      <p className="mt-3 text-sm font-medium leading-6 text-slate-500">{body}</p>
    </button>
  );
};

export default Dashboard;
