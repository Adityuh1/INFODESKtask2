import React from 'react';
import { RotateCw, AlertTriangle, Play } from 'lucide-react';

/**
 * LOADING SCREEN COMPONENT
 */
export function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-650 dark:text-zinc-400 transition-colors duration-200">
      <RotateCw className="animate-spin text-indigo-650 dark:text-indigo-400 mb-5" size={40} />
      <p className="font-mono text-xs tracking-widest font-bold uppercase text-indigo-650 dark:text-indigo-400 mb-1">
        Auditing Repository...
      </p>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
        Cloning codebase, tracing Git history, and generating AI refactoring fixes.
      </p>
    </div>
  );
}

/**
 * ERROR SCREEN COMPONENT
 */
export function ErrorScreen({ error, onReset }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 transition-colors duration-200">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl max-w-md text-center shadow-xl">
        <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
        
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          Audit Run Failed
        </h2>
        
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
          Something went wrong while processing the repository. Please verify the URL is correct and public, or check your API network credentials.
        </p>

        <div className="p-3 bg-zinc-100 dark:bg-zinc-950 rounded-xl text-left font-mono text-xs text-red-500 dark:text-red-400 border border-zinc-200 dark:border-zinc-850 mb-6 break-words max-h-40 overflow-y-auto">
          {error}
        </div>

        <button 
          onClick={onReset}
          className="w-full px-5 py-2.5 bg-zinc-900 hover:bg-zinc-850 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

/**
 * INITIAL WELCOME SCREEN COMPONENT
 */
export function InitialScreen() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/10 rounded-2xl text-center max-w-2xl mx-auto w-full shadow-sm">
      <div className="w-12 h-12 bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-5 border border-indigo-500/20">
        <Play size={20} className="ml-0.5" />
      </div>
      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-200 mb-2">No repository audited yet</h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-405 leading-relaxed max-w-md">
        Enter a public or private GitHub repository URL in the input form above and click **"Audit Repo"** to initiate static analysis and git-history scans.
      </p>
    </div>
  );
}
