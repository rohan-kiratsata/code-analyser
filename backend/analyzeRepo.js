const simpleGit = require("simple-git");
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

async function analyzeRepo(repoUrl) {
  try {
    const [, owner, repo] = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    const tempDir = path.join(__dirname, "temp", `${owner}-${repo}`);
    await fs.ensureDir(tempDir);

    const repoInfo = await fetchRepoInfo(owner, repo);

    await simpleGit().clone(repoUrl, tempDir);

    const packageJsonPath = path.join(tempDir, "package.json");
    const packageJson = await fs.readJson(packageJsonPath);
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    const size = await calculateDirectorySize(tempDir);

    await fs.remove(tempDir);

    return {
      owner,
      name: repo,
      description: repoInfo.description,
      stars: repoInfo.stargazers_count,
      forks: repoInfo.forks_count,
      dependencies: Object.keys(dependencies),
      devDependencies: Object.keys(devDependencies),
      size: formatBytes(size),
    };
  } catch (error) {
    throw new Error(`Error analyzing repository: ${error.message}`);
  }
}

// Uses github api to fetch repo details
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

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

module.exports = analyzeRepo;
