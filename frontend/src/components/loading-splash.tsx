import React, { useState, useEffect } from "react";

export const LoadingSplash = ({ onComplete }: { onComplete: () => void }) => {
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
