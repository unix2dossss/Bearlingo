import React, { useMemo, useState } from "react";

const COLORS = {
  primary: "#4f9cf9",
  primaryHover: "#3d86ea",
  textMuted: "#767687",
  white: "#ffffff",
};

export default function SkillList({
  allSkills = [],
  selectedSkills = [],
  toggleSkill,     // (skill: string) => void  (parent enforces MAX_SKILLS)
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
    // if it exists in list, just toggle that one; otherwise toggle the custom string
    const existing = allSkills.find((k) => k.toLowerCase() === s.toLowerCase());
    toggleSkill(existing || s);
    setCustomSkill("");
  };

  return (
    <section className="mt-5 w-full mx-auto max-w-sm sm:max-w-md md:max-w-lg rounded-2xl p-6 sm:p-7 bg-transparent shadow-sm">
      <p className="text-center font-semibold mt-1" style={{ color: COLORS.white }}>
        Select up to {maxSkills} skills
      </p>

      <div className="mt-5 rounded-2xl border border-gray-300 p-6 md:p-7 bg-white">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold" style={{ color: COLORS.textMuted }}>
            Skills ({selectedSkills.length}/{maxSkills}){" "}
            <span style={{ color: COLORS.primary }}>*</span>
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-3 bg-white">
          <span className="absolute left-3 top-2.5 text-gray-400" aria-hidden="true">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M21 21l-4.2-4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </span>
          <input
            className="w-full h-10 rounded bg-gray-100 pl-10 pr-3 placeholder:text-gray-400 focus:outline-none focus:ring-2"
            onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 2px ${COLORS.primary}55`)}
            onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
            placeholder="Search skills..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search skills"
          />
        </div>

        {/* List */}
        <div className="max-h-64 sm:max-h-80 overflow-y-auto pr-1 space-y-2 mb-4">
          {filtered.map((skill) => {
            const checked = selectedSkills.includes(skill);
            const disabled = atLimit && !checked;
            return (
              <label
                key={skill}
                className={`flex items-center gap-2 select-none transition rounded-lg p-1
                  ${checked ? "bg-blue-50" : ""}
                  ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                style={checked ? { backgroundColor: `${COLORS.primary}15` } : undefined}
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 focus:ring-2"
                  style={{ accentColor: COLORS.primary }}
                  checked={checked}
                  disabled={disabled}
                  onChange={() => toggleSkill(skill)}
                />
                <span>{skill}</span>
              </label>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-sm text-gray-500">No skills match “{query}”.</p>
          )}
        </div>

        {/* Add custom */}
        <div className="flex items-center gap-2 mb-1" style={{ color: COLORS.textMuted }}>
          Add your own <span className="text-sm font-normal text-gray-500">(optional)</span>
        </div>
        <div className="flex gap-2 mb-2">
          <input
            className="flex-1 h-10 rounded bg-gray-100 px-3 placeholder:text-gray-400 focus:outline-none focus:ring-2"
            onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 2px ${COLORS.primary}55`)}
            onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
            placeholder="Enter a custom skill"
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustomSkill()}
          />
          <button
            onClick={addCustomSkill}
            className="h-10 px-4 rounded text-white font-semibold transition"
            style={{ backgroundColor: COLORS.primary }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = COLORS.primaryHover)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = COLORS.primary)}
          >
            Add
          </button>
        </div>

        {/* Chips */}
        {selectedSkills.length > 0 && (
          <div className="mt-4">
            <p className="font-semibold mb-2">Selected Skills:</p>
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-2 px-3 h-8 rounded font-semibold"
                  style={{ backgroundColor: `${COLORS.primary}25`, color: COLORS.primary }}
                >
                  {s}
                  <button
                    className="transition"
                    style={{ color: COLORS.primary }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.7)}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
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
    </section>
  );
}
