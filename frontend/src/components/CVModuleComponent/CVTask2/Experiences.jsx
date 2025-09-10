import React from "react";

export default function ExperiencesView({
  experiences, maxExperiences,
  updateExp, addExperience, removeExperience,
}) {
  return (
    <section className="max-w-3xl mx-auto p-6">
      <h1 className="text-center text-4xl md:text-5xl font-extrabold text-[#4f9cf9]">
        Section 3: Work Experiences (Optional)
      </h1>
      <p className="text-center text-gray-500 font-semibold mt-1">
        Add up to {maxExperiences} experiences
      </p>

      <div className="mt-5 space-y-4">
        {experiences.map((x, i) => (
          <div key={i} className="rounded-2xl border border-gray-300 p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-600 font-semibold">Experience #{i + 1}</p>
              {experiences.length > 1 && (
                <button onClick={() => removeExperience(i)} className="text-red-500 hover:underline">
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Company/Organization</label>
                <input
                  className="w-full h-10 rounded bg-gray-100 px-3 focus:outline-none focus:ring-2 focus:ring-[#4f9cf9]"
                  placeholder="Company name"
                  value={x.company}
                  onChange={(e) => updateExp(i, "company", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Job Role</label>
                <input
                  className="w-full h-10 rounded bg-gray-100 px-3 focus:outline-none focus:ring-2 focus:ring-[#4f9cf9]"
                  placeholder="e.g., Frontend Developer"
                  value={x.role}
                  onChange={(e) => updateExp(i, "role", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Start Year</label>
                <input
                  className="w-full h-10 rounded bg-gray-100 px-3 focus:outline-none focus:ring-2 focus:ring-[#4f9cf9]"
                  placeholder="2023"
                  value={x.startYear}
                  onChange={(e) => updateExp(i, "startYear", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">End Year (or “Present”)</label>
                <input
                  className="w-full h-10 rounded bg-gray-100 px-3 focus:outline-none focus:ring-2 focus:ring-[#4f9cf9]"
                  placeholder="2024 / Present"
                  value={x.endYear}
                  onChange={(e) => updateExp(i, "endYear", e.target.value)}
                />
              </div>
            </div>

            <label className="block text-sm font-semibold mb-1">Contribution (2–3 sentences)</label>
            <textarea
              className="w-full min-h-[90px] rounded bg-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4f9cf9]"
              placeholder="What did you do in this role?"
              value={x.contribution}
              onChange={(e) => updateExp(i, "contribution", e.target.value)}
            />
          </div>
        ))}

        <div className="flex justify-end">
          <button
            disabled={experiences.length >= maxExperiences}
            onClick={addExperience}
            className={`h-10 px-5 rounded-xl border border-[#4f9cf9] text-[#4f9cf9] font-bold hover:bg-[#4f9cf9]/5 ${
              experiences.length >= maxExperiences ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            + Add another experience
          </button>
        </div>
      </div>
    </section>
  );
}
