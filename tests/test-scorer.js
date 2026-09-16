const { auditComment } = require('../scanner/scorer/router');

async function runTest() {
    console.log('🔍 Testing Scorer Engine Fallback Behavior...');
    
    // We run a test comment. Without GEMINI_API_KEY being set, it should fallback to local rules
    const category = 'FIXME';
    const comment = 'Critical null pointer crash inside user login payload';
    const fakeCommitDate = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(); // 45 days old

    try {
        console.log(`\nAudit Comment: "${comment}"`);
        console.log(`Commit Age: 45 days old`);
        
        const result = await auditComment(category, comment, fakeCommitDate);
        
        console.log('✅ Scorer query returned successfully:');
        console.log(` - Risk Score:     ${result.riskScore} (Expected base 7 + age penalty 1 = 8)`);
        console.log(` - AI Category:    ${result.aiCategory}`);
        console.log(` - Explanation:    ${result.explanation}`);
        console.log(` - Code Suggest:   ${result.fixSuggestion.replace(/\n/g, '\n   ')}`);
    } catch (err) {
        console.error('❌ Scorer fallback test failed:', err);
    }
}

runTest();
