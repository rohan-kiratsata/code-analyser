"use client";

import React, { useState, useEffect } from "react";
import { LoadingSplash } from "@/components/loading-splash";
import axios from "axios";
import Link from "next/link";
import LintReport from "@/components/lint-report";
import DependencyList from "@/components/dependency-list";
import DependencyGraph from "@/components/dependency-graph";

function App() {
  const [repoUrl, setRepoUrl] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowLoading(true);
    setError(null);
    setAnalysis(null);
    setAnalysisComplete(false);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/analyze`,
        {
          repoUrl,
        }
      );
      setAnalysis(response.data);
      console.log("analysis:", analysis);
      setAnalysisComplete(true);
    } catch (error: any) {
      setError(error.response?.data?.error || "An error occurred");
      setShowLoading(false);
    }
  };

  useEffect(() => {
    if (analysis) {
      console.log("analysis:", analysis);
    }
  }, [analysis]);

  return (
    <div className="min-h-screen bg-black bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px]">
      {analysis || showLoading ? null : (
        <div className="flex w-full flex-col items-center h-screen justify-center">
          <p className="text-2xl text-white font-medium">
            GitHub Repo Analyser
          </p>
          <p className=" mb-5 text-gray-400">
            Get analysis and report of your node.js project
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex items-center w-fit bg-neutral-800 rounded-full px-3 py-3"
          >
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="GitHub repo URL"
              required
              className="w-[600px] text-white rounded-md bg-transparent focus:outline-none px-2"
            />
            <button
              type="submit"
              disabled={loading}
              className="p-1 bg-indigo-600 hover:bg-indigo-700 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-up"
              >
                <path d="m5 12 7-7 7 7" />
                <path d="M12 19V5" />
              </svg>
            </button>
          </form>
        </div>
      )}
      {showLoading ? (
        <div className="w-full flex items-center justify-center my-28">
          <LoadingSplash onComplete={() => setShowLoading(false)} />
        </div>
      ) : (
        <>
          {analysis ? (
            <div className="grid grid-cols-2 max-w-4xl mx-auto py-10 gap-3 font-mono">
              <div className="bg-neutral-800 rounded-lg p-5 text-white text-sm">
                <Link
                  href={`https://github.com/${analysis.owner}/${analysis.name}`}
                  className="text-sm underline text-green-300"
                >
                  github.com/{analysis.owner}/{analysis.name}
                </Link>
                <div className="flex justify-between flex-col mt-5 text-sm">
                  <span className="text-neutral-400">DESCRIPTION</span>
                  <span className="text-xs">{analysis.description}</span>
                </div>

                <div className="flex justify-between mt-5">
                  <span className="text-neutral-400">SIZE</span>
                  <span>{analysis.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">STARS</span>
                  <span>{analysis.stars}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">FORKS</span>
                  <span>{analysis.forks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">OWNER</span>
                  <Link
                    href={`https://github.com/${analysis.owner}`}
                    className="underline text-green-300"
                  >
                    {analysis.owner}
                  </Link>
                </div>
              </div>
              <DependencyList
                dependencies={analysis.dependencies}
                devDependencies={analysis.devDependencies}
              />
              <DependencyGraph
                dependencies={analysis.dependencies}
                devDependencies={analysis.devDependencies}
              />
              <LintReport lintReport={analysis.lintReport} />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

export default App;
