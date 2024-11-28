import React, { useState } from "react";

interface LintMessage {
  ruleId: string;
  severity: "warning" | "error";
  message: string;
  line: number;
  column: number;
}

interface LintFile {
  filePath: string;
  errorCount: number;
  warningCount: number;
  messages: LintMessage[];
}

interface LintReportProps {
  lintReport: {
    totalErrors: number;
    totalWarnings: number;
    files: LintFile[];
    dependencies?: {
      name: string;
      lintIssues: number;
    }[];
  };
  onFileSelect?: (filePath: string) => void;
}

const LintReport: React.FC<LintReportProps> = ({ lintReport }) => {
  const [filterSeverity, setFilterSeverity] = useState<
    "all" | "error" | "warning"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFiles, setExpandedFiles] = useState<Set<number>>(new Set());

  if (!lintReport) return null;

  const toggleFileExpansion = (index: number) => {
    const newExpanded = new Set(expandedFiles);
    if (expandedFiles.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedFiles(newExpanded);
  };

  const expandAll = () => {
    const allIndices = new Set(lintReport.files.map((_, i) => i));
    setExpandedFiles(allIndices);
  };

  const collapseAll = () => {
    setExpandedFiles(new Set());
  };

  const filteredFiles = lintReport.files.filter((file) => {
    const matchesSearch = file.filePath
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const hasFilteredMessages = file.messages.some((msg) => {
      if (filterSeverity === "all") return true;
      return msg.severity === filterSeverity;
    });
    return matchesSearch && hasFilteredMessages;
  });

  const IssuesTrend = ({ files }: { files: any }) => {
    const issuesByType = files.reduce((acc: any, file: any) => {
      file.messages.forEach((msg: any) => {
        const type = msg.ruleId || "unknown";
        acc[type] = (acc[type] || 0) + 1;
      });
      return acc;
    }, {});

    return (
      <div className="mt-4 p-3 bg-neutral-700/50 rounded">
        <h3 className="text-sm font-semibold mb-2">Most Common Issues</h3>
        <div className="space-y-2">
          {Object.entries(issuesByType)
            .sort(([, a], [, b]) => (b as number) - (a as number))
            .slice(0, 5)
            .map(([rule, count]) => (
              <div key={rule} className="flex justify-between text-xs">
                <span>{rule}</span>
                <span>{String(count)}</span>
              </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-neutral-800 col-span-2 rounded-lg p-5 text-white text-sm ">
      <h2 className="text-lg font-semibold mb-4">Lint Analysis</h2>

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <div className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
              <span>{lintReport.totalErrors} Errors</span>
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
              <span>{lintReport.totalWarnings} Warnings</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={expandAll}
              className="px-2 py-1 text-xs bg-neutral-700 rounded hover:bg-neutral-600"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-2 py-1 text-xs bg-neutral-700 rounded hover:bg-neutral-600"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-neutral-700 rounded px-3 py-1 flex-grow"
          />
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value as any)}
            className="bg-neutral-700 rounded px-3 py-1"
          >
            <option value="all">All Issues</option>
            <option value="error">Errors Only</option>
            <option value="warning">Warnings Only</option>
          </select>
        </div>
      </div>

      {/* File List */}
      <div className="space-y-4">
        {filteredFiles.map((file, index) => (
          <div key={index} className="border border-neutral-700 rounded">
            <button
              onClick={() => toggleFileExpansion(index)}
              className="w-full p-3 text-left hover:bg-neutral-700/50 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span
                    className={`transform transition-transform ${
                      expandedFiles.has(index) ? "rotate-90" : ""
                    }`}
                  >
                    ▶
                  </span>
                  <span className="text-neutral-400">{file.filePath}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-red-500">{file.errorCount} errors</span>
                  <span className="text-yellow-500">
                    {file.warningCount} warnings
                  </span>
                </div>
              </div>
            </button>

            {expandedFiles.has(index) && (
              <div className="p-3 border-t border-neutral-700 space-y-2">
                {file.messages
                  .filter(
                    (msg) =>
                      filterSeverity === "all" ||
                      msg.severity === filterSeverity
                  )
                  .map((msg, msgIndex) => (
                    <div
                      key={msgIndex}
                      className={`text-xs p-2 rounded ${
                        msg.severity === "error"
                          ? "bg-red-950"
                          : "bg-yellow-950"
                      }`}
                    >
                      <div className="flex justify-between">
                        <span>{msg.message}</span>
                        <span className="text-neutral-400">
                          Line {msg.line}, Col {msg.column}
                        </span>
                      </div>
                      <span className="text-neutral-400">{msg.ruleId}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {filteredFiles.length === 0 && (
        <div className="text-center text-neutral-400 py-8">
          No lint issues found matching your criteria
        </div>
      )}
      <IssuesTrend files={lintReport.files} />
    </div>
  );
};

export default LintReport;
