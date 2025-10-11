// src/pages/CVModule/CVSubtask2.jsx
import React, { useMemo, useState, useEffect } from "react";
import api from "../../lib/axios";
import { toast } from "react-hot-toast";
import { getSubtaskBySequenceNumber } from "../../utils/moduleHelpers";
import { useUserStore } from "../../store/user";

// Views
import SkillsView from "../../components/CVModuleComponent/SkillChecklist";
import ProjectsView from "../../components/CVModuleComponent/CVTask2/Projects";
import ExperiencesView from "../../components/CVModuleComponent/CVTask2/Experiences";
import ProgressPills from "../../components/CVModuleComponent/CVTask2/Task2Progress";


const COLORS = {
  primary: "#4f9cf9",
  primaryHover: "#3d86ea",
  textMuted: "#767687",
};
const LIMITS = { skills: 8, projects: 3, experiences: 4 };
const EMPTY_PROJECT = { name: "", outcome: "", role: "", link: "" };
const EMPTY_EXPERIENCE = { company: "", role: "", startYear: "", endYear: "", contribution: "" };
const TITLE_ACCENT = COLORS.primary;

/* Reusable Button */
const cx = (...xs) => xs.filter(Boolean).join(" ");
function ActionButton({
  children,
  onClick,
  disabled = false,
  variant = "solid", // 'solid' | 'outline'
  minWidth = 200,
  type = "button",
}) {
  const base =
    "inline-flex items-center justify-center h-12 md:h-14 px-8 md:px-10 rounded-full font-extrabold text-base md:text-lg shadow-sm focus:outline-none focus:ring-2";
  const solid =
    "text-white bg-[#4f9cf9] hover:bg-[#3d86ea] focus:ring-[#4f9cf9]";
  const outline =
    "bg-white border-2 border-[#4f9cf9] text-[#4f9cf9] hover:bg-[#4f9cf9]/5 focus:ring-[#4f9cf9]";
  const disabledCls = "opacity-60 cursor-not-allowed";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cx(base, variant === "solid" ? solid : outline, disabled && disabledCls)}
      style={{ minWidth }}
    >
      {children}
    </button>
  );
}

