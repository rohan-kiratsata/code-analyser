"use client";

import React, { useState } from "react";
import axios from "axios";

function App() {
  const [repoUrl, setRepoUrl] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await axios.post("http://localhost:5000/analyze", {
        repoUrl,
      });
      setAnalysis(response.data);
    } catch (error: any) {
      setError(error.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-3xl font-bold mb-5 text-center">
            GitHub Repo Analyzer
          </h1>
          <form onSubmit={handleSubmit} className="mb-5">
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="Enter GitHub repo URL"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-3 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </form>
          {error && <p className="text-red-500 mb-5">{error}</p>}
          {analysis && (
            <div className="analysis">
              <h2 className="text-2xl font-semibold mb-3">Analysis Results</h2>
              <div className="mb-5">
                <h3 className="text-xl font-semibold mb-2">Repository Info:</h3>
                <p>
                  <strong>Owner:</strong> {analysis.owner}
                </p>
                <p>
                  <strong>Name:</strong> {analysis.name}
                </p>
                <p>
                  <strong>Description:</strong> {analysis.description}
                </p>
                <p>
                  <strong>Stars:</strong> {analysis.stars}
                </p>
                <p>
                  <strong>Forks:</strong> {analysis.forks}
                </p>
              </div>
              <div className="mb-5">
                <h3 className="text-xl font-semibold mb-2">Dependencies:</h3>
                <ul className="list-disc list-inside">
                  {analysis.dependencies.map((dep: string) => (
                    <li key={dep}>{dep}</li>
                  ))}
                </ul>
              </div>
              <div className="mb-5">
                <h3 className="text-xl font-semibold mb-2">
                  Dev Dependencies:
                </h3>
                <ul className="list-disc list-inside">
                  {analysis.devDependencies.map((dep: string) => (
                    <li key={dep}>{dep}</li>
                  ))}
                </ul>
              </div>
              {/* <div className="mb-5">
                <h3 className="text-xl font-semibold mb-2">
                  Dependencies Graph:
                </h3>
                <DependencyGraph
                  dependencies={[
                    ...analysis.dependencies.map((dep: string) => ({
                      name: dep,
                      size: 100,
                    })),
                    ...analysis.devDependencies.map((dep: string) => ({
                      name: dep,
                      size: 50,
                    })),
                  ]}
                />
              </div> */}
              <div>
                <h3 className="text-xl font-semibold mb-2">Project Size:</h3>
                <p>{analysis.size}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
