import React from "react";

/** Section 3: Tertiary Education — Tailwind only */
export default function TertiaryEducationCard({ tertiary, setTertiary, errors }) {
  return (
    <div>
      {/* Heading */}
      <div className="pt-4 pb-2 px-8 text-center">
        <h2 className="text-center text-[32px] md:text-4xl font-extrabold text-[#4f9cf9]">
          Section 3: Tertiary Education
        </h2>
        <p className="text-center text-gray-500 font-semibold mt-1">Please fill out your details</p>{" "}
      </div>

      {/* Card */}
      <div className="max-w-3xl p-6">
        <div className="mt-5 rounded-2xl border border-gray-300 p-6 md:p-7">
          <p className="text-[#767687] font-semibold text-sm mb-3">Tertiary Education</p>

          {/* University */}
          <label className="block text-sm font-semibold mb-1">
            University Name <label className="text-red-500">*</label>
          </label>
          <input
            className="w-full h-10 rounded bg-gray-100 px-3 placeholder:text-gray-400 mb-5 focus:outline-none focus:ring-2 focus:ring-[#4f9cf9]"
            placeholder="Enter your university name"
            value={tertiary.university}
            onChange={(e) => setTertiary({ ...tertiary, university: e.target.value })}
          />

          {/* Degrees */}
          <label className="block text-sm font-semibold mb-1">
            Degree(s) Name <label className="text-red-500">*</label>
          </label>
          <textarea
            className="w-full h-28 rounded bg-gray-100 px-3 py-2 placeholder:text-gray-400 mb-5 focus:outline-none focus:ring-2 focus:ring-[#4f9cf9]"
            placeholder="e.g., Bachelor of Science in Computer Science, Master of Business Administration"
            value={tertiary.degree}
            onChange={(e) => setTertiary({ ...tertiary, degree: e.target.value })}
          />

          {/* Years */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="block text-sm font-semibold mb-1">
                Start Year <label className="text-red-500">*</label>
              </label>
              <input
                className={`w-full h-10 rounded px-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4f9cf9] ${
                  errors.tertiaryStartYear ? "border border-red-500" : "bg-gray-100"
                }`}
                placeholder="2018"
                value={tertiary.startYear}
                onChange={(e) => setTertiary({ ...tertiary, startYear: e.target.value })}
              />
              {errors.tertiaryStartYear && (
                <p className="text-red-500 text-sm mt-1 mb-1">{errors.tertiaryStartYear}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-semibold mb-1">
                End Year <label className="text-red-500">*</label>
              </label>
              <input
                className={`w-full h-10 rounded px-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4f9cf9] ${
                  errors.tertiaryEndYear ? "border border-red-500" : "bg-gray-100"
                }`}
                placeholder="2022"
                value={tertiary.endYear}
                onChange={(e) => setTertiary({ ...tertiary, endYear: e.target.value })}
                disabled={tertiary.studying}
              />
              {errors.tertiaryEndYear && (
                <p className="text-red-500 text-sm mt-1">{errors.tertiaryEndYear}</p>
              )}
            </div>
          </div>

          {/* Checkbox */}
          <label className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={tertiary.studying}
              onChange={(e) => setTertiary({ ...tertiary, studying: e.target.checked })}
            />
            Currently studying
          </label>
        </div>
      </div>
    </div>
  );
}
