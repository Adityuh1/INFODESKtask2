import React, { useState } from 'react';
import { Info, ExternalLink } from 'lucide-react';

/**
 * AuditForm Component.
 * Renders the input fields for the Git URL and Private Token, along with the action button.
 * Includes a collapsible step-by-step help guide for retrieving a GitHub Access Token.
 */
export function AuditForm({ repoUrl, setRepoUrl, gitToken, setGitToken, onAuditSubmit }) {
    const [showTokenHelp, setShowTokenHelp] = useState(false);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onAuditSubmit();
    };

    return (
        <div className="mb-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden text-left">
            <form onSubmit={handleSubmit} className="p-6 flex flex-col md:flex-row items-center gap-4">
                <div className="flex-grow w-full text-left">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">
                        Repository URL
                    </label>
                    <input 
                        type="text" 
                        placeholder="e.g., https://github.com/username/my-project"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium transition-all"
                        required
                    />
                </div>
                
                <div className="w-full md:w-85 text-left">
                    <div className="flex items-center gap-1.5 mb-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                            Access Token (Private repos)
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowTokenHelp(!showTokenHelp)}
                            className="p-0.5 text-zinc-400 dark:text-zinc-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors cursor-pointer rounded-full flex items-center justify-center focus:outline-none"
                            title="How to get a GitHub token?"
                        >
                            <Info size={14} />
                        </button>
                    </div>
                    <input 
                        type="password" 
                        placeholder="GitHub Personal Access Token"
                        value={gitToken}
                        onChange={(e) => setGitToken(e.target.value)}
                        className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium transition-all"
                    />
                </div>
                
                <button 
                    type="submit"
                    className="w-full md:w-auto px-6 py-2.5 mt-5 bg-indigo-600 hover:bg-indigo-750 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer shadow-md hover:shadow-lg active:scale-98"
                >
                    Audit Repo
                </button>
            </form>

            {showTokenHelp && (
                <div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 p-6 text-xs text-zinc-650 dark:text-zinc-450 transition-all duration-200">
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
                        <Info size={16} className="text-indigo-500 dark:text-indigo-400" />
                        How to get a GitHub Personal Access Token (PAT)
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <ol className="list-decimal list-inside space-y-2.5 leading-relaxed font-medium">
                            <li>Go to <strong>GitHub.com</strong> and sign in.</li>
                            <li>Click your <strong>Profile Icon</strong> (top-right) &rarr; <strong>Settings</strong>.</li>
                            <li>On the left sidebar, scroll down and click <strong>Developer settings</strong>.</li>
                            <li>Go to <strong>Personal access tokens</strong> &rarr; <strong>Fine-grained tokens</strong>.</li>
                        </ol>
                        
                        <ol className="list-decimal list-inside space-y-2.5 leading-relaxed font-medium" start="5">
                            <li>Click <strong>Generate new token</strong>.</li>
                            <li>Select <strong>Only select repositories</strong> &rarr; Choose your target private repo.</li>
                            <li>Under <strong>Repository Permissions</strong>:
                                <ul className="list-disc list-inside ml-5 mt-1 space-y-1 text-zinc-500 dark:text-zinc-500 font-normal">
                                    <li>Set <strong>Contents</strong> to <span className="font-semibold text-zinc-700 dark:text-zinc-350">Read-only</span> (Required to clone code)</li>
                                    <li>Set <strong>Metadata</strong> to <span className="font-semibold text-zinc-700 dark:text-zinc-350">Read-only</span> (Auto-selected)</li>
                                </ul>
                            </li>
                            <li>Click <strong>Generate token</strong> and copy the generated token string.</li>
                        </ol>
                    </div>
                    
                    <div className="mt-5 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-zinc-500 dark:text-zinc-500">
                        <span className="italic">Note: Your token is processed strictly in-memory and never cached or saved to a database.</span>
                        <a 
                            href="https://github.com/settings/tokens?type=beta" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                        >
                            Open GitHub Settings <ExternalLink size={12} />
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
