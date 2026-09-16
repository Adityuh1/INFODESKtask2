import React, { useState, useEffect, useMemo } from 'react';
import { ShieldAlert, Activity, Folder, Sun, Moon, Star } from 'lucide-react';

// Import our modular Presenter sub-components (Separation of Concerns)
import { LoadingScreen, ErrorScreen, InitialScreen } from './components/StateScreens';
import { MetricCards } from './components/MetricCards';
import { FilterPanel } from './components/FilterPanel';
import { DebtCard } from './components/DebtCard';
import { AuditForm } from './components/AuditForm';

/**
 * THE CENTRAL CONTROLLER
 * Coordinates state, fetches findings, maintains active filters,
 * and handles the light/dark theme switching toggle.
 */
export default function App() {
  // Theme state: defaults to dark theme (true)
  const [isDark, setIsDark] = useState(true);

  // Sync dark mode class on HTML document root element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Central data states
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasAudited, setHasAudited] = useState(false);

  // Repository input states
  const [repoUrl, setRepoUrl] = useState('');
  const [gitToken, setGitToken] = useState('');

  // Active filter states controlled by the user
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedAuthor, setSelectedAuthor] = useState('ALL');
  const [sortBy, setSortBy] = useState('RISK_DESC');

  // Trigger POST API call to trigger repository audit on backend
  const handleAuditSubmit = () => {
    if (!repoUrl) return;
    setLoading(true);
    setError(null);

    const apiBase = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? ''
      : 'https://tech-debt-auditor-production.up.railway.app';

    fetch(`${apiBase}/api/audit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ repoUrl, gitToken })
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.error || data.details || 'Failed to analyze repository.');
          });
        }
        return response.json();
      })
      .then((data) => {
        setDebts(data.findings);
        setHasAudited(true);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Audit failed:', err);
        setError(err.message);
        setLoading(false);
      });
  };

  // Compute list of unique author names dynamically for filter options
  const uniqueAuthors = useMemo(() => {
    const authors = debts.map(d => d.author || 'Unknown');
    return ['ALL', ...new Set(authors)];
  }, [debts]);

  // Handle Search, Category/Author filtering, and sorting concurrently
  const processedDebts = useMemo(() => {
    let result = [...debts];

    // Text Search
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        item => 
          item.comment.toLowerCase().includes(query) || 
          item.file.toLowerCase().includes(query)
      );
    }

    // Category Filter
    if (selectedCategory !== 'ALL') {
      result = result.filter(item => item.category?.toUpperCase() === selectedCategory.toUpperCase());
    }

    // Author Filter
    if (selectedAuthor !== 'ALL') {
      result = result.filter(item => (item.author || 'Unknown') === selectedAuthor);
    }

    // Sort order
    result.sort((a, b) => {
      if (sortBy === 'RISK_DESC') return b.riskScore - a.riskScore;
      if (sortBy === 'RISK_ASC') return a.riskScore - b.riskScore;
      
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      if (sortBy === 'AGE_DESC') return dateA - dateB;
      if (sortBy === 'AGE_ASC') return dateB - dateA;
      
      return 0;
    });

    return result;
  }, [debts, searchQuery, selectedCategory, selectedAuthor, sortBy]);

  // Calculate top analytical metric cards
  const metrics = useMemo(() => {
    const total = debts.length;
    const highRisk = debts.filter(d => d.riskScore >= 7).length;
    const avgScore = total > 0 
      ? (debts.reduce((sum, d) => sum + d.riskScore, 0) / total).toFixed(1)
      : '0.0';

    let maxAgeDays = 0;
    if (total > 0) {
      const today = new Date();
      const ages = debts.map(d => {
        const diff = Math.abs(today - new Date(d.createdAt));
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
      });
      maxAgeDays = Math.max(...ages);
    }

    return { total, highRisk, avgScore, maxAgeDays };
  }, [debts]);

  // Render modular loading spinner if fetching
  if (loading) {
    return (
      <div className={isDark ? 'dark' : ''}>
        <LoadingScreen />
      </div>
    );
  }

  // Render modular error page if audit fails
  if (error) {
    return (
      <div className={isDark ? 'dark' : ''}>
        <ErrorScreen error={error} onReset={() => { setError(null); setHasAudited(false); }} />
      </div>
    );
  }

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 px-6 py-8 flex flex-col font-sans transition-colors duration-200">
        <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col">
          
          {/* HEADER BRANDING */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-200 dark:border-zinc-800 pb-6 mb-10 gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                <ShieldAlert size={28} className="pulse-icon" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                  Automated Tech-Debt Auditor
                </h1>
                <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                  Static Code Analysis &amp; Version History Archaeology
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3.5 w-full md:w-auto justify-end">
              {/* Star on GitHub Button */}
              <a
                href="https://github.com/Adityuh1/TECH-DEBT-auditor"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-bold text-zinc-750 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-950/60 shadow-sm transition-all"
              >
                <Star size={14} className="text-amber-500 fill-amber-500/10" />
                <span>Star on GitHub</span>
              </a>

              {/* Local Cache Badge */}
              <div className="flex items-center gap-2 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-mono text-zinc-650 dark:text-zinc-400 shadow-sm">
                <Activity size={12} className="text-green-600 dark:text-green-500 animate-pulse" />
                <span>Local Cache: <span className="text-green-600 dark:text-green-400 font-semibold">findings.json</span></span>
              </div>

              {/* Theme Toggle Button (Sleek Sun/Moon icon switcher) */}
              <button
                onClick={() => setIsDark(!isDark)}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className="p-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-350 rounded-xl hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all cursor-pointer shadow-sm"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </header>

          {/* REPOSITORY INPUT AUDIT PANEL */}
          <AuditForm 
            repoUrl={repoUrl}
            setRepoUrl={setRepoUrl}
            gitToken={gitToken}
            setGitToken={setGitToken}
            onAuditSubmit={handleAuditSubmit}
          />

          {hasAudited ? (
            <>
              {/* SUMMARY METRICS CARDS (Modular) */}
              <MetricCards metrics={metrics} />

              {/* SEARCH & FILTERS PANEL (Modular) */}
              <FilterPanel
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedAuthor={selectedAuthor}
                setSelectedAuthor={setSelectedAuthor}
                uniqueAuthors={uniqueAuthors}
                sortBy={sortBy}
                setSortBy={setSortBy}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                filteredCount={processedDebts.length}
                totalCount={debts.length}
              />

              {/* DIAGNOSTIC CARD GRID */}
              {processedDebts.length > 0 ? (
                <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {processedDebts.map((item, index) => (
                    <DebtCard key={`${item.file}-${item.line}-${index}`} item={item} repoUrl={repoUrl}/>
                  ))}
                </main>
              ) : (
                /* Empty State Display */
                <main className="flex flex-col items-center justify-center p-16 bg-white dark:bg-zinc-900/10 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-center max-w-lg mx-auto w-full my-6 shadow-sm">
                  <Folder size={44} className="text-zinc-400 dark:text-zinc-700 mb-3" />
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-300 mb-1">No findings match your criteria</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Try adjusting your search queries, choosing a different category pill, or selecting another developer author.
                  </p>
                </main>
              )}
            </>
          ) : (
            <InitialScreen />
          )}

          {/* FOOTER */}
          <footer className="text-center text-xs text-zinc-500 dark:text-zinc-650 mt-auto pt-10 border-t border-zinc-200 dark:border-zinc-900 font-mono">
            Automated Tech-Debt Auditor | Built by Aditya
          </footer>

        </div>
      </div>
    </div>
  );
}