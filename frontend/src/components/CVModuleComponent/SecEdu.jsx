import React from "react";

/** Section 2: Secondary Education — same style as your Tertiary card */
export default function SecondaryEducationCard({ secondary, setSecondary }) {

  return (
    <section className="max-w-3xl mx-auto p-6">
      {/* Heading */}
      <h1 className="text-center text-[32px] md:text-4xl font-extrabold text-[#4f9cf9]">
        Section 2: Secondary Education
      </h1>
      <p className="text-center text-gray-500 font-semibold mt-1">
        Please fill out your details
      </p>

      {/* Card */}
      <div className="mt-5 rounded-2xl border border-gray-300 p-6 md:p-7">
        <p className="text-gray-500 font-semibold mb-4">Secondary Education</p>

        {/* School */}
        <label className="block text-base font-semibold mb-1">School Name</label>
        <input
          className="w-full h-10 rounded bg-gray-100 px-3 placeholder:text-gray-400 mb-5 focus:outline-none focus:ring-2 focus:ring-[#4f9cf9]"
          placeholder="Enter your school name"
          value={secondary.school}
          onChange={(e) => setSecondary({ ...secondary, school: e.target.value })}
        />

        {/* Subjects */}
        <label className="block text-base font-semibold mb-1">Subject Studied</label>
        <textarea
          className="w-full h-24 rounded bg-gray-100 px-3 py-2 placeholder:text-gray-400 mb-5 focus:outline-none focus:ring-2 focus:ring-[#4f9cf9]"
          placeholder="List the main subjects you studied, separated by commas"
          value={secondary.subjects}
          onChange={(e) => setSecondary({ ...secondary, subjects: e.target.value })}
        />

        {/* Achievements */}
        <label className="block text-base font-semibold mb-1">
          Achievements (Optional)
        </label>
        <textarea
          className="w-full h-28 rounded bg-gray-100 px-3 py-2 placeholder:text-gray-400 mb-6 focus:outline-none focus:ring-2 focus:ring-[#4f9cf9]"
          placeholder="Any notable achievements, awards, or recognition"
          value={secondary.achievements}
          onChange={(e) => setSecondary({ ...secondary, achievements: e.target.value })}
        />

        {/* Years */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-base font-semibold mb-1">Start Year</label>
            <input
              className="w-full h-10 rounded bg-gray-100 px-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4f9cf9]"
              placeholder="2018"
              value={secondary.startYear}
              onChange={(e) => setSecondary({ ...secondary, startYear: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-base font-semibold mb-1">End Year</label>
            <input
              className="w-full h-10 rounded bg-gray-100 px-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4f9cf9]"
              placeholder="2022"
              value={secondary.endYear}
              onChange={(e) => setSecondary({ ...secondary, endYear: e.target.value })}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
