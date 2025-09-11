import React from "react";

export default function ProjectsView({
  projects, maxProjects,
  updateProject, addProject, removeProject,
}) {
  return (
    <section className="max-w-3xl mx-auto p-6">
      <h1 className="text-center text-[32px] md:text-4xl font-extrabold text-[#4f9cf9]">
        Section 2: Projects
      </h1>
      <p className="text-center text-gray-500 font-semibold mt-1 text-center">
        Add up to {maxProjects} projects/experiences
      </p>

      <div className="mt-5 space-y-4">
        {projects.map((p, i) => (
          <div key={i} className="rounded-2xl border border-gray-300 p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-600 font-semibold">Project #{i + 1}</p>
              {projects.length > 1 && (
                <button onClick={() => removeProject(i)} className="text-red-500 hover:underline">
                  Remove
                </button>
              )}
            </div>

            <label className="block text-sm font-semibold mb-1">Project Name <label className="text-red-500">*</label></label>
            <input
              className="w-full h-10 rounded bg-gray-100 px-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#4f9cf9]"
              placeholder="e.g., Task Manager App"
              value={p.name}
              onChange={(e) => updateProject(i, "name", e.target.value)}
            />

            <label className="block text-sm font-semibold mb-1">
              Project Outcome / Key features (2-3 sentences) <label className="text-red-500">*</label>
            </label>
            <textarea
              className="w-full min-h-[90px] rounded bg-gray-100 px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#4f9cf9]"
              placeholder="Describe purpose & key features…"
              value={p.outcome}
              onChange={(e) => updateProject(i, "outcome", e.target.value)}
            />

            <label className="block text-sm font-semibold mb-1">Role + Contribution (2–3 sentences) <label className="text-red-500">*</label></label>
            <textarea
              className="w-full min-h-[90px] rounded bg-gray-100 px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#4f9cf9]"
              placeholder="What was your role and contribution?"
              value={p.role}
              onChange={(e) => updateProject(i, "role", e.target.value)}
            />

            <label className="block text-sm font-semibold mb-1">Link (GitHub/Demo) <span className="text-xs font-normal text-gray-500"> (optional) </span></label>
            <input
              className="w-full h-10 rounded bg-gray-100 px-3 focus:outline-none focus:ring-2 focus:ring-[#4f9cf9]"
              placeholder="https://github.com/username/repo"
              value={p.link}
              onChange={(e) => updateProject(i, "link", e.target.value)}
            />
          </div>
        ))}

        <div className="flex justify-end">
          <button
            disabled={projects.length >= maxProjects}
            onClick={addProject}
            className={`h-10 px-5 rounded-xl border border-[#4f9cf9] text-[#4f9cf9] font-bold hover:bg-[#4f9cf9]/5 ${
              projects.length >= maxProjects ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            + Add another project
          </button>
        </div>
      </div>
    </section>
  );
}
