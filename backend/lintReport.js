const { ESLint } = require('eslint');
const path = require('path');
const fs = require('fs-extra');

async function analyzeLint(directoryPath) {
  const eslint = new ESLint({
    useEslintrc: false,
    overrideConfig: {
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
      ],
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
      }
    }
  });

  const results = {
    errorCount: 0,
    warningCount: 0,
    issues: [],
    filesAnalyzed: 0
  };

  async function analyzeFile(filePath) {
    if (filePath.includes('node_modules')) return;
    
    const ext = path.extname(filePath);
    if (!['.js', '.ts', '.jsx', '.tsx'].includes(ext)) return;

    try {
      const lintResults = await eslint.lintFiles([filePath]);
      results.filesAnalyzed++;
      
      lintResults.forEach(result => {
        results.errorCount += result.errorCount;
        results.warningCount += result.warningCount;
        
        result.messages.forEach(msg => {
          results.issues.push({
            file: path.relative(directoryPath, result.filePath),
            line: msg.line,
            column: msg.column,
            severity: msg.severity === 2 ? 'error' : 'warning',
            message: msg.message,
            rule: msg.ruleId
          });
        });
      });
    } catch (error) {
      console.error(`Error linting ${filePath}:`, error);
    }
  }

  async function walkDir(dir) {
    const files = await fs.readdir(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) {
        await walkDir(filePath);
      } else {
        await analyzeFile(filePath);
      }
    }
  }

  await walkDir(directoryPath);
  return results;
}

module.exports = analyzeLint;