require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Global middleware
app.use(cors());
app.use(express.json());

// Base Route
app.get('/', (req, res) => {
    res.send('Automated Tech-Debt Auditor API is running!');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

const { runAudit } = require('./scanner/index');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

// Audit repository endpoint
app.post('/api/audit', async (req, res) => {
    const { repoUrl, gitToken } = req.body;

    if (!repoUrl) {
        return res.status(400).json({ error: 'Repository URL (repoUrl) is required.' });
    }

    // Create a unique temporary directory for this audit request
    const tempDirId = crypto.randomUUID();
    const tempDir = path.join(__dirname, 'temp-audits', `audit-${tempDirId}`);

    console.log(`📥 Received audit request for URL: ${repoUrl}`);
    
    // Inject token for private authentication if provided
    let cloneUrl = repoUrl;
    if (gitToken) {
        console.log(`🔑 GitHub token provided, preparing authenticated clone url.`);
        if (cloneUrl.startsWith('https://')) {
            cloneUrl = cloneUrl.replace('https://', `https://${gitToken}@`);
        }
    }

    try {
        // Step A: Ensure temporary directory parent exists
        await fs.mkdir(path.join(__dirname, 'temp-audits'), { recursive: true });

        // Step B: Clone the repository (shallow clone --depth 1 for speed)
        console.log(`🌀 Cloning repository into: ${tempDir}`);
        await execPromise(`git clone --depth 1 ${cloneUrl} "${tempDir}"`);
        console.log(`✅ Clone complete. Starting scanner...`);

        // Step C: Run the static audit scanner
        const findings = await runAudit(tempDir);

        // Step D: Send response to the client
        res.json({
            message: 'Audit completed successfully',
            repoUrl,
            findingsCount: findings.length,
            findings
        });

    } catch (error) {
        console.error('❌ Audit failure:', error);
        res.status(500).json({
            error: 'Failed to process repository audit.',
            details: error.message
        });
    } finally {
        // Step E: Cleanup: recursive force delete the temporary folder
        try {
            console.log(`🧹 Cleaning up temporary directory: ${tempDir}`);
            await fs.rm(tempDir, { recursive: true, force: true });
            console.log(`✅ Temp cleanup successful.`);
        } catch (cleanupError) {
            console.error(`⚠️ Failed to remove temp directory ${tempDir}:`, cleanupError);
        }
    }
});


// Boot the server
app.listen(PORT, () => {
    console.log(`🚀 Auditor Server listening on http://localhost:${PORT}`);
});
