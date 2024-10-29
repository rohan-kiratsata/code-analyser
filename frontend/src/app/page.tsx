"use client";

import React, { useState } from "react";
import { LoadingSplash } from "@/components/loading-splash";
import axios from "axios";

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
      setAnalysisComplete(true);
    } catch (error: any) {
      setError(error.response?.data?.error || "An error occurred");
      setShowLoading(false);
    }
  };

  return (
    <>
      {analysis || showLoading ? null : (
        <div className="flex w-full flex-col items-center h-screen justify-center">
          <p className="text-2xl text-white font-medium mb-5">
            GitHub Repo Analyser
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
        <>{analysis ? <div>Hi </div> : null}</>
      )}
    </>
  );
}

export default App;
