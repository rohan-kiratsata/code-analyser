"use client";

import React, { useState, useEffect } from "react";
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
      const response = await axios.post("http://localhost:5000/analyze", {
        repoUrl,
      });
      setAnalysis(response.data);
      setAnalysisComplete(true);
    } catch (error: any) {
      setError(error.response?.data?.error || "An error occurred");
      setShowLoading(false);
    }
  };

  return (
    <>
      <div className="flex w-full justify-between mt-10">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-full"
        >
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="GitHub repo URL"
            required
            className="w-[400px] px-3 py-2 border border-neutral-700 placeholder-neutral-500 text-white rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-700"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 transition-all ease-in-out rounded-md w-[400px] mt-3 text-white font-medium"
          >
            {/* {loading ? "Analyzing..." : "Analyze"} */}
            Analyze
          </button>
        </form>
      </div>
      {showLoading ? (
        <div className="w-full flex items-center justify-center my-28">
          <LoadingSplash onComplete={() => setShowLoading(false)} />
        </div>
      ) : (
        <>Hi show anaylsis</>
      )}
    </>
  );
}

export default App;

const LoadingSplash = ({ onComplete }: { onComplete: () => void }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    "Cloning Repo...",
    "Analyzing Dependencies...",
    "Generating Report...",
    "Almost Done...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => {
        if (prev === messages.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (messageIndex === messages.length - 1) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [messageIndex, onComplete]);

  return (
    <>
      <div className="flex items-center flex-col justify-center">
        <div className="">
          <div className="loader">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
        <span className="text-lg font-semibold text-white">
          {messages[messageIndex]}
        </span>
      </div>
    </>
  );
};
