import React from 'react';
import { motion as Motion } from 'framer-motion';

export const Skeleton = ({ className }) => (
  <div className={`animate-pulse rounded-2xl bg-slate-100 ${className}`} />
);

export const EmptyState = ({ icon, title, description, actionLabel, onAction }) => (
  <Motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-200 bg-slate-50/80 p-10 text-center"
  >
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900">{title}</h3>
    <p className="mt-2 max-w-sm text-sm font-medium text-slate-500">{description}</p>
    {actionLabel && (
      <button
        onClick={onAction}
        className="mt-5 rounded-2xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:scale-[1.02]"
      >
        {actionLabel}
      </button>
    )}
  </Motion.div>
);

export const PremiumButton = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  disabled,
  loading,
  type = 'button',
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 font-bold transition disabled:cursor-not-allowed disabled:opacity-50';
  const variants = {
    primary: 'bg-black text-white shadow-xl shadow-black/10 hover:scale-[1.02] active:scale-[0.98]',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
    ghost: 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900',
  };

  return (
    <Motion.button
      type={type}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {loading ? (
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        children
      )}
    </Motion.button>
  );
};

export const FadeIn = ({ children, delay = 0 }) => (
  <Motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay }}
  >
    {children}
  </Motion.div>
);
