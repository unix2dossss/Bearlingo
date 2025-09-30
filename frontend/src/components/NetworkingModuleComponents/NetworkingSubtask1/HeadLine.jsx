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
    <div className={`w-full max-w-md mx-auto space-y-4  ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="select w-full"
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

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Or write your own headline"
          className="input flex-1"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && useCustom()}
        />
        <button className="btn" onClick={useCustom}>
          Use this
        </button>
      </div>
    </div>
  );
}
