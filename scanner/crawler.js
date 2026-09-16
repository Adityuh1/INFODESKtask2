const fs = require('fs').promises;
const path = require('path');

// Directories to ignore during traversal
const IGNORE_DIRS = ['node_modules', '.git', 'dist', 'build', '.github'];

/**
 * Recursively crawl directories to find target code files.
 */
async function getAllFiles(dirPath, arrayOfFiles = []) {
    try {
        const files = await fs.readdir(dirPath);

        const filePromises = files.map(async (file) => {
            const absolutePath = path.join(dirPath, file);
            const stat = await fs.stat(absolutePath);

            if (stat.isDirectory()) {
                // If it is a directory, check if it's in our ignore list
                if (!IGNORE_DIRS.includes(file)) {
                    await getAllFiles(absolutePath, arrayOfFiles);
                }
            } else if (/\.(js|ts|jsx|tsx)$/.test(file)) {
                arrayOfFiles.push(absolutePath);
            }
        });

        await Promise.all(filePromises);
    } catch (error) {
        console.error(`❌ Crawler failed to read directory ${dirPath}:`, error);
    }
    return arrayOfFiles;
}

module.exports = { getAllFiles };
