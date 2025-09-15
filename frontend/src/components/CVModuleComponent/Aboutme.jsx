import React from "react";

export default function AboutMeCard({ aboutMe, setAboutMe }) {
  return (
    <div>
      {/* Heading */}
      <div className="pt-4 pb-2 px-8 text-center">
        <h2 className="text-center text-[32px] md:text-4xl font-extrabold text-[#4f9cf9]">
          Section 4: About Me
        </h2>
        <p className="text-sm font-semibold text-[#767687]">
          Please fill out your details
        </p>
      </div>

      {/* Single Card (everything lives inside this box) */}
      <div className="max-w-3xl p-6">
      <div className="mt-5 rounded-2xl border border-gray-300 bg-white p-6 md:p-7 shadow-sm">

        {/* Writing guide */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 mb-4">
          <p className="block text-sm font-semibold mb-1">
            Writing Guide (3–5 sentences):
          </p>
          <ul className="list-disc ml-5 text-sm text-gray-600 space-y-1">
            <li>
              <span className="font-semibold">Sentence 1:</span> Who you are —
              academic status & field of study. Mention 1–2 positive attributes.
            </li>
            <li>
              <span className="font-semibold">Sentences 2–3:</span> Your key
              skills & knowledge — coursework, technical skills, internships, or
              soft skills through projects.
            </li>
            <li>
              <span className="font-semibold">Sentence 4–5:</span> Your general
              goal — the role you’re seeking and what you hope to contribute.
            </li>
          </ul>
        </div>

        {/* Example */}
        <div className="mb-3">
          <p className="block text-sm font-semibold mb-1">Example:</p>
          <div className="rounded border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
            “A motivated and detail-oriented recent graduate with a Bachelor of
            Science in Computer Science. Developed a strong foundation in
            object-oriented programming and database management through
            challenging academic projects, including a full-stack web
            application. Seeking an entry-level software developer role to apply
            problem-solving skills and contribute to innovative software
            solutions.”
          </div>
        </div>

        {/* User input (inside the same card) */}
        <label htmlFor="about-paragraph" className="block text-sm font-semibold mb-1">
          About Me <label className="text-red-500">*</label>
        </label>
        <textarea
          id="about-paragraph"
          className="w-full min-h-[140px] rounded bg-gray-100 px-3 py-2 placeholder:text-gray-400
                     focus:outline-none focus:ring-2 focus:ring-[#4f9cf9]"
          placeholder="Write your about me paragraph following the guide above..."
          value={aboutMe}
          onChange={(e) => setAboutMe(e.target.value)}
        />
      </div>
    </div>
    </div>
  );
}
