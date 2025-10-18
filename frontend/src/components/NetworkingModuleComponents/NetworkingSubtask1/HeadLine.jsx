import React, { useState } from "react";
import toast from "react-hot-toast";

const DEFAULT_OPTIONS = [
  "Aspiring Software Engineer | Computer Science Student",
  "Computer Science Undergraduate | Passionate About AI & Machine Learning",
  "Future Full-Stack Developer | Tech Enthusiast",
  "CS Student | Exploring Cloud Computing & DevOps",
  "Software Developer in Training | Problem Solver & Innovator",
  "Tech Student | Building Projects in Web & Mobile Development",
  "Computer Science Enthusiast | Passionate About Data Science",
  "CS Student | Interested in Cybersecurity & Ethical Hacking",
];

export default function Headline({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
  className = "",
}) {
  const [custom, setCustom] = useState("");

  const useCustom = () => {
    const v = custom.trim();
    if (!v) return toast.error("Please enter a headline first.");
    onChange(v);
    setCustom("");
    toast.success("Headline saved!");
  };

  return (
    <div className={`w-full max-w-md space-y-4  ${className}`}>

      <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-5 shadow-md flex flex-col gap-4">
        {/* Pick a Headline */}
        <h3 className="text-purple-700 font-semibold text-lg">
          🎯 Pick a Headline
        </h3>

        {/* Dropdown (your existing one goes here) */}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="select w-full border border-purple-200 rounded-lg p-2 focus:ring-2 focus:ring-purple-400 outline-none text-gray-700"
        >
          <option disabled value="">
            Pick a headline
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>


        {/* Divider */}
        <div className="relative flex items-center justify-center my-2">
          <span className="absolute bg-purple-100 px-3 text-sm text-purple-500 font-medium">
            or
          </span>
          <div className="w-full h-px bg-purple-200"></div>
        </div>

        {/* Custom input section */}
        <h3 className="text-purple-700 font-semibold text-lg">
          ✏️ Write Your Own
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Write your own headline..."
            className="flex-1 px-4 py-2 text-sm text-gray-700 bg-white border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && useCustom()}
          />
          <button
            className="px-5 py-2 text-sm font-semibold text-white bg-purple-500 hover:bg-purple-600 rounded-lg shadow-sm transition"
            onClick={useCustom}
          >
            Use this
          </button>
        </div>
      </div>

    </div >
  );
}
