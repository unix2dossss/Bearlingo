import React, { useState } from "react";
import api from "../../lib/axios";

// --- Circular Progress Component ---
const CircularProgress = ({ score }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let strokeColor;
  if (score >= 90) strokeColor = "#22c55e";
  else if (score >= 70) strokeColor = "#84cc16";
  else if (score >= 50) strokeColor = "#f59e0b";
  else strokeColor = "#ef4444";

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg className="w-32 h-32 transform -rotate-90">
        <circle
          className="text-gray-200"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="64"
          cy="64"
        />
        <circle
          className="transition-all duration-1000 ease-in-out"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke={strokeColor}
          fill="transparent"
          r={radius}
          cx="64"
          cy="64"
        />
      </svg>
      <span className="absolute text-3xl font-bold text-gray-700">{score}</span>
    </div>
  );
};

// --- Feedback Card ---
const FeedbackCard = ({ title, points }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <ul className="space-y-2 list-disc list-inside">
        {points.map((point, index) => (
          <li key={index} className="text-gray-700 leading-relaxed">
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
};

// --- Main Component ---
export default function CVAnalyse() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError("");
    setAnalysisResult(null);

    try {
      const response = await api.get("/users/me/cv/analyze-cv", { withCredentials: true });

      // Parse JSON string returned from backend
      // const feedbackJson = JSON.parse(response.data.feedback);
      setAnalysisResult(response.data.feedback);
    } catch (err) {
      setError(err.response?.data?.error || "Error analyzing CV");
      console.error("Analysis error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setError("");
    setIsLoading(false);
  };

  return (
    <div className="bg-gray-100 font-sans text-gray-800 rounded-2xl">
      <div className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8">
          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-800">AI Resume Analyzer</h1>
          <p className="text-lg text-gray-500 mt-2">
            Get instant feedback on your CV to land your dream job.
          </p>
        </header>

        {!analysisResult && (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg text-center">
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="w-full bg-purple-500 text-white font-bold py-3 px-4 rounded-3xl hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? "Analyzing..." : "Analyze My Resume"}
            </button>
          </div>
        )}

        {analysisResult && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-800">Your Results are In!</h2>
                <button
                  onClick={handleReset}
                  className="mt-4 bg-gray-200 text-gray-700 font-semibold py-2 px-5 rounded-lg hover:bg-gray-300 transition-colors duration-300"
                >
                  Analyze Again
                </button>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-600 mb-2">Overall Score</p>
                <CircularProgress score={analysisResult.score || 0} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <FeedbackCard title="Strengths" points={analysisResult.strengths || []} />
              <FeedbackCard title="Weaknesses" points={analysisResult.weaknesses || []} />
              <FeedbackCard title="Suggestions" points={analysisResult.suggestions || []} />
              <FeedbackCard title="Missing Info" points={analysisResult.missing || []} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
