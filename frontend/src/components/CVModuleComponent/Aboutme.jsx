import React from "react";

/** Section 3: About Me — Tailwind-only (matches your screenshot/style) */
export default function AboutMeCard({ aboutMe, setAboutMe }) {

  return (
    <section className="max-w-3xl mx-auto p-6">
      {/* Heading */}
      <h1 className="text-center text-4xl md:text-5xl font-extrabold text-[#4f9cf9]">
        Section 4: About Me
      </h1>
      <p className="text-center text-gray-500 font-semibold mt-1">Please fill out your details</p>

      {/* Card */}
      <div className="mt-5 rounded-2xl border border-gray-300 p-6 md:p-7">
        <p className="text-gray-500 font-semibold mb-4">About Me</p>

        {/* Writing guide box */}
        <div className="rounded border border-gray-200 p-3 mb-4">
          <div className="rounded border border-gray-200 bg-gray-50 p-3">
            <p className="font-semibold mb-1">Writing Guide (3–5 sentences):</p>
            <ul className="list-disc ml-5 text-sm text-gray-600 space-y-1">
              <li>
                <span className="font-semibold">Sentence 1:</span> Who you are — academic status &
                field of study. Mention 1–2 positive attributes.
              </li>
              <li>
                <span className="font-semibold">Sentences 2–3:</span> Your key skills & knowledge —
                coursework, technical skills, internships, or soft skills through projects.
              </li>
              <li>
                <span className="font-semibold">Sentence 4–5:</span> Your general goal — the role
                you’re seeking and what you hope to contribute.
              </li>
            </ul>
          </div>

          {/* Example */}
          <div className="mt-4">
            <p className="font-semibold mb-2">Example:</p>
            <div className="rounded border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
              “A motivated and detail-oriented recent graduate with a Bachelor of Science in
              Computer Science. Developed a strong foundation in object-oriented programming and
              database management through challenging academic projects, including a full-stack web
              application. Seeking an entry-level software developer role to apply problem-solving
              skills and contribute to innovative software solutions.”
            </div>
          </div>
        </div>

        {/* User input */}
        <label htmlFor="about-paragraph" className="block text-base font-semibold mb-1">
          About Me Paragraph
        </label>
        <textarea
          id="about-paragraph"
          className="w-full h-28 rounded bg-gray-100 px-3 py-2 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4f9cf9]"
          placeholder="Write your about me paragraph following the guide above..."
          value={aboutMe}
          onChange={(e) => setAboutMe(e.target.value)}
        />
      </div>
    </section>
  );
}
