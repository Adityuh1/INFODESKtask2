import React from 'react';
import { Search, User, Filter } from 'lucide-react';

/**
 * FILTER PANEL COMPONENT
 * Renders the search input, author dropdown, sort selector, and category buttons.
 * Optimized for professional contrast in both dark and light modes.
 */
export function FilterPanel({
  searchQuery,
  setSearchQuery,
  selectedAuthor,
  setSelectedAuthor,
  uniqueAuthors,
  sortBy,
  setSortBy,
  selectedCategory,
  setSelectedCategory,
  filteredCount,
  totalCount
}) {
  return (
    <section className="bg-white dark:bg-zinc-900/25 border border-zinc-200 dark:border-zinc-800/80 p-5 rounded-xl mb-8 flex flex-col gap-4 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* A. Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400" size={16} />
          <input
            type="text"
            placeholder="Search comments or file paths..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none pl-11 pr-4 py-2.5 rounded-xl text-sm transition-all text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400"
          />
        </div>

        {/* B. Dropdown Selectors */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          
          {/* Author Selector */}
          <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 w-full sm:w-auto">
            <User size={13} className="text-zinc-550 dark:text-zinc-450" />
            <select
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
              className="bg-transparent text-xs font-semibold text-zinc-700 dark:text-zinc-300 focus:outline-none cursor-pointer pr-4"
            >
              {uniqueAuthors.map(author => (
                <option key={author} value={author} className="bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300">
                  {author === 'ALL' ? 'All Authors' : `Author: ${author}`}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 w-full sm:w-auto">
            <Filter size={13} className="text-zinc-550 dark:text-zinc-450" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-semibold text-zinc-700 dark:text-zinc-300 focus:outline-none cursor-pointer pr-4"
            >
              <option value="RISK_DESC" className="bg-white dark:bg-zinc-950">Highest Risk First</option>
              <option value="RISK_ASC" className="bg-white dark:bg-zinc-950">Lowest Risk First</option>
              <option value="AGE_DESC" className="bg-white dark:bg-zinc-950">Oldest Debt First</option>
              <option value="AGE_ASC" className="bg-white dark:bg-zinc-950">Newest Debt First</option>
            </select>
          </div>

        </div>
      </div>

      {/* C. Category Selection Pills */}
      <div className="flex items-center gap-2 border-t border-zinc-200/50 dark:border-zinc-800/40 pt-4 flex-wrap">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-450 mr-2">Category:</span>
        <div className="flex flex-wrap gap-2">
          {['ALL', 'Security', 'Performance', 'Maintenance', 'Feature'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 font-extrabold shadow-sm'
                  : 'bg-white dark:bg-zinc-900/20 border-zinc-200 dark:border-zinc-850 text-zinc-650 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-750 hover:text-zinc-900 dark:hover:text-zinc-300'
              }`}
            >
              {cat === 'ALL' ? 'Show All' : cat}
            </button>
          ))}
        </div>
        
        {/* Results Counter */}
        <span className="text-xs text-zinc-500 dark:text-zinc-450 font-mono ml-auto">
          Showing {filteredCount} of {totalCount} findings
        </span>
      </div>

    </section>
  );
}
