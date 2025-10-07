import { React, useState } from "react";

/** Section 2: Secondary Education — same style as your Tertiary card */
export default function SecondaryEducationCard({ secondary, setSecondary, errors }) {
  const subjectOptions = [
    "Mathematics",
    "English",
    "Science",
    "Biology",
    "Chemistry",
    "Physics",
    "History",
    "Geography",
    "Economics",
    "Accounting",
    "Art",
    "Music",
    "Physical Education",
    "Computer Science",
    "Other"
  ];

  const [selectedSubject, setSelectedSubject] = useState("");

  const handleAddSubject = () => {
    if (selectedSubject && !secondary.subjects.includes(selectedSubject)) {
      setSecondary({
        ...secondary,
        subjects: [...secondary.subjects, selectedSubject]
      });
      setSelectedSubject("");
    }
  };

  const handleRemoveSubject = (subjectToRemove) => {
    setSecondary({
      ...secondary,
      subjects: secondary.subjects.filter((subj) => subj !== subjectToRemove)
    });
  };

  return (
    <div>
      {/* Heading */}
      <div className="pt-4 pb-2 px-8 text-center">
        <h2 className="text-center text-[32px] md:text-4xl font-extrabold text-[#4f9cf9]">
          Section 2: Secondary Education
        </h2>
        <p className="text-sm font-semibold text-[#767687]">Please fill out your details</p>
      </div>

      {/* Card */}
      <div className="max-w-3xl p-6">
        <div className="mt-5 rounded-2xl border border-gray-300 p-6 md:p-7">
          <p className="text-[#767687] font-semibold text-sm mb-3">Secondary Education</p>

          {/* School */}
          <label className="block text-sm font-semibold mb-1">
            School Name <label className="text-red-500">*</label>
          </label>
          <input
            className="w-full h-10 rounded bg-gray-100 px-3 placeholder:text-gray-400 mb-5 focus:outline-none focus:ring-2 focus:ring-[#4f9cf9]"
            placeholder="Enter your school name"
            value={secondary.school}
            onChange={(e) => setSecondary({ ...secondary, school: e.target.value })}
          />

          {/* Subjects */}
          <label className="block text-sm font-semibold mb-1">
            Subjects Studied <label className="text-red-500">*</label>
          </label>

          <div className="flex gap-3 mb-3 w-full">
            <div className="relative flex-grow">
              <select
                className="w-full flex-1 h-10 rounded bg-gray-100 px-3 focus:outline-none focus:ring-2 focus:ring-[#4f9cf9] appearance-none"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="">Select a subject</option>
                {subjectOptions.map((subj) => (
                  <option key={subj} value={subj}>
                    {subj}
                  </option>
                ))}
              </select>
              {/* custom dropdown arrow */}
              <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <button
              type="button"
              className="px-4 rounded bg-[#4f9cf9] text-white font-semibold hover:bg-[#3d86ea]"
              onClick={handleAddSubject}
            >
              Add
            </button>
          </div>

          {/* Selected subject tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {secondary.subjects.length > 0 ? (
              secondary.subjects.map((subj, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-[#e5f0ff] text-[#4f9cf9] px-3 py-1 rounded-full text-sm font-medium"
                >
                  {subj}
                  <button
                    type="button"
                    className="text-[#4f9cf9] hover:text-red-500 font-bold"
                    onClick={() => handleRemoveSubject(subj)}
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No subjects added yet</p>
            )}
          </div>

          {/* Achievements */}
          <label className="block text-sm font-semibold mb-1">
            Achievements <span className="text-xs font-normal text-gray-500"> (optional) </span>
          </label>
          <textarea
            className="w-full h-28 rounded bg-gray-100 px-3 py-2 placeholder:text-gray-400 mb-6 focus:outline-none focus:ring-2 focus:ring-[#4f9cf9]"
            placeholder="Any notable achievements, awards, or recognition"
            value={secondary.achievements}
            onChange={(e) => setSecondary({ ...secondary, achievements: e.target.value })}
          />

          {/* Years */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="block text-sm font-semibold mb-1">
                Start Year <label className="text-red-500">*</label>
              </label>
              <input
                className={`w-full h-10 rounded px-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4f9cf9] ${
                  errors.secondaryStartYear ? "border border-red-500" : "bg-gray-100"
                }`}
                placeholder="2018"
                value={secondary.startYear}
                onChange={(e) => setSecondary({ ...secondary, startYear: e.target.value })}
              />
              {errors.secondaryStartYear && (
                <p className="text-red-500 text-sm mt-1 mb-1">{errors.secondaryStartYear}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-semibold mb-1">
                End Year <label className="text-red-500">*</label>
              </label>
              <input
                className={`w-full h-10 rounded px-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4f9cf9] ${
                  errors.secondaryEndYear ? "border border-red-500" : "bg-gray-100"
                }`}
                placeholder="2022"
                value={secondary.endYear}
                onChange={(e) => setSecondary({ ...secondary, endYear: e.target.value })}
              />
              {errors.secondaryEndYear && (
                <p className="text-red-500 text-sm mt-1 mb-1">{errors.secondaryEndYear}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
