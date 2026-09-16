const { getAllFiles } = require('./crawler');
const { GitAdapter } = require('./adapters/git-adapter');
const { auditComment } = require('./scorer/router');
const fs = require('fs').promises;
const path = require('path');

// Configure which VCS adapter to use (Modular Adapter plug-in)
const ActiveVCSAdapter = GitAdapter;

// Regex matching developer comment markers
const DEBT_REGEX = /\/\/\s*(TODO|FIXME|HACK):(.*)/g;

/**
 * Scan a single file for tech debt comments, parsing occurrences and fetching blame history.
 */
async function scanFileForDebt(file, directory) {
    const fileDebts = [];
    
    try {
        const content = await fs.readFile(file, 'utf8');
        const relativePath = path.relative(directory, file);
        
        let match;
        const blamePromises = [];

        // Traverse the file content to find tech debt comment occurrences
        while ((match = DEBT_REGEX.exec(content)) !== null) {
            const lineNumber = content.substring(0, match.index).split('\n').length;
            const category = match[1];
            const comment = match[2].trim();

            // Fire git blame check and scorer in background (Task 25 will optimize concurrency)
            const promise = ActiveVCSAdapter.getLineHistory(relativePath, lineNumber, directory).then(async ({ author, commitDate }) => {
                const auditResult = await auditComment(category, comment, commitDate);
                
                fileDebts.push({
                    category: auditResult.aiCategory || category,
                    comment,
                    explanation: auditResult.explanation,
                    riskScore: auditResult.riskScore,
                    fixSuggestion: auditResult.fixSuggestion,
                    file: relativePath.replace(/\\/g, '/'), // cross-platform slash fix
                    line: lineNumber,
                    author,
                    createdAt: commitDate
                });
            });
            
            blamePromises.push(promise);
        }

        await Promise.all(blamePromises);
    } catch (error) {
        console.error(`❌ Scanner failed to audit file ${file}:`, error);
    }

    return fileDebts;
}

/**
 * Orchestrate the full directory audit, crawling all target files
 * and scanning them concurrently.
 */
async function runAudit(directory) {
    console.log(`🔍 Starting audit on directory: ${directory}...`);
    const startTime = Date.now();

    try {
        // Step A: Find all files recursively (Async)
        const files = await getAllFiles(directory);
        console.log(`📂 Found ${files.length} code files. Initiating parallel scans...`);

        // Step B: Map each file to a scanning promise
        const scanPromises = files.map(file => scanFileForDebt(file, directory));

        // Step C: Run all file scans concurrently!
        const resultsArray = await Promise.all(scanPromises);

        // Step D: Flatten the nested arrays into a single report card
        const allDebts = resultsArray.flat();

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`✅ Audit complete! Found ${allDebts.length} tech-debt items in ${duration}s.`);
        
        return allDebts;
    } catch (error) {
        console.error('❌ Root audit orchestrator failed:', error);
        return [];
    }
}

module.exports = { runAudit };