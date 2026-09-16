import React from 'react';
import { Code, AlertTriangle, TrendingUp, Clock } from 'lucide-react';

/**
 * SUMMARY METRICS COMPONENT
 * Renders the top analytical summary cards with a clean, high-contrast,
 * premium SaaS layout that works perfectly in both light and dark themes.
 */
export function MetricCards({ metrics }) {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      
      {/* Card 1: Active Debt */}
      <div className="flex justify-between items-center bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 p-5 rounded-xl transition-all duration-200 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700">
        <div className="text-left">
          <span className="text-[10px] font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block mb-1">
            Active Debt
          </span>
          <span className="text-2xl font-black text-zinc-900 dark:text-white">
            {metrics.total}
          </span>
        </div>
        <div className="p-2.5 bg-zinc-100 dark:bg-zinc-800/60 text-zinc-650 dark:text-zinc-300 rounded-lg">
          <Code size={18} />
        </div>
      </div>

      {/* Card 2: High Risk Warnings */}
      <div className="flex justify-between items-center bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 p-5 rounded-xl transition-all duration-200 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700">
        <div className="text-left">
          <span className="text-[10px] font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block mb-1">
            Critical Warnings
          </span>
          <span className={`text-2xl font-black ${metrics.highRisk > 0 ? 'text-red-650 dark:text-red-400' : 'text-zinc-900 dark:text-white'}`}>
            {metrics.highRisk}
          </span>
        </div>
        <div className={`p-2.5 rounded-lg ${
          metrics.highRisk > 0 
            ? 'bg-red-500/10 text-red-650 dark:text-red-400 animate-pulse' 
            : 'bg-zinc-100 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400'
        }`}>
          <AlertTriangle size={18} />
        </div>
      </div>

      {/* Card 3: Average Severity */}
      <div className="flex justify-between items-center bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 p-5 rounded-xl transition-all duration-200 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700">
        <div className="text-left">
          <span className="text-[10px] font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block mb-1">
            Avg Severity
          </span>
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {metrics.avgScore}
          </span>
        </div>
        <div className="p-2.5 bg-zinc-100 dark:bg-zinc-800/60 text-zinc-650 dark:text-zinc-300 rounded-lg">
          <TrendingUp size={18} />
        </div>
      </div>

      {/* Card 4: Max Neglect Age */}
      <div className="flex justify-between items-center bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 p-5 rounded-xl transition-all duration-200 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700">
        <div className="text-left">
          <span className="text-[10px] font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block mb-1">
            Max Neglect Age
          </span>
          <span className="text-2xl font-black text-orange-650 dark:text-orange-400">
            {metrics.maxAgeDays} <span className="text-xs font-semibold text-zinc-450 dark:text-zinc-550">days</span>
          </span>
        </div>
        <div className="p-2.5 bg-zinc-100 dark:bg-zinc-800/60 text-zinc-650 dark:text-zinc-300 rounded-lg">
          <Clock size={18} />
        </div>
      </div>

    </section>
  );
}
