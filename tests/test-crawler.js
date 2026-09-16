const { getAllFiles } = require('../scanner/crawler');
const path = require('path');

async function runTest() {
    console.log('🔍 Testing crawler on project root directory...');
    try {
        const files = await getAllFiles(path.join(__dirname, '..'));
        console.log('✅ Files found by crawler:');
        files.forEach(f => console.log(` - ${f}`));
        console.log(`\nTotal files found: ${files.length}`);
    } catch (err) {
        console.error('❌ Crawler test failed:', err);
    }
}

runTest();
