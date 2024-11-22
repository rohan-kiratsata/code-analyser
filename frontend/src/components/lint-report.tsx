import React from "react";

interface LintIssue {
  file: string;
  line: number;
  column: number;
  severity: "error" | "warning";
  message: string;
  rule: string;
}

interface LintAnalysis {
  errorCount: number;
  warningCount: number;
  filesAnalyzed: number;
  issues: LintIssue[];
}

interface LintReportProps {
  lintAnalysis: LintAnalysis;
}

const LintReport: React.FC<LintReportProps> = ({ lintAnalysis }) => {
  return (
    <div className="bg-neutral-800 rounded-lg p-5 text-white">
      <h2 className="text-xl font-semibold mb-4">Lint Analysis</h2>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-neutral-700 p-3 rounded">
          <p className="text-sm">Files Analyzed</p>
          <p className="text-2xl">{lintAnalysis.filesAnalyzed}</p>
        </div>
        <div className="bg-red-900/50 p-3 rounded">
          <p className="text-sm">Errors</p>
          <p className="text-2xl">{lintAnalysis.errorCount}</p>
        </div>
        <div className="bg-yellow-900/50 p-3 rounded">
          <p className="text-sm">Warnings</p>
          <p className="text-2xl">{lintAnalysis.warningCount}</p>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {lintAnalysis.issues.map((issue, index) => (
          <div key={index} className="border-t border-neutral-700 py-2">
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded text-xs ${
                  issue.severity === "error"
                    ? "bg-red-900/50"
                    : "bg-yellow-900/50"
                }`}
              >
                {issue.severity}
              </span>
              <span className="text-neutral-400 text-sm">
                {issue.file}:{issue.line}
              </span>
            </div>
            <p className="mt-1 text-sm">{issue.message}</p>
            <p className="text-xs text-neutral-500 mt-1">Rule: {issue.rule}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LintReport;
