const { exec } = require('child_process');
const util = require('util');

// Promisify callback-based child_process.exec into a Promise-based function
const execPromise = util.promisify(exec);

/**
 * Git Version Control Adapter.
 * (VCS operations will be implemented here in Tasks 12-14)
 */
const GitAdapter = {
    async getLineHistory(relativePath, lineNumber, repoPath) {
        let author = "Unknown";
        let commitDate = new Date().toISOString();

        try {
            // Execute the Git blame CLI command on a single line number
            // --porcelain outputs details in key-value structure
            const { stdout } = await execPromise(
                `git blame -L ${lineNumber},${lineNumber} --porcelain ${relativePath}`,
                repoPath ? { cwd: repoPath } : {}
            );

            // Extract the author name and the commit epoch timestamp (seconds since 1970)
            const authorMatch = stdout.match(/^author (.+)$/m);
            const dateMatch = stdout.match(/^author-time (.+)$/m);

            if (authorMatch) author = authorMatch[1];
            if (dateMatch) {
                // Javascript Date expects milliseconds, so we multiply git's timestamp by 1000
                commitDate = new Date(parseInt(dateMatch[1]) * 1000).toISOString();
            }
        } catch (error) {
            // Fallback if the file or line is not yet committed to Git
            console.log(`⚠️ Git blame failed for line in ${relativePath}: ${error.message}`);
        }

        return { author, commitDate };
    }
};

module.exports = { GitAdapter };
