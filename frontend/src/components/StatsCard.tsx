'use client';

import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo' | 'emerald' | 'orange';
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

const colorMap = {
  blue: {
    bg: 'from-blue-500/10 to-blue-600/5',
    iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    text: 'text-blue-600',
    shadow: 'shadow-blue-500/20',
    border: 'border-blue-200',
  },
  green: {
    bg: 'from-green-500/10 to-green-600/5',
    iconBg: 'bg-gradient-to-br from-green-500 to-green-600',
    text: 'text-green-600',
    shadow: 'shadow-green-500/20',
    border: 'border-green-200',
  },
  yellow: {
    bg: 'from-amber-500/10 to-amber-600/5',
    iconBg: 'bg-gradient-to-br from-amber-500 to-amber-600',
    text: 'text-amber-600',
    shadow: 'shadow-amber-500/20',
    border: 'border-amber-200',
  },
  red: {
    bg: 'from-red-500/10 to-red-600/5',
    iconBg: 'bg-gradient-to-br from-red-500 to-red-600',
    text: 'text-red-600',
    shadow: 'shadow-red-500/20',
    border: 'border-red-200',
  },
  purple: {
    bg: 'from-purple-500/10 to-purple-600/5',
    iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
    text: 'text-purple-600',
    shadow: 'shadow-purple-500/20',
    border: 'border-purple-200',
  },
  indigo: {
    bg: 'from-indigo-500/10 to-indigo-600/5',
    iconBg: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
    text: 'text-indigo-600',
    shadow: 'shadow-indigo-500/20',
    border: 'border-indigo-200',
  },
  emerald: {
    bg: 'from-emerald-500/10 to-emerald-600/5',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    text: 'text-emerald-600',
    shadow: 'shadow-emerald-500/20',
    border: 'border-emerald-200',
  },
  orange: {
    bg: 'from-orange-500/10 to-orange-600/5',
    iconBg: 'bg-gradient-to-br from-orange-500 to-orange-600',
    text: 'text-orange-600',
    shadow: 'shadow-orange-500/20',
    border: 'border-orange-200',
  },
};

export default function StatsCard({ title, value, icon, color, subtitle, trend, trendValue }: StatsCardProps) {
  const colors = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`relative bg-white rounded-2xl p-5 md:p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group`}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className="relative flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <p className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">{value}</p>

          {subtitle && (
            <p className="text-xs text-slate-400 mt-1.5">{subtitle}</p>
          )}

          {trend && trendValue && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${
              trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-slate-500'
            }`}>
              {trend === 'up' && (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l5-5 5 5M12 12V3" />
                </svg>
              )}
              {trend === 'down' && (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-5 5-5-5M12 12v9" />
                </svg>
              )}
              <span>{trendValue}</span>
            </div>
          )}
        </div>

        <div className={`w-12 h-12 md:w-14 md:h-14 ${colors.iconBg} rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg ${colors.shadow} flex-shrink-0 ml-3`}>
          <span className="text-white">{icon}</span>
        </div>
      </div>
    </motion.div>
  );
}
