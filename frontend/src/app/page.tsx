"use client";

import React, { useState } from "react";
import axios from "axios";

function App() {
  const [repoUrl, setRepoUrl] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e: any) => {
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
    <div className="App">
      <h1>GitHub Repo Analyzer</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="Enter GitHub repo URL"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {analysis && (
        <div className="analysis">
          <h2>Analysis Results</h2>
          <h3>Dependencies:</h3>
          <ul>
            {analysis.dependencies.map((dep: any) => (
              <li key={dep}>{dep}</li>
            ))}
          </ul>
          <h3>Dev Dependencies:</h3>
          <ul>
            {analysis.devDependencies.map((dep: any) => (
              <li key={dep}>{dep}</li>
            ))}
          </ul>
          <h3>Project Size:</h3>
          <p>{analysis.size}</p>
        </div>
      )}
    </div>
  );
}

export default App;
