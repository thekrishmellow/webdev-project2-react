import React, { useRef } from 'react';
import { motion as Motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, BarChart3, ChevronRight, ShieldCheck, Sparkles, Wallet, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.94]);

  const smoothY1 = useSpring(y1, { stiffness: 100, damping: 24 });
  const smoothY2 = useSpring(y2, { stiffness: 100, damping: 24 });

  const fadeInUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.7 },
  };

  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white">
      <Navbar />

      <section ref={heroRef} className="relative overflow-hidden px-4 pb-32 pt-44">
        <Motion.div
          style={{ opacity, scale }}
          className="relative z-10 mx-auto max-w-5xl space-y-10 text-center"
        >
          <Motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-900 shadow-sm"
          >
            <Sparkles className="h-4 w-4 text-blue-500" />
            Built for student budgets
          </Motion.div>

          <Motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl font-black leading-[0.95] tracking-tighter text-slate-900 md:text-8xl"
          >
            Understand your
            <br />
            <span className="gradient-text">campus spending at a glance</span>
          </Motion.h1>

          <Motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-3xl text-xl font-medium leading-relaxed text-slate-500"
          >
            StudySpend helps students track expenses, manage a monthly budget, and use AI to summarize
            where money is going.
          </Motion.p>

          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center justify-center gap-5 sm:flex-row"
          >
            <Link to="/auth" className="btn-primary px-10 py-5 text-lg">
              Start Tracking
              <ChevronRight className="h-5 w-5" />
            </Link>
            <a href="#features" className="btn-secondary px-10 py-5 text-lg">
              Explore Features
            </a>
          </Motion.div>
        </Motion.div>

        <Motion.div
          style={{ y: smoothY1 }}
          className="pointer-events-none absolute left-[-6rem] top-1/4 h-80 w-80 rounded-full bg-blue-500/10 blur-[120px]"
        />
        <Motion.div
          style={{ y: smoothY2 }}
          className="pointer-events-none absolute bottom-0 right-[-6rem] h-80 w-80 rounded-full bg-emerald-500/10 blur-[120px]"
        />

        <Motion.div style={{ y: smoothY1 }} className="relative z-10 mx-auto mt-24 max-w-6xl px-4">
          <div className="glass-card overflow-hidden border border-slate-200/50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-2 border-b border-slate-200/50 bg-slate-50/80 px-6 py-4">
              <div className="h-3 w-3 rounded-full bg-[#FF5F57]" />
              <div className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
              <div className="h-3 w-3 rounded-full bg-[#28C840]" />
            </div>

            <div className="grid gap-6 p-8 lg:grid-cols-[1.4fr_0.9fr]">
              <div className="rounded-[2rem] bg-slate-50 p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">This month</p>
                    <h2 className="mt-2 text-3xl font-black text-slate-900">$312.40 spent</h2>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-600">Budget left $487.60</div>
                </div>
                <div className="h-44 rounded-[2rem] bg-white p-6">
                  <div className="mb-4 flex items-center justify-between text-sm font-bold text-slate-400">
                    <span>Weekly spend</span>
                    <span>Last 7 days</span>
                  </div>
                  <div className="flex h-24 items-end gap-3">
                    {[40, 62, 35, 78, 55, 48, 70].map((height, index) => (
                      <div key={index} className="flex-1 rounded-t-2xl bg-gradient-to-t from-slate-900 to-blue-500" style={{ height: `${height}%` }} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[2rem] bg-slate-900 p-6 text-white">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Top category</p>
                  <h3 className="mt-3 text-2xl font-black">Food</h3>
                  <p className="mt-2 text-sm font-medium text-slate-300">Late-night orders are using the biggest share this month.</p>
                </div>
                <div className="rounded-[2rem] bg-blue-50 p-6">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-500">AI summary</p>
                  <p className="mt-3 text-sm font-bold leading-relaxed text-slate-700">
                    You&apos;re staying inside budget overall, but weekend food and transport are the main places to trim.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Motion.div>
      </section>

      <div className="mx-auto max-w-7xl space-y-40 px-4 py-28">
        <section id="features" className="grid items-center gap-20 md:grid-cols-2">
          <Motion.div {...fadeInUp} className="space-y-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white shadow-xl shadow-black/20">
              <Zap className="h-7 w-7" />
            </div>
            <h2 className="text-5xl font-black leading-[1.05] tracking-tight text-slate-900">
              Built for real student life.
            </h2>
            <p className="text-xl font-medium leading-relaxed text-slate-500">
              Track the categories students actually care about instead of forcing a complicated finance workflow.
            </p>
            <div className="grid gap-4">
              {[
                'Food, transport, books, rent, tuition, allowance, and freelance income',
                'Simple monthly budget guidance with a clear remaining balance',
                'One-click AI summary of spending habits and next actions',
              ].map((item) => (
                <Motion.div
                  key={item}
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4 transition hover:bg-slate-50"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  </div>
                  <span className="font-bold text-slate-700">{item}</span>
                </Motion.div>
              ))}
            </div>
          </Motion.div>

          <Motion.div
            {...fadeInUp}
            whileHover={{ scale: 1.02, rotate: 1 }}
            className="glass-card flex aspect-[4/3] items-center justify-center overflow-hidden bg-slate-50"
          >
            <div className="grid w-4/5 gap-4">
              <div className="rounded-[2rem] bg-white p-6 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Quick add</p>
                <p className="mt-2 text-lg font-black text-slate-900">$12.50 hostel lunch</p>
              </div>
              <div className="rounded-[2rem] bg-white p-6 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Budget signal</p>
                <p className="mt-2 text-lg font-black text-slate-900">72% of monthly budget used</p>
              </div>
              <div className="rounded-[2rem] bg-white p-6 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Best habit</p>
                <p className="mt-2 text-lg font-black text-slate-900">Transport spending is steady</p>
              </div>
            </div>
          </Motion.div>
        </section>

        <section id="insights" className="grid items-center gap-20 md:grid-cols-2">
          <Motion.div {...fadeInUp} className="order-2 space-y-8 md:order-1">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white shadow-xl shadow-black/20">
              <Sparkles className="h-7 w-7" />
            </div>
            <h2 className="text-5xl font-black leading-[1.05] tracking-tight text-slate-900">
              AI summaries that are actually useful.
            </h2>
            <p className="text-xl font-medium leading-relaxed text-slate-500">
              Instead of dumping charts on you, StudySpend turns your transactions into practical takeaways and next steps.
            </p>
            <Link to="/auth" className="inline-flex items-center gap-2 text-lg font-bold text-black">
              Try the tracker
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Motion.div>

          <Motion.div {...fadeInUp} className="order-1 relative md:order-2">
            <div className="absolute -inset-4 -z-10 bg-gradient-to-tr from-blue-500/10 to-teal-500/10 blur-3xl" />
            <div className="glass-card rounded-[2.5rem] bg-white/70 p-8">
              <div className="rounded-[2rem] bg-black p-6 text-white">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Summary</p>
                <p className="mt-3 text-lg font-medium leading-relaxed text-slate-200">
                  You&apos;re still inside budget, but food and weekend transport are rising faster than the rest of the month.
                </p>
              </div>
              <div className="mt-6 grid gap-4">
                {[
                  'Food is your largest category this month.',
                  'Average expense per purchase is $14.20.',
                  'Set a weekend spending cap to protect your budget.',
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-100 bg-white px-5 py-4 font-semibold text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </Motion.div>
        </section>

        <section id="analytics" className="space-y-12 text-center">
          <Motion.div {...fadeInUp} className="mx-auto max-w-3xl space-y-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white shadow-xl shadow-black/20">
              <BarChart3 className="h-7 w-7" />
            </div>
            <h2 className="text-5xl font-black leading-[1.05] tracking-tight text-slate-900">
              Clear analytics for better decisions.
            </h2>
            <p className="text-xl font-medium leading-relaxed text-slate-500">
              See which categories are heavy, how spending changes over time, and whether income is keeping up.
            </p>
          </Motion.div>

          <Motion.div {...fadeInUp} className="glass-card flex h-[420px] items-end gap-5 overflow-hidden bg-slate-50/60 p-8">
            {[45, 68, 52, 80, 63, 92, 72, 55].map((height, index) => (
              <div
                key={index}
                className="flex-1 rounded-2xl bg-gradient-to-t from-slate-900 to-slate-700 transition hover:to-blue-500"
                style={{ height: `${height}%` }}
              />
            ))}
          </Motion.div>
        </section>

        <Motion.section
          {...fadeInUp}
          className="relative overflow-hidden rounded-[3rem] bg-black px-10 py-24 text-center text-white"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.3),transparent_45%)]" />
          <div className="relative z-10 mx-auto max-w-3xl space-y-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-black">
              <Wallet className="h-7 w-7" />
            </div>
            <h2 className="text-5xl font-black leading-none tracking-tighter md:text-6xl">
              Start tracking before the next expense slips by.
            </h2>
            <p className="text-xl font-medium text-slate-300">
              Set up your student finance tracker, log your first few purchases, and let the app summarize what matters.
            </p>
            <Link to="/auth" className="inline-flex items-center gap-3 rounded-2xl bg-white px-10 py-5 text-xl font-bold text-black transition hover:bg-slate-100">
              Open StudySpend
              <ArrowRight className="h-6 w-6" />
            </Link>
          </div>
        </Motion.section>
      </div>
    </div>
  );
};

export default LandingPage;
