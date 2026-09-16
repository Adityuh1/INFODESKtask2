const { callGeminiAPI } = require('./gemini-client');
const { calculateRiskAndExplanationLocal } = require('./local-engine');

/**
 * Hybrid Audit Router.
 * Attempts to audit the comment using Google Gemini. On failure, gracefully
 * degrades to local heuristic scoring rules.
 */
async function auditComment(category, comment, commitDateString) {
    try {
        // Step A: Attempt live AI evaluation using Google Gemini
        const aiResult = await callGeminiAPI(category, comment);
        
        return {
            riskScore: aiResult.riskScore,
            aiCategory: aiResult.category, // Security, Performance, Maintenance, Feature
            explanation: aiResult.explanation,
            fixSuggestion: aiResult.fixSuggestion
        };
    } catch (error) {
        // Step B: Graceful Fallback to offline rule-based heuristics
        console.log(`ℹ️ AI audit skipped: falling back to local scoring rules (${error.message})`);
        
        const localResult = calculateRiskAndExplanationLocal(category, comment, commitDateString);
        
        // Map raw comments to standard categories so the frontend filters work in local fallback mode
        let mappedCategory = 'MAINTENANCE';
        const commentLower = comment.toLowerCase();
        if (commentLower.includes('key') || commentLower.includes('token') || commentLower.includes('password') || commentLower.includes('secret')) {
            mappedCategory = 'SECURITY';
        } else if (commentLower.includes('perf') || commentLower.includes('speed') || commentLower.includes('slow') || commentLower.includes('optim') || commentLower.includes('cache') || commentLower.includes('memory') || commentLower.includes('leak')) {
            mappedCategory = 'PERFORMANCE';
        } else if (category === 'TODO') {
            mappedCategory = 'FEATURE';
        }
        
        return {
            riskScore: localResult.riskScore,
            aiCategory: mappedCategory,
            explanation: localResult.explanation,
            fixSuggestion: localResult.fixSuggestion
        };
    }
}

module.exports = { auditComment };
