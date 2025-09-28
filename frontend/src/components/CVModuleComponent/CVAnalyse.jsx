import React, { useState, useMemo } from "react";
import api from "../../lib/axios";

// --- Reusable Circular Progress Component ---
const CircularProgress = ({ score, category }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let strokeColor;
  if (score >= 90) strokeColor = "#22c55e"; // Green 500
  else if (score >= 70) strokeColor = "#84cc16"; // Lime 500
  else if (score >= 50) strokeColor = "#f59e0b"; // Amber 500
  else strokeColor = "#ef4444"; // Red 500

  return (
    <div className="flex flex-col items-center justify-center">
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
      {category && <p className="mt-2 text-sm font-semibold text-gray-500">{category}</p>}
    </div>
  );
};

// --- Feedback Card Component ---
const FeedbackCard = ({ category, score, summary, feedback_points }) => {
  let borderColor;
  if (score >= 90) borderColor = "border-green-500";
  else if (score >= 70) borderColor = "border-lime-500";
  else if (score >= 50) borderColor = "border-amber-500";
  else borderColor = "border-red-500";

  return (
    <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${borderColor}`}>
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        {category} <span className="text-lg font-medium text-gray-500">({score}/100)</span>
      </h3>
      <p className="text-gray-600 italic mb-4">"{summary}"</p>
      <ul className="space-y-3 list-disc list-inside">
        {feedback_points.map((point, index) => (
          <li key={index} className="text-gray-700 leading-relaxed">
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
};

// --- Main App Component ---
export default function CVAnalyse() {
  const [file, setFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (
      selectedFile &&
      (selectedFile.type === "application/pdf" ||
        selectedFile.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    ) {
      setFile(selectedFile);
      setError("");
    } else {
      setFile(null);
      setError("Please upload a valid PDF or DOCX file.");
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setIsLoading(true);
    setError("");
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append("cv", file);

    try {
      // --- API CALL TO YOUR BACKEND ---
      // Make sure your Node.js server is running.
      // Replace 'http://localhost:3001' with your actual server URL if it's different.
      const response = await api.post("/users/me/cv/analyze-cv", formData, {
        withCredentials: true
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      setError(err.message || "An unknown error occurred.");
      console.error("Analysis error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setAnalysisResult(null);
    setError("");
    setIsLoading(false);
    // Reset the file input visually
    document.getElementById("cv-upload").value = null;
  };

  const overallScore = useMemo(() => {
    if (!analysisResult?.analysis) return 0;
    const total = analysisResult.analysis.reduce((acc, curr) => acc + curr.score, 0);
    return Math.round(total / analysisResult.analysis.length);
  }, [analysisResult]);

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      <div className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">AI Resume Analyzer</h1>
          <p className="text-lg text-gray-500 mt-2">
            Get instant feedback on your CV to land your dream job.
          </p>
        </header>

        {!analysisResult && (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <svg
                className="w-16 h-16 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <label
                htmlFor="cv-upload"
                className="cursor-pointer font-semibold text-blue-600 hover:text-blue-800"
              >
                Upload your CV
                <input
                  id="cv-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.docx"
                />
              </label>
              <p className="text-sm text-gray-500 mt-1">PDF or DOCX only</p>
              {file && <p className="text-green-600 font-medium mt-4">{file.name}</p>}
            </div>

            {error && <p className="text-red-500 text-center mt-4">{error}</p>}

            <div className="mt-6">
              <button
                onClick={handleAnalyze}
                disabled={!file || isLoading}
                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  "Analyze My Resume"
                )}
              </button>
            </div>
          </div>
        )}

        {analysisResult && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-800">Your Results are In!</h2>
                <p className="text-gray-500">
                  Here's a breakdown of your resume's strengths and weaknesses.
                </p>
                <button
                  onClick={handleReset}
                  className="mt-4 bg-gray-200 text-gray-700 font-semibold py-2 px-5 rounded-lg hover:bg-gray-300 transition-colors duration-300"
                >
                  Analyze Another CV
                </button>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-600 mb-2">Overall Score</p>
                <CircularProgress score={overallScore} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {analysisResult.analysis.map((item, index) => (
                <FeedbackCard key={index} {...item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
