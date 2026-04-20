import React, { useEffect, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-slate-200/70 bg-white/85 py-3 backdrop-blur-xl' : 'py-5'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <Motion.div
            whileHover={{ rotate: 12 }}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white shadow-lg"
          >
            <Wallet className="h-6 w-6" />
          </Motion.div>
          <span className="text-2xl font-black tracking-tighter text-slate-900">StudySpend</span>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-semibold text-slate-500 md:flex">
          <a href="#features" className="transition hover:text-black">
            Features
          </a>
          <a href="#analytics" className="transition hover:text-black">
            Analytics
          </a>
          <a href="#insights" className="transition hover:text-black">
            AI Summary
          </a>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/auth" className="text-sm font-semibold text-slate-600 transition hover:text-black">
            Sign in
          </Link>
          <Link to="/auth" className="btn-primary py-3 text-sm">
            Start Tracking
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
