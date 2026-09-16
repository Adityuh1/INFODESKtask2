const { GitAdapter } = require('../scanner/adapters/git-adapter');

async function runTest() {
    console.log('🔍 Testing GitAdapter blame parser on package.json, Line 1...');
    try {
        const result = await GitAdapter.getLineHistory('package.json', 1);
        console.log('✅ Git blame query successful:');
        console.log(` - Author: ${result.author}`);
        console.log(` - Date:   ${result.commitDate}`);
    } catch (err) {
        console.error('❌ GitAdapter test failed:', err);
    }
}

runTest();