/** Subtask 2 — Skills & Experience Checklist */
export default function CVSubtask2({
  setIsSubmitted = () => {},
  onClose = () => {},
  onTaskComplete,
}) {
  // Steps: 0 = Skills, 1 = Projects, 2 = Experiences, 3 = Review
  const [step, setStep] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Skills
  const BASE_SKILLS = useMemo(
    () => [
      // Languages
      "Python","Java","JavaScript","TypeScript","C","C++","C#","Go","Rust","Kotlin","Swift","Dart",
      // Front-end
      "React","Next.js","Vue","Angular","Svelte","HTML/CSS","Tailwind CSS","Bootstrap","Sass",
      // Back-end / Frameworks
      "Node.js","Express","Django","Flask","FastAPI","Spring Boot",".NET","Ruby on Rails","Laravel",
      // Data / DB
      "SQL","PostgreSQL","MySQL","SQLite","MongoDB","Redis","GraphQL","Elasticsearch","Kafka",
      // DevOps / Cloud
      "Git","GitHub","Docker","Kubernetes","AWS","GCP","Azure","Terraform","CI/CD","Jenkins","GitLab CI",
      // Testing
      "Jest","Cypress","Playwright","Mocha","Chai",
      // Mobile / Misc
      "React Native","Flutter","Figma","Jira","Communication","Teamwork","Leadership","Time management","Problem solving",
    ],
    []
  );
  const [allSkills, setAllSkills] = useState(BASE_SKILLS);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [query, setQuery] = useState("");
  const [customSkill, setCustomSkill] = useState("");

  // Projects
  const [projects, setProjects] = useState([]);
  // Experiences
  const [experiences, setExperiences] = useState([]);

  // Snapshots for ConfirmLeave check
  const [dbSkills, setDbSkills] = useState([]);
  const [dbProjects, setDbProjects] = useState([]);
  const [dbExperiences, setDbExperiences] = useState([]);

  // Helpers for normalization (stable shapes)
  const normalizeProjects = (ps) =>
    ps.map((p) => ({
      name: p.name || "",
      outcome: p.outcome || "",
      role: p.role || p.roleContribution || "",
      link: p.link || "",
    }));
  const normalizeExperiences = (xs) =>
    xs.map((x) => ({
      company: x.company || "",
      role: x.role || "",
      startYear: x.startYear || "",
      endYear: x.endYear || "",
      contribution: x.contribution || "",
    }));

  // Initial fetch
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/users/me/cv", { withCredentials: true });
        const data = res.data;

        if (data) {
          // Skills
          if (Array.isArray(data.skills)) {
            setDbSkills(data.skills);
            setSelectedSkills(data.skills.slice(0, LIMITS.skills));
          }
          // Projects
          if (Array.isArray(data.projects) && data.projects.length > 0) {
            setDbProjects(normalizeProjects(data.projects));
            setProjects(
              data.projects.map((p) => ({
                name: p.name || "",
                outcome: p.outcome || "",
                role: p.roleContribution || "",
                link: p.link || "",
              }))
            );
          }
          // Experiences
          if (Array.isArray(data.experiences) && data.experiences.length > 0) {
            setDbExperiences(normalizeExperiences(data.experiences));
            setExperiences(
              data.experiences.map((x) => ({
                company: x.company || "",
                role: x.role || "",
                startYear: x.startYear || "",
                endYear: x.endYear || "",
                contribution: x.contribution || "",
              }))
            );
          }
        }
      } catch (err) {
        console.error("Failed to fetch CV data:", err);
        toast.error("Could not load your CV data.");
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  // Warn before browser close if dirty
  useEffect(() => {
    const isDirty = () =>
      isLoaded &&
      (JSON.stringify(selectedSkills) !== JSON.stringify(dbSkills) ||
        JSON.stringify(normalizeProjects(projects)) !== JSON.stringify(dbProjects) ||
        JSON.stringify(normalizeExperiences(experiences)) !== JSON.stringify(dbExperiences));

    const handleBeforeUnload = (e) => {
      if (isDirty()) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave this page?";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [
    isLoaded,
    selectedSkills,
    projects,
    experiences,
    dbSkills,
    dbProjects,
    dbExperiences,
  ]);

  // Derived: filtered skills
  const filteredSkills = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? allSkills.filter((s) => s.toLowerCase().includes(q)) : allSkills;
  }, [allSkills, query]);

  // Skills actions
  const toggleSkill = (skill) => {
    setSelectedSkills((prev) => {
      if (prev.includes(skill)) return prev.filter((s) => s !== skill);
      if (prev.length >= LIMITS.skills) {
        toast.error(`Maximum ${LIMITS.skills} skills.`);
        return prev;
      }
      return [...prev, skill];
    });
  };
  const addCustomSkill = () => {
    const v = customSkill.trim();
    if (!v) return;
    setAllSkills((xs) => (xs.some((s) => s.toLowerCase() === v.toLowerCase()) ? xs : [...xs, v]));
    setSelectedSkills((xs) => (xs.includes(v) ? xs : xs.length < LIMITS.skills ? [...xs, v] : xs));
    setCustomSkill("");
  };

  // Projects actions
  const updateProject = (i, key, value) =>
    setProjects((ps) => ps.map((p, idx) => (idx === i ? { ...p, [key]: value } : p)));
  const addProject = () =>
    setProjects((ps) => (ps.length < LIMITS.projects ? [...ps, { ...EMPTY_PROJECT }] : ps));
  const removeProject = (i) => setProjects((ps) => ps.filter((_, idx) => idx !== i));

  // Experiences actions
  const updateExp = (i, key, value) =>
    setExperiences((xs) => xs.map((x, idx) => (idx === i ? { ...x, [key]: value } : x)));
  const addExperience = () =>
    setExperiences((xs) =>
      xs.length < LIMITS.experiences ? [...xs, { ...EMPTY_EXPERIENCE }] : xs
    );
  const removeExperience = (i) => setExperiences((xs) => xs.filter((_, idx) => idx !== i));

  // Step validation
  const isStepValid = () => {
    if (step === 0) return selectedSkills.length > 0 && selectedSkills.length <= LIMITS.skills;
    if (step === 1)
      return (
        projects.length > 0 &&
        projects.every((p) => p.name.trim() && p.outcome.trim() && p.role.trim())
      );
    if (step === 2)
      return experiences.every(
        (x) =>
          (!x.company && !x.role && !x.startYear && !x.endYear && !x.contribution) ||
          (x.company.trim() &&
            x.role.trim() &&
            x.startYear.trim() &&
            x.endYear.trim() &&
            x.contribution.trim())
      );
    return true;
  };

  const handleNext = async () => {
    try {
      setStep((s) => s + 1);
    } catch (e) {
      console.error(e);
      toast.error("Save failed. Please check your inputs.");
    }
  };

  // Submit all & mark subtask complete
  const { completeTask } = useUserStore();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Skills
      const payloadSkills = {
        skills: Array.from(new Set(selectedSkills)).slice(0, LIMITS.skills),
      };
      await api.post("/users/me/cv/skills", payloadSkills, { withCredentials: true });

      // Projects
      const payloadProjects = {
        projects: projects.map((p) => ({
          name: p.name,
          outcome: p.outcome,
          roleContribution: p.role,
          link: p.link,
        })),
      };
      await api.post("/users/me/cv/projects", payloadProjects, { withCredentials: true });

      // Experiences (drop empty objects)
      const cleaned = experiences.filter(
        (x) => x.company || x.role || x.startYear || x.endYear || x.contribution
      );
      const payloadExperiences = { experiences: cleaned };
      await api.post("/users/me/cv/work-experience", payloadExperiences, {
        withCredentials: true,
      });

      toast.success(
        `Skills, Projects and ${cleaned.length > 0 ? "Experiences" : ""} saved successfully!`
      );

      // Update DB snapshots (so leaving won't warn)
      setDbSkills(selectedSkills);
      setDbProjects(normalizeProjects(projects));
      setDbExperiences(normalizeExperiences(experiences));

      setIsSubmitted(true);
      onTaskComplete?.();
      onClose(false, true); // force close

      // Mark subtask complete
      try {
        const subtaskId = await getSubtaskBySequenceNumber("CV Builder", 1, 2);
        const res = await completeTask(subtaskId);
        if (res?.data?.message === "Well Done! You completed the subtask") {
          toast.success("Task 2 completed!");
          onTaskComplete?.();
        }
      } catch (err) {
        console.error("Failed to complete task", err);
        toast.error("Could not mark task complete");
      }
    } catch (err) {
      console.error("Submit error", err);
      toast.error("Failed to save. Please try again.");
    }
  };

  const handleClear = () => {
    if (step === 0) {
      setSelectedSkills([]);
      setAllSkills(BASE_SKILLS);
      setQuery("");
      setCustomSkill("");
      toast.success("Skills cleared and custom skills removed.");
      return;
    }
    if (step === 1) setProjects([{ ...EMPTY_PROJECT }]);
    if (step === 2) setExperiences([{ ...EMPTY_EXPERIENCE }]);
  };

  // Close button in header
  const handleLocalClose = () => {
    const hasChanges =
      isLoaded &&
      (JSON.stringify(selectedSkills) !== JSON.stringify(dbSkills) ||
        JSON.stringify(normalizeProjects(projects)) !== JSON.stringify(dbProjects) ||
        JSON.stringify(normalizeExperiences(experiences)) !== JSON.stringify(dbExperiences));
    onClose(hasChanges);
  };

  /* ─────────────────────────────
   * UI
   * ───────────────────────────── */
  return (
    <div className="flex flex-col h-full">
      {/* Sticky header with Back + Pills + Close */}
      <header className="sticky top-0 z-40 bg-white">
        <div className="mx-auto max-w-[800px] px-3 py-6 grid grid-cols-[auto_1fr_auto] items-center">
          {/* Back (keep center centered with min width) */}
          <div className="min-w-[60px]">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="text-gray-600 hover:text-[#4f9cf9] text-sm"
                type="button"
              >
                ← Back
              </button>
            )}
          </div>

          {/* Progress Pills */}
          <div className="flex justify-center">
            <ProgressPills step={step} />
          </div>

          {/* Close */}
          <button
            onClick={handleLocalClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
            aria-label="Close"
            type="button"
          >
            ✖
          </button>
        </div>
      </header>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarGutter: "stable both-edges" }}>
        {step === 0 && (
          <SkillsView
            selectedSkills={selectedSkills}
            maxSkills={LIMITS.skills}
            filteredSkills={filteredSkills}
            query={query}
            setQuery={setQuery}
            customSkill={customSkill}
            setCustomSkill={setCustomSkill}
            toggleSkill={toggleSkill}
            addCustomSkill={addCustomSkill}
          />
        )}

        {step === 1 && (
          <ProjectsView
            projects={projects}
            maxProjects={LIMITS.projects}
            updateProject={updateProject}
            addProject={addProject}
            removeProject={removeProject}
          />
        )}

        {step === 2 && (
          <ExperiencesView
            experiences={experiences}
            maxExperiences={LIMITS.experiences}
            updateExp={updateExp}
            addExperience={addExperience}
            removeExperience={removeExperience}
          />
        )}

        {step === 3 && <Review />}
      </div>

      {/* Controls row (inside form, NOT scrollable) */}
      <div className="shrink-0">
        <div className="mx-auto max-w-[800px] px-3 py-4 flex items-center justify-center gap-4">
          <ActionButton variant="outline" onClick={handleClear}>
            Clear
          </ActionButton>

          {step < 3 ? (
            <ActionButton onClick={handleNext} disabled={!isStepValid()}>
              Save &amp; Continue
            </ActionButton>
          ) : (
            <ActionButton onClick={handleSubmit}>
              Submit
            </ActionButton>
          )}
        </div>
      </div>
    </div>
  );

  // ───────────────────────────────────────────
  // Inline Review (unchanged, but uses primary color)
  function Review() {
    const visibleProjects = projects.filter((p) => p.name || p.outcome || p.role);
    const visibleExperiences = experiences.filter((x) => x.company || x.role || x.contribution);

    return (
      <section className="max-w-3xl mx-auto p-6">
        <h1
          className="text-center text-4xl md:text-5xl font-extrabold"
          style={{ color: TITLE_ACCENT }}
        >
          Review &amp; Submit
        </h1>
        <p className="text-center text-gray-500 font-semibold mt-1">
          Save everything and mark Subtask 2 as complete
        </p>

        <div className="mt-5 rounded-2xl border border-gray-300 p-6">
          <p className="font-semibold mb-2">Skills</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedSkills.length === 0 && <span className="text-gray-500">None</span>}
            {selectedSkills.map((s) => (
              <span
                key={s}
                className="px-3 h-8 rounded bg-[#4f9cf9]/15 text-[#4f9cf9] font-semibold inline-flex items-center"
              >
                {s}
              </span>
            ))}
          </div>

          <p className="font-semibold mb-2">Projects</p>
          <ul className="list-disc ml-5 mb-4 text-gray-700">
            {visibleProjects.length === 0 && <li className="list-none text-gray-500">None</li>}
            {visibleProjects.map((p, i) => (
              <li key={i}>
                <span className="font-semibold">{p.name || "Untitled"}</span> — {p.role || "No role"}.
              </li>
            ))}
          </ul>

          <p className="font-semibold mb-2">Work Experiences</p>
          <ul className="list-disc ml-5 text-gray-700">
            {visibleExperiences.length === 0 && <li className="list-none text-gray-500">None</li>}
            {visibleExperiences.map((x, i) => (
              <li key={i}>
                <span className="font-semibold">{x.role || "Role"}</span> @ {x.company || "Company"}
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }
}
