/**
 * Local Offline Heuristic Scorer Engine.
 */
function calculateRiskAndExplanationLocal(category, comment, commitDateString) {
    // Standard starting scores by category severity
    let baseScore = 3;
    if (category === 'HACK') baseScore = 5;
    if (category === 'FIXME') baseScore = 7;

    // Neglect penalty: Add +1 score point for every 30 days old the comment is
    const createdDate = new Date(commitDateString);
    const today = new Date();
    const diffTime = Math.abs(today - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const agePenalty = Math.floor(diffDays / 30);
    let riskScore = baseScore + agePenalty;

    // Cap the risk score at a maximum of 10
    if (riskScore > 10) riskScore = 10;

    // Heuristic explanation generator
    let explanation = `Local static analysis fallback. This item is categorized as a ${category} and has been active in the codebase for ${diffDays} days.`;
    
    if (riskScore >= 7) {
        explanation += ` ⚠️ High alert: unresolved item with severe neglect risk of ${riskScore}. Please review immediately.`;
    } else {
        explanation += ` Standard planning backlog item.`;
    }

    // Generate simple pattern-based offline fix suggestions
    let fixSuggestion = `// TODO: Refactor local ${category} comment:\n// "${comment}"`;
    const commentLower = comment.toLowerCase();
    
    if (commentLower.includes('key') || commentLower.includes('token') || commentLower.includes('password') || commentLower.includes('secret')) {
        fixSuggestion = `// 💡 Suggested Security Fix:\n// Move secrets to environment variables to avoid exposure in source control.\nconst CONFIG_SECRET = process.env.SECRET_KEY || "fallback_placeholder";`;
    } else if (commentLower.includes('hardcod') || commentLower.includes('temp') || commentLower.includes('mock')) {
        fixSuggestion = `// 💡 Suggested Clean Code Fix:\n// Extract config options to a configuration file or environment variables.\nconst runtimeConfig = {\n    option: process.env.CONFIG_OPTION || "value"\n};`;
    } else if (commentLower.includes('null') || commentLower.includes('undef') || commentLower.includes('crash') || commentLower.includes('error')) {
        fixSuggestion = `// 💡 Suggested Defensive Code Fix:\n// Implement robust guard clauses or optional chaining to prevent crashes.\nif (!value) {\n    throw new Error("Value must be defined");\n}`;
    } else if (category === 'FIXME') {
        fixSuggestion = `// 💡 Suggested Refactoring:\n// FIXME indicates known broken behavior. Implement a safeguard wrapper:\ntry {\n    // Resolve: ${comment}\n} catch (error) {\n    console.error("Critical error handled:", error);\n}`;
    }

    return {
        riskScore,
        explanation,
        fixSuggestion
    };
}

module.exports = { calculateRiskAndExplanationLocal };
