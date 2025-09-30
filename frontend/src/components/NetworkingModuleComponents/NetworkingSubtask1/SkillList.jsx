import React, { useMemo, useState } from "react";

export default function SkillList({
  allSkills = [],
  selectedSkills = [],
  toggleSkill,          // (skill: string) => void
  maxSkills = 4,
}) {
  const [query, setQuery] = useState("");
  const [customSkill, setCustomSkill] = useState("");
  const atLimit = selectedSkills.length >= maxSkills;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allSkills;
    return allSkills.filter((s) => s.toLowerCase().includes(q));
  }, [allSkills, query]);

  const addCustomSkill = () => {
    const s = customSkill.trim();
    if (!s) return;
    const existing = allSkills.find((k) => k.toLowerCase() === s.toLowerCase());
    toggleSkill(existing || s);
    setCustomSkill("");
  };

  return (
    <section className="w-[min(92vw,600px)] mx-auto">
      {/* 🔷 same container as your career objective */}
      <div className="relative p-6 rounded-2xl shadow-2xl bg-indigo-100/80">
        {/* animated gradient glow */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 animate-gradient-x blur-lg opacity-50" />

        {/* glassy inner card */}
        <div className="relative z-10 bg-indigo-50/90 rounded-2xl border border-indigo-300 p-6">
          <h3 className="text-2xl font-bold text-indigo-900">Skills</h3>
          <p className="mt-1 text-sm text-indigo-700">
            Select up to {maxSkills} skills
          </p>

          {/* search */}
          <div className="relative mt-4">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" aria-hidden>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M21 21l-4.2-4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </span>
            <input
              className="w-full h-10 rounded-xl bg-indigo-50/80 text-indigo-900 placeholder-indigo-500
                         border-2 border-indigo-300 pl-10 pr-3 outline-none
                         focus:border-pink-400 focus:ring-1 focus:ring-pink-300 transition-colors"
              placeholder="Search skills…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search skills"
            />
          </div>

          {/* list */}
          <div className="mt-4 max-h-64 overflow-y-auto pr-2
                          bg-indigo-100/70 border border-indigo-200 rounded-xl p-3
                          scrollbar-thin scrollbar-thumb-pink-400 scrollbar-track-indigo-200/40">
            {filtered.map((skill) => {
              const checked = selectedSkills.includes(skill);
              const disabled = atLimit && !checked;
              return (
                <label
                  key={skill}
                  className={[
                    "flex items-center gap-2 select-none rounded-lg px-2 py-2 transition",
                    checked
                      ? "bg-indigo-50/80 border border-indigo-300"
                      : "hover:bg-indigo-50/60",
                    disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
                  ].join(" ")}
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-indigo-300"
                    style={{ accentColor: "#ef84d6" /* pink thumb to match glow */ }}
                    checked={checked}
                    disabled={disabled}
                    onChange={() => toggleSkill(skill)}
                  />
                  <span className="text-indigo-900">{skill}</span>
                </label>
              );
            })}

            {filtered.length === 0 && (
              <p className="text-sm text-indigo-700">No skills match “{query}”.</p>
            )}
          </div>

          {/* add custom */}
          <div className="mt-5">
            <div className="flex items-center gap-2 mb-1 text-indigo-700">
              Add your own <span className="text-sm font-normal text-indigo-600/90">(optional)</span>
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 h-10 rounded-xl bg-indigo-50/80 text-indigo-900 placeholder-indigo-500
                           border-2 border-indigo-300 px-3 outline-none
                           focus:border-pink-400 focus:ring-1 focus:ring-pink-300 transition-colors"
                placeholder="Enter a custom skill"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomSkill()}
              />
              <button
                onClick={addCustomSkill}
                className="h-10 px-4 rounded-xl text-white font-semibold
                           bg-pink-400 hover:bg-pink-500 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* chips */}
          {selectedSkills.length > 0 && (
            <div className="mt-5">
              <p className="font-semibold text-indigo-800 mb-2">Selected Skills</p>
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-2 px-3 h-8 rounded-xl font-semibold
                               text-indigo-800 bg-indigo-50/80 border border-indigo-300"
                  >
                    {s}
                    <button
                      className="transition text-pink-500 hover:text-pink-600"
                      onClick={() => toggleSkill(s)}
                      aria-label={`Remove ${s}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
