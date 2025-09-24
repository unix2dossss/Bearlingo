// src/pages/CVModule/CVSubtask2.jsx
import React, { useMemo, useState, useEffect } from "react";
import api from "../../lib/axios";
import { toast } from "react-hot-toast";
import { getSubtaskBySequenceNumber } from "../../utils/moduleHelpers";
import { useUserStore } from "../../store/user";
import SkillsView from "../../components/CVModuleComponent/SkillChecklist";
import ProjectsView from "../../components/CVModuleComponent/CVTask2/Projects";
import ExperiencesView from "../../components/CVModuleComponent/CVTask2/Experiences";
import ProgressPills from "../../components/CVModuleComponent/CVTask2/Task2Progress";


export default function CVSubtask2({ setIsSubmitted, onClose, onTaskComplete }) {

  // Step state: 0 = Skills, 1 = Projects, 2 = Experiences, 3 = Review/Submit
  const [step, setStep] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Skills
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [query, setQuery] = useState("");
  const [customSkill, setCustomSkill] = useState("");
  const BASE_SKILLS = [
    // Languages
    "Python",
    "Java",
    "JavaScript",
    "TypeScript",
    "C",
    "C++",
    "C#",
    "Go",
    "Rust",
    "Kotlin",
    "Swift",
    "Dart",
    // Front-end
    "React",
    "Next.js",
    "Vue",
    "Angular",
    "Svelte",
    "HTML/CSS",
    "Tailwind CSS",
    "Bootstrap",
    "Sass",
    // Back-end / Frameworks
    "Node.js",
    "Express",
    "Django",
    "Flask",
    "FastAPI",
    "Spring Boot",
    ".NET",
    "Ruby on Rails",
    "Laravel",
    // Data / DB
    "SQL",
    "PostgreSQL",
    "MySQL",
    "SQLite",
    "MongoDB",
    "Redis",
    "GraphQL",
    "Elasticsearch",
    "Kafka",
    // DevOps / Cloud
    "Git",
    "GitHub",
    "Docker",
    "Kubernetes",
    "AWS",
    "GCP",
    "Azure",
    "Terraform",
    "CI/CD",
    "Jenkins",
    "GitLab CI",
    // Testing
    "Jest",
    "Cypress",
    "Playwright",
    "Mocha",
    "Chai",
    // Mobile / Misc
    "React Native",
    "Flutter",
    "Figma",
    "Jira",
    "Communication",
    "Teamwork",
    "Leadership",
    "Time management",
    "Problem solving"
  ];
  const [allSkills, setAllSkills] = useState(BASE_SKILLS);
  const maxSkills = 8;

  // Projects
  // const [projects, setProjects] = useState([{ name: "", outcome: "", role: "", link: "" }]);
  const [projects, setProjects] = useState([]);
  const maxProjects = 3;

  // Experiences
  // const [experiences, setExperiences] = useState([
  //   { company: "", role: "", startYear: "", endYear: "", contribution: "" }
  // ]);
  const [experiences, setExperiences] = useState([]);
  const maxExperiences = 4;

  // Snapshots from DB for ConfirmLeave check
  const [dbSkills, setDbSkills] = useState([]);
  const [dbProjects, setDbProjects] = useState([]);
  const [dbExperiences, setDbExperiences] = useState([]);

  // Normalize Projects and Experiences before comparing with DB snapshots
  const normalizeProjects = (ps) =>
    ps.map((p) => ({
      name: p.name || "",
      outcome: p.outcome || "",
      role: p.role || p.roleContribution || "",
      link: p.link || ""
    }));

  const normalizeExperiences = (xs) =>
    xs.map((x) => ({
      company: x.company || "",
      role: x.role || "",
      startYear: x.startYear || "",
      endYear: x.endYear || "",
      contribution: x.contribution || ""
    }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/users/me/cv", { withCredentials: true });
        const data = res.data;

        if (data) {
          // Skills
          if (Array.isArray(data.skills)) {
            setDbSkills(data.skills);
            setSelectedSkills(data.skills.slice(0, maxSkills));
          }

          // Projects
          if (Array.isArray(data.projects) && data.projects.length > 0) {
            setDbProjects(normalizeProjects(data.projects));
            setProjects(
              data.projects.map((p) => ({
                name: p.name || "",
                outcome: p.outcome || "",
                role: p.roleContribution || "",
                link: p.link || ""
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
                contribution: x.contribution || ""
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
    };

    fetchData();
  }, []);

  // Warn before reload/close browser
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
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isLoaded, selectedSkills, projects, experiences, dbSkills, dbProjects, dbExperiences]);
  // ───────────────────────────────────────────
  // Skills
  const filteredSkills = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? allSkills.filter((s) => s.toLowerCase().includes(q)) : allSkills;
  }, [allSkills, query]);

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) => {
      if (prev.includes(skill)) return prev.filter((s) => s !== skill);
      if (prev.length >= maxSkills) {
        toast.error(`Maximum ${maxSkills} skills.`);
        return prev;
      }
      return [...prev, skill];
    });
  };

  const addCustomSkill = () => {
    const v = customSkill.trim();
    if (!v) return;
    setAllSkills((xs) => (xs.some((s) => s.toLowerCase() === v.toLowerCase()) ? xs : [...xs, v]));
    setSelectedSkills((xs) => (xs.includes(v) ? xs : xs.length < maxSkills ? [...xs, v] : xs));
    setCustomSkill("");
  };

  // const saveSkills = async () => {
  //   if (selectedSkills.length === 0) {
  //     toast.error("Pick at least 1 skill.");
  //     return;
  //   }

  //   try {
  //     const payload = { skills: Array.from(new Set(selectedSkills)).slice(0, maxSkills) };
  //     console.log("POST /users/me/cv/skills", payload);
  //     const res = await api.post("/users/me/cv/skills", payload, {
  //       withCredentials: true
  //     });
  //     toast.success(res?.data?.message ?? "Skills saved.");
  //   } catch (e) {
  //     console.error("saveSkills error:", e?.response || e);
  //     const msg =
  //       e?.response?.data?.message ||
  //       `${e?.response?.status ?? ""} ${e?.response?.statusText ?? ""}`.trim() ||
  //       e?.message;
  //     toast.error(`Failed to save skills: ${msg}`);
  //     throw e; // keep this so handleNext stops on error
  //   }
  // };

  // ───────────────────────────────────────────
  // Projects (max 3)

  const updateProject = (i, key, value) =>
    setProjects((ps) => ps.map((p, idx) => (idx === i ? { ...p, [key]: value } : p)));
  const addProject = () =>
    setProjects((ps) =>
      ps.length < maxProjects ? [...ps, { name: "", outcome: "", role: "", link: "" }] : ps
    );
  const removeProject = (i) => setProjects((ps) => ps.filter((_, idx) => idx !== i));

  // const saveProjects = async () => {
  //   const payload = {
  //     projects: projects.map((p) => ({
  //       name: p.name,
  //       outcome: p.outcome,
  //       roleContribution: p.role,
  //       link: p.link
  //     }))
  //   };
  //   const res = await api.post("/users/me/cv/projects", payload, { withCredentials: true });
  //   toast.success(res.data.message);
  // };

  // ───────────────────────────────────────────
  // Work experiences (optional, max 4)

  const updateExp = (i, key, value) =>
    setExperiences((xs) => xs.map((x, idx) => (idx === i ? { ...x, [key]: value } : x)));
  const addExperience = () =>
    setExperiences((xs) =>
      xs.length < maxExperiences
        ? [...xs, { company: "", role: "", startYear: "", endYear: "", contribution: "" }]
        : xs
    );
  const removeExperience = (i) => setExperiences((xs) => xs.filter((_, idx) => idx !== i));

  // const saveExperiences = async () => {
  //   // remove any experience objects where all fields are blank
  //   const cleaned = experiences.filter(
  //     (x) => x.company || x.role || x.startYear || x.endYear || x.contribution
  //   );

  //   const payload = { experiences: cleaned };
  //   console.log(payload);
  //   const res = await api.post("/users/me/cv/work-experience", payload, { withCredentials: true });
  //   toast.success(res.data.message);
  //   setIsSubmitted(true); // mark as submitted → allow closing
  // };

  // ───────────────────────────────────────────
  // Navigation + submit
  const isStepValid = () => {
    if (step === 0) {
      return selectedSkills.length > 0 && selectedSkills.length <= maxSkills;
    }

    if (step === 1) {
      // All projects must have required fields filled
      return (
        projects.length > 0 &&
        projects.every((p) => p.name.trim() && p.outcome.trim() && p.role.trim())
      );
    }

    if (step === 2) {
      // Experiences are optional, but if user added more than 1,
      // every visible one must be fully filled
      return experiences.every(
        (x) =>
          (!x.company && !x.role && !x.startYear && !x.endYear && !x.contribution) || // empty is fine
          (x.company.trim() &&
            x.role.trim() &&
            x.startYear.trim() &&
            x.endYear.trim() &&
            x.contribution.trim())
      );
    }

    return true;
  };

  const handleNext = async () => {
    try {
      // if (step === 0) await saveSkills();
      // if (step === 1) await saveProjects();
      // if (step === 2) await saveExperiences();
      setStep((s) => s + 1);
    } catch (e) {
      console.error(e);
      toast.error("Save failed. Please check your inputs.");
    }
  };

  // Send skills, projects and experiences data to backend and mark subtask as completed
  const { completeTask } = useUserStore();
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Send Skills to backend
    const payloadSkills = { skills: Array.from(new Set(selectedSkills)).slice(0, maxSkills) };
    await api.post("/users/me/cv/skills", payloadSkills, { withCredentials: true });

    // Send Projects to backend
    const payloadProjects = {
      projects: projects.map((p) => ({
        name: p.name,
        outcome: p.outcome,
        roleContribution: p.role,
        link: p.link
      }))
    };
    await api.post("/users/me/cv/projects", payloadProjects, { withCredentials: true });

    // Send Experiences to backend
    // Remove any experience objects where all fields are blank
    const cleaned = experiences.filter(
      (x) => x.company || x.role || x.startYear || x.endYear || x.contribution
    );
    const payloadExperiences = { experiences: cleaned };
    await api.post("/users/me/cv/work-experience", payloadExperiences, {
      withCredentials: true
    });
    toast.success(`Skills, Projects and ${cleaned.length > 0 ? "Experiences" : ""} saved successfully!`);

    // Update database states with new data
    setDbSkills(selectedSkills);
    setDbProjects(normalizeProjects(projects));
    setDbExperiences(normalizeExperiences(experiences));

    setIsSubmitted(true); // allow closing/leaving
    onTaskComplete?.();
    onClose(false, true); // hasChange = false, force = true, bypass ConfirmLeave check

    // Get subtaskId by module name, level number and subtask sequence number
    let subtaskId;
    try {
      subtaskId = await getSubtaskBySequenceNumber("CV Builder", 1, 2);
    } catch (err) {
      console.error("Failed to get subtask ID", err);
      toast.error("Could not find subtask");
      return;
    }
    // Mark subtask as completed
    try {
      const res = await completeTask(subtaskId);
      // Check if subtask is completed and display appropriate message
      if (res.data.message === "Well Done! You completed the subtask") {
        toast.success("Task 2 completed!");
        onTaskComplete?.();
      }
    } catch (err) {
      console.error("Failed to complete task", err);
      toast.error("Could not mark task complete");
    }
  };

  const handleClear = () => {
    if (step === 0) {
      // Step 0: Skills — clear selected + remove any custom skills from the list
      setSelectedSkills([]);
      setAllSkills(BASE_SKILLS); // this drops any user-added skills
      setQuery("");
      setCustomSkill("");
      toast.success("Skills cleared and custom skills removed.");
      return;
    }
    if (step === 1) setProjects([{ name: "", outcome: "", role: "", link: "" }]);
    if (step === 2)
      setExperiences([{ company: "", role: "", startYear: "", endYear: "", contribution: "" }]);
  };

  // ───────────────────────────────────────────
  // Review inline (no extra component)
  const Review = () => {
    const visibleProjects = projects.filter((p) => p.name || p.outcome || p.role);
    const visibleExperiences = experiences.filter((x) => x.company || x.role || x.contribution);

    return (
      <section className="max-w-3xl mx-auto p-6">
        <h1 className="text-center text-4xl md:text-5xl font-extrabold text-[#4f9cf9]">
          Review & Submit
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
                <span className="font-semibold">{p.name || "Untitled"}</span> —{" "}
                {p.role || "No role"}.
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
  };
  // Handle close (from top-right X button)
  // const handleCloseClick = () => {
  //   if (isSubmitted) {
  //     // Same "saved" feel as when you submit
  //     toast.success("Saved — closing task.");
  //     onClose?.(true); // force close, bypass ConfirmLeave check
  //     return;
  //   }
  //   // Not submitted yet → let parent show ConfirmLeave dialog
  //   toast("Finish & save to close (or confirm to discard).", { icon: "⚠️" });
  //   onClose?.(); // normal close → parent will decide
  // };

  // Check if data in form is different from the one in the database when user click close button
  const handleLocalClose = () => {
    const hasChanges =
      isLoaded &&
      (JSON.stringify(selectedSkills) !== JSON.stringify(dbSkills) ||
        JSON.stringify(normalizeProjects(projects)) !== JSON.stringify(dbProjects) ||
        JSON.stringify(normalizeExperiences(experiences)) !== JSON.stringify(dbExperiences));

    onClose(hasChanges);
  };

  // UI design ───────────────────────────────────────────
  return (
    <div className="flex flex-col h-full">
      {/* Sticky white header */}
      <header className="sticky top-0 z-40 bg-white">
        <div className="mx-auto max-w-[800px] px-3 py-6 grid grid-cols-[auto_1fr_auto] items-center">
          {/* Left: Back (reserve width so center stays centered) */}
          <div className="min-w-[60px]">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="text-gray-600 hover:text-[#4f9cf9] text-sm"
              >
                ← Back
              </button>
            )}
          </div>

          {/* Center: pills */}
          <div className="flex justify-center">
            <ProgressPills step={step} />
          </div>

          {/* Right: Close */}
          <button
            onClick={handleLocalClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
            aria-label="Close"
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
            maxSkills={maxSkills}
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
            maxProjects={maxProjects}
            updateProject={updateProject}
            addProject={addProject}
            removeProject={removeProject}
          />
        )}

        {step === 2 && (
          <ExperiencesView
            experiences={experiences}
            maxExperiences={maxExperiences}
            updateExp={updateExp}
            addExperience={addExperience}
            removeExperience={removeExperience}
          />
        )}

        {step === 3 && <Review />}
      </div>

      {/* Footer buttons */}
      <div className="flex items-center justify-center gap-5 mt-4">
        <button
          onClick={handleClear}
          className="inline-flex items-center justify-center
              h-12 md:h-14 px-8 md:px-10 rounded-full
              bg-white border-2 border-[#4f9cf9]
              text-[#4f9cf9] font-extrabold
              hover:bg-[#4f9cf9]/5
              focus:outline-none focus:ring-2 focus:ring-[#4f9cf9]
              min-w-[200px]"
        >
          Clear
        </button>

        {step < 3 ? (
          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className={`inline-flex items-center justify-center
                h-12 md:h-14 px-8 md:px-10 rounded-full
                bg-[#4f9cf9] text-white font-extrabold shadow-sm
                hover:bg-[#4f9cf9]/90 focus:outline-none focus:ring-2 focus:ring-[#4f9cf9]
                min-w-[220px] ${!isStepValid() ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            Save &amp; Continue
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="inline-flex items-center justify-center
                h-12 md:h-14 px-8 md:px-10 rounded-full
                bg-[#4f9cf9] text-white font-extrabold shadow-sm
                hover:bg-[#4f9cf9]/90 focus:outline-none focus:ring-2 focus:ring-[#4f9cf9]
                min-w-[200px]}"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
