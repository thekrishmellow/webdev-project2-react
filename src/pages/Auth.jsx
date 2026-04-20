import React, { useEffect, useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  NotebookPen,
  Wallet,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState('idle');

  const { signIn, signUp, user, isDemoMode } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleAuth = async (event) => {
    event.preventDefault();
    setError('');
    setMsg('');

    if ((!isLogin || isDemoMode) && !fullName.trim()) {
      setError('Please enter your guest name.');
      return;
    }

    if (!email.includes('@')) {
      setError(`Please enter a valid ${isDemoMode ? 'Gmail address' : 'email address'}.`);
      return;
    }

    if (isDemoMode && !email.toLowerCase().endsWith('@gmail.com')) {
      setError('Please use a Gmail address for guest sign in.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setStatus('loading');

    try {
      if (isLogin) {
        const { error: signInError } = await signIn({ email, password, name: fullName.trim() });
        if (signInError) throw signInError;
      } else {
        const { error: signUpError } = await signUp({ email, password, name: fullName.trim() });
        if (signUpError) throw signUpError;
        setMsg(isDemoMode ? 'Demo account created. Opening your dashboard now.' : 'Check your email to confirm your account, then sign in.');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong while signing you in.');
    } finally {
      setStatus('idle');
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-50 lg:flex-row">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      <div className="relative hidden flex-1 overflow-hidden bg-slate-950 p-16 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.35),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.25),transparent_35%)]" />

        <Link to="/" className="relative z-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black">
            <Wallet className="h-7 w-7" />
          </div>
          <span className="text-3xl font-black tracking-tighter">StudySpend</span>
        </Link>

        <div className="relative z-10 max-w-xl space-y-8">
          <div>
            <h1 className="text-6xl font-black leading-none tracking-tighter">
              Budget better
              <br />
              during the semester.
            </h1>
            <p className="mt-6 text-xl font-medium leading-relaxed text-slate-300">
              Track meals, books, rent, travel, allowance, and side-income in one simple workspace.
            </p>
          </div>

          <div className="grid gap-4">
            <FeatureBadge icon={<GraduationCap className="h-5 w-5" />} label="Built for student spending" />
            <FeatureBadge icon={<NotebookPen className="h-5 w-5" />} label="Fast note-taking for every transaction" />
            <FeatureBadge icon={<CheckCircle2 className="h-5 w-5" />} label="AI-ready summaries when an API key is added" />
          </div>
        </div>

        <p className="relative z-10 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
          Student finance tracker
        </p>
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center p-6 sm:p-12">
        <Link
          to="/"
          className="absolute left-8 top-8 flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <Motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 flex justify-center lg:hidden">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-black text-white shadow-2xl">
              <Wallet className="h-8 w-8" />
            </div>
          </div>

          <div className="glass-card border-white/60 p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] sm:p-10">
            {isDemoMode && (
              <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-900">
                Demo mode is active. Enter your guest name and Gmail to start using the app without Supabase.
              </div>
            )}

            <AnimatePresence mode="wait">
              <Motion.div
                key={isLogin ? 'login' : 'signup'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <div className="mb-8 text-center">
                  <h2 className="text-4xl font-black tracking-tighter text-slate-900">
                    {isDemoMode ? 'Guest sign in' : isLogin ? 'Welcome back' : 'Create your account'}
                  </h2>
                  <p className="mt-2 font-medium text-slate-500">
                    {isDemoMode
                      ? 'Add your guest name and Gmail to open your student dashboard.'
                      : isLogin
                        ? 'Pick up your budget where you left it.'
                        : 'Start tracking spending in a few seconds.'}
                  </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-5">
                  {(!isLogin || isDemoMode) && (
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder={isDemoMode ? 'Guest name' : 'Full name'}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 font-semibold text-slate-900 outline-none transition focus:border-black focus:ring-4 focus:ring-black/5"
                    />
                  )}
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={isDemoMode ? 'Gmail address' : 'Email address'}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 font-semibold text-slate-900 outline-none transition focus:border-black focus:ring-4 focus:ring-black/5"
                  />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Password"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 font-semibold text-slate-900 outline-none transition focus:border-black focus:ring-4 focus:ring-black/5"
                  />

                  {error && (
                    <Motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600"
                    >
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {error}
                    </Motion.div>
                  )}

                  {msg && (
                    <Motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      {msg}
                    </Motion.div>
                  )}

                  <Motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    disabled={status === 'loading'}
                    className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-black text-lg font-black text-white shadow-xl shadow-black/15 transition disabled:opacity-50"
                  >
                    {status === 'loading' ? (
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                      <>
                        {isDemoMode ? 'Continue as Guest' : isLogin ? 'Open Dashboard' : 'Create Account'}
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </Motion.button>
                </form>

                <div className="mt-6 text-center text-sm">
                  <span className="font-medium text-slate-500">
                    {isLogin ? 'Need an account?' : 'Already registered?'}
                  </span>{' '}
                  <button
                    onClick={() => setIsLogin((value) => !value)}
                    className="font-black text-black underline-offset-4 hover:underline"
                  >
                    {isLogin ? 'Create one' : 'Sign in'}
                  </button>
                </div>
              </Motion.div>
            </AnimatePresence>
          </div>
        </Motion.div>
      </div>
    </div>
  );
};

const FeatureBadge = ({ icon, label }) => (
  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur">
    <div className="text-blue-300">{icon}</div>
    <span className="font-semibold text-slate-200">{label}</span>
  </div>
);

export default Auth;
