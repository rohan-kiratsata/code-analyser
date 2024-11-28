// const simpleGit = require("simple-git");
import simpleGit from "simple-git";
import fs from 'fs-extra'
import path from "path";
import axios from "axios";

const {ESLint} = require("eslint")

async function analyzeRepo(repoUrl) {
  let tempDir;
  try {
    const [, owner, repo] = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    tempDir = path.join(__dirname, "temp", `${owner}-${repo}`);

    // Check if the directory already exists
    if (await fs.pathExists(tempDir)) {
      // Remove the existing directory
      await fs.remove(tempDir);
    }

    await fs.ensureDir(tempDir);

    const repoInfo = await fetchRepoInfo(owner, repo);

    await simpleGit().clone(repoUrl, tempDir);

    const packageJsonPath = path.join(tempDir, "package.json");
    if (!(await fs.pathExists(packageJsonPath))) {
      throw new Error("Not a Node.js repository: package.json not found");
    }

    const packageJson = await fs.readJson(packageJsonPath);
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    // Check if the repository contains only package.json
    const files = await fs.readdir(tempDir);
    if (files.length === 1 && files[0] === "package.json") {
      throw new Error("Invalid repository: Contains only package.json");
    }

    // Lint report
    const lintResult = await runLintAnalysis(tempDir);

    const size = await calculateDirectorySize(tempDir);

    const result = {
      owner,
      name: repo,
      description: repoInfo.description,
      stars: repoInfo.stargazers_count,
      forks: repoInfo.forks_count,
      dependencies: Object.keys(dependencies),
      devDependencies: Object.keys(devDependencies),
      size: formatBytes(size),
      lintReport: lintResult,
    };

    // Schedule temp directory deletion after response is sent
    process.nextTick(() => {
      fs.remove(tempDir).catch((err) =>
        console.error("Error deleting temp directory:", err)
      );
    });

    return result;
  } catch (error) {
    // Ensure temp directory is deleted in case of error
    if (tempDir) {
      await fs
        .remove(tempDir)
        .catch((err) => console.error("Error deleting temp directory:", err));
    }
    throw new Error(`Error analyzing repository: ${error.message}`);
  }
}

// Uses github api to fetch repo details
// !IMPORTANT : potential issue: rate limiting api hits. maybe add auth in future
async function fetchRepoInfo(owner, repo) {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching repository info: ${error.message}`);
  }
}

// calculates the size of project directory
async function calculateDirectorySize(directoryPath) {
  const files = await fs.readdir(directoryPath, { withFileTypes: true });
  let size = 0;

  for (const file of files) {
    const filePath = path.join(directoryPath, file.name);
    if (file.isDirectory()) {
      size += await calculateDirectorySize(filePath);
    } else {
      const { size: fileSize } = await fs.stat(filePath);
      size += fileSize;
    }
  }

  return size;
}
// cals size of project
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

// function to run lint analysis
async function runLintAnalysis(directory) {
  try {
    const eslint = new ESLint({
      useEslintrc: false,
      baseConfig: {
        extends: ["eslint:recommended"],
        parserOptions: {
          ecmaVersion: 2020,
          sourceType: "module",
        },
        env: {
          node: true,
          es6: true,
        }
      }
    });

    // Get all JS/TS files in the directory
    const files = await getAllJsFiles(directory);
    
    // Run ESLint
    const results = await eslint.lintFiles(files);
    
    // Format the results
    return {
      totalErrors: results.reduce((total, result) => total + result.errorCount, 0),
      totalWarnings: results.reduce((total, result) => total + result.warningCount, 0),
      files: results.map(result => ({
        filePath: path.relative(directory, result.filePath),
        errorCount: result.errorCount,
        warningCount: result.warningCount,
        messages: result.messages.map(msg => ({
          ruleId: msg.ruleId,
          severity: msg.severity === 1 ? 'warning' : 'error',
          message: msg.message,
          line: msg.line,
          column: msg.column,
        })),
      })),
    };
  } catch (error) {
    console.error("Lint analysis error:", error);
    return {
      error: 'Failed to run lint analysis',
      details: error.message,
    };
  }
}

async function getAllJsFiles(directory) {
  const files = [];
  
  async function traverse(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        await traverse(fullPath);
      } else if (entry.isFile() && /\.js$|\.ts$/i.test(entry.name)) {
        files.push(fullPath);
      }
    }
  }
  
  await traverse(directory);
  
  return files;
}

export default analyzeRepo;
