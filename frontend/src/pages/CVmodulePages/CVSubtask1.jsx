import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import api from "../../lib/axios";
import { toast } from "react-hot-toast";
import PerInfo from "../../components/CVModuleComponent/PerInfo";
import TerEdu from "../../components/CVModuleComponent/TerEdu";
import SecEdu from "../../components/CVModuleComponent/SecEdu";
import Aboutme from "../../components/CVModuleComponent/Aboutme";
import { getSubtaskBySequenceNumber } from "../../utils/moduleHelpers";
import { useUserStore } from "../../store/user";
import ProgressPills from "../../components/CVModuleComponent/Task1Progress";
import MethodChooser from "../../components/CVModuleComponent/CVMethodChooser";
import ResumeUpload from "../../components/CVModuleComponent/ResumeUpload";

const COLORS = {
  primary: "#4f9cf9",
  primaryHover: "#3d86ea",
  textMuted: "#767687"
};

const CVSubtask1 = ({
  setIsSubmitted,
  onClose,
  onTaskComplete,
  setTask1Complete,
  setTask2Complete,
  setTask3Complete,
  user
}) => {
  // To choose between manual and upload CV: "chooser" | "manual" | "upload"
  const [mode, setMode] = useState("chooser");
  const [cvFileMeta, setCvFileMeta] = useState(null);
  const [errors, setErrors] = useState({});

  const handleBackToChoice = () => {
    setMode("chooser");
  };

  const [step, setStep] = useState(0);
  const [personal, setPersonal] = useState({
    firstName: "",
    lastName: "",
    countryCode: "+64", // default: NZ
    phone: "",
    email: "",
    linkedin: ""
  });

  const [secondary, setSecondary] = useState({
    school: "",
    subjects: [],
    achievements: "",
    startYear: "",
    endYear: ""
  });

  const [tertiary, setTertiary] = useState({
    university: "",
    degree: "",
    startYear: "",
    endYear: "",
    studying: false
  });

  const [aboutMe, setAboutMe] = useState("");

  // ⬇⬇ NEW: refs for controlled scrolling
  const contentRef = useRef(null);
  const stepTopRef = useRef(null);

  // ⬇⬇ NEW: reset inner scroll whenever the step changes
  useLayoutEffect(() => {
    const scroller = contentRef.current;
    if (scroller) {
      scroller.scrollTo({ top: 0, behavior: "auto" });
    } else {
      // fallback if contentRef isn't attached yet
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [step]);

  // ⬇⬇ NEW: avoid browser auto-scroll to focused input on step change
  const blurActive = () => {
    if (document.activeElement && typeof document.activeElement.blur === "function") {
      document.activeElement.blur();
    }
  };

  // Check if inputs are valid
  const validateFields = (personal, secondary, tertiary) => {
    const errors = {};

    // --- Personal ---

    // Phone (7–15 digits only)
    if (!/^\d{7,15}$/.test(personal.phone.trim())) {
      errors.phone = "Enter a valid phone number (7–15 digits)";
    }

    // Email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email.trim())) {
      errors.email = "Enter a valid email address";
    }

    // LinkedIn (must start with https://www.linkedin.com/)
    if (
      personal.linkedin.trim() &&
      !/^https?:\/\/(www\.)?linkedin\.com\/.*$/.test(personal.linkedin.trim())
    ) {
      errors.linkedin = "Enter a valid LinkedIn profile URL";
    }

    // --- Secondary Education ---
    const currentYear = new Date().getFullYear();
    if (secondary.startYear) {
      if (!/^\d{4}$/.test(secondary.startYear)) {
        errors.secondaryStartYear = "Enter a valid year";
      } else if (parseInt(secondary.startYear) > currentYear) {
        errors.secondaryStartYear = "Start year cannot be in the future";
      }
    }
    if (secondary.endYear) {
      if (!/^\d{4}$/.test(secondary.endYear)) {
        errors.secondaryEndYear = "Enter a valid year";
      } else if (parseInt(secondary.endYear) > currentYear) {
        errors.secondaryEndYear = "End year cannot be in the future";
      }
    }
    if (
      secondary.startYear &&
      secondary.endYear &&
      parseInt(secondary.startYear) > parseInt(secondary.endYear)
    ) {
      errors.secondaryEndYear = "End year must be later than start year";
    }

    // --- Tertiary Education ---
    if (tertiary.startYear) {
      if (!/^\d{4}$/.test(tertiary.startYear)) {
        errors.tertiaryStartYear = "Enter a valid year";
      } else if (parseInt(tertiary.startYear) > currentYear) {
        errors.tertiaryStartYear = "Start year cannot be in the future";
      }
    }
    if (!tertiary.studying && tertiary.endYear) {
      if (!/^\d{4}$/.test(tertiary.endYear)) {
        errors.tertiaryEndYear = "Enter a valid year";
      } else if (parseInt(tertiary.endYear) > currentYear) {
        errors.tertiaryEndYear = "End year cannot be in the future";
      }
    }
    if (
      tertiary.startYear &&
      tertiary.endYear &&
      parseInt(tertiary.startYear) > parseInt(tertiary.endYear)
    ) {
      errors.tertiaryEndYear = "End year must be later than start year";
    }

    return errors;
  };

  const handleSaveAndContinue = () => {
    const validationErrors = validateFields(personal, secondary, tertiary);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    blurActive();
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    blurActive();
    setStep((s) => Math.max(0, s - 1));
  };

  // Snapshots from DB for ConfirmLeave check
  const [dbPersonal, setDbPersonal] = useState(null);
  const [dbSecondary, setDbSecondary] = useState(null);
  const [dbTertiary, setDbTertiary] = useState(null);
  const [dbAboutMe, setDbAboutMe] = useState(null);

  // Fetch existing data from database

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/users/me/cv", { withCredentials: true });
        const data = res.data;

        if (data?.cvFile) {
          setCvFileMeta({
            name: data.cvFile.filename,
            size: data.cvFile.size
          });
        }

        if (data) {
          // Split full phone into code and number
          let countryCode = "+64";
          let phoneNumber = "";
          const fullPhone = data.contact?.phone || "";

          if (fullPhone.startsWith("+")) {
            // find where country code ends (first non-digit after +)
            const match = fullPhone.match(/^(\+\d{1,3})(.*)$/);
            if (match) {
              countryCode = match[1];
              phoneNumber = match[2].trim();
            }
          } else {
            phoneNumber = fullPhone;
          }

          const loadedPersonal = {
            firstName: data.firstName || user.firstName || "",
            lastName: data.lastName || user.lastName || "",
            countryCode,
            phone: phoneNumber,
            email: data.contact?.email || user.email || "",
            linkedin: data.contact?.linkedin || user.linkedin || ""
          };
          setPersonal(loadedPersonal);
          setDbPersonal(loadedPersonal); // snapshot of database data

          const loadedSecondary = {
            school: data.education?.secondary?.schoolName || "",
            subjects: data.education?.secondary?.subjects || [],
            achievements: data.education?.secondary?.achievements || "",
            startYear: data.education?.secondary?.startYear || "",
            endYear: data.education?.secondary?.endYear || ""
          };
          setSecondary(loadedSecondary);
          setDbSecondary(loadedSecondary); // snapshot of database data

          const tertiaryData = data.education?.tertiary?.[0] || {};
          const loadedTertiary = {
            university: tertiaryData.university || "",
            degree: tertiaryData.degree || "",
            startYear: tertiaryData.startYear || "",
            endYear: tertiaryData.endYear === "Present" ? "" : tertiaryData.endYear || "",
            studying: tertiaryData.endYear === "Present"
          };
          setTertiary(loadedTertiary);
          setDbTertiary(loadedTertiary); // snapshot of database data

          const loadedAboutMe = data.aboutMe || "";
          setAboutMe(loadedAboutMe);
          setDbAboutMe(loadedAboutMe); // snapshot of database data
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [user]);

  // Warn before reload/close browser
  useEffect(() => {
    const isDirty = () =>
      JSON.stringify(personal) !== JSON.stringify(dbPersonal) ||
      JSON.stringify(secondary) !== JSON.stringify(dbSecondary) ||
      JSON.stringify(tertiary) !== JSON.stringify(dbTertiary) ||
      aboutMe !== dbAboutMe;
    const handleBeforeUnload = (e) => {
      if (isDirty()) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave this page?";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [personal, secondary, tertiary, aboutMe, dbPersonal, dbSecondary, dbTertiary, dbAboutMe]);

  // Check if data in form is different from the one in the database when user click close button
  const handleLocalClose = () => {
    const hasChanges =
      JSON.stringify(personal) !== JSON.stringify(dbPersonal) ||
      JSON.stringify(secondary) !== JSON.stringify(dbSecondary) ||
      JSON.stringify(tertiary) !== JSON.stringify(dbTertiary) ||
      aboutMe !== dbAboutMe;

    onClose(hasChanges);
  };

  const handleClear = () => {
    if (step === 0)
      setPersonal({ firstName: "", lastName: "", countryCode: "+64", phone: "", email: "", linkedin: "" });
    if (step === 1)
      setSecondary({ school: "", subjects: [], achievements: "", startYear: "", endYear: "" });
    if (step === 2)
      setTertiary({ university: "", degree: "", startYear: "", endYear: "", studying: false });
    if (step === 3) setAboutMe("");
  };

  // Normal form submission
  // Sending data to backend after form submission
  const { completeTask } = useUserStore();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFields(personal, secondary, tertiary);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix errors before submitting");
      return;
    }
    setErrors({});
    const payload = {
      firstName: personal.firstName,
      lastName: personal.lastName,
      contact: {
        phone: personal.countryCode + personal.phone,
        // NOTE: if you’re splitting the email UI, make sure this is a full email
        email: personal.email, // ← don’t append "gmail.com" here unless that’s intentional
        linkedin: personal.linkedin
      },
      education: {
        secondary: {
          schoolName: secondary.school,
          subjects: secondary.subjects,
          achievements: secondary.achievements,
          startYear: secondary.startYear,
          endYear: secondary.endYear
        },
        tertiary: [
          {
            university: tertiary.university,
            degree: tertiary.degree,
            startYear: tertiary.startYear,
            endYear: tertiary.studying ? "Present" : tertiary.endYear
          }
        ]
      },
      aboutMe
    };

    try {
      const res = await api.post("/users/me/cv/personal-information", payload, {
        withCredentials: true
      });
      toast.success(res.data.message);
      console.log(res.data);

      // Update database states with new data
      setDbPersonal(personal);
      setDbSecondary(secondary);
      setDbTertiary(tertiary);
      setDbAboutMe(aboutMe);
      onTaskComplete?.();
      setIsSubmitted(true); // allow closing/leaving
      onClose(false, true); // hasChanges = false, force = true, bypass ConfirmLeave check
      // Get subtaskId by module name, level number and subtask sequence number
      let subtaskId;
      try {
        subtaskId = await getSubtaskBySequenceNumber("CV Builder", 1, 1);
      } catch (err) {
        console.error("Failed to get subtask ID", err);
        toast.error("Could not find subtask");
        return;
      }

      try {
        const done = await completeTask(subtaskId);
        if (done?.data?.message === "Well Done! You completed the subtask") {
          toast.success("Task 1 completed!");
          
        }
      } catch (err) {
        console.error("Failed to complete task", err);
        toast.error("Could not mark task complete");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving data!");
    }
  };

  // Handle resume upload
  const handleResumeUpload = async () => {
    try {
      // Mark Task 1 complete
      let subtask1Id = await getSubtaskBySequenceNumber("CV Builder", 1, 1);
      const task1Done = await completeTask(subtask1Id);
      setTask1Complete(true);

      // Mark Task 2 complete
      let subtask2Id = await getSubtaskBySequenceNumber("CV Builder", 1, 2);
      const task2Done = await completeTask(subtask2Id);
      setTask2Complete(true);

      // Unlock Task 3
      setTask3Complete(false); // not completed yet, but unlocked
      if (
        task1Done?.data?.message === "Well Done! You completed the subtask" &&
        task2Done?.data?.message === "Well Done! You completed the subtask"
      ) {
        toast.success("Tasks 1 & 2 marked as complete!");
      }
    } catch (err) {
      console.error("Failed to auto-complete tasks", err);
      toast.error("Could not mark tasks as complete");
    }
  };

  // Check if step is valid
  const isStepValid = () => {
    if (step === 0) return personal.firstName && personal.lastName && personal.email;
    if (step === 1)
      return secondary.school && secondary.subjects && secondary.startYear && secondary.endYear;
    if (step === 2)
      return (
        tertiary.university &&
        tertiary.degree &&
        tertiary.startYear &&
        (tertiary.studying || tertiary.endYear)
      );
    if (step === 3) return aboutMe.trim().length > 0;
    return false;
  };

  // Render step
  const renderStep = () => {
    switch (step) {
      case 0:
        return <PerInfo personal={personal} setPersonal={setPersonal} errors={errors} />;
      case 1:
        return <SecEdu secondary={secondary} setSecondary={setSecondary} errors={errors} />;
      case 2:
        return <TerEdu tertiary={tertiary} setTertiary={setTertiary} errors={errors} />;
      case 3:
        return <Aboutme aboutMe={aboutMe} setAboutMe={setAboutMe} />;
      default:
        return <p>All done 🎉</p>;
    }
  };


  // Sound Effect
  const playClickSound = () => {
  const audio = new Audio("/sounds/mouse-click-290204.mp3");
  audio.currentTime = 0; // rewind to start for rapid clicks
  audio.play();
  };
  
  // UI
  return (
    <div className="flex flex-col h-full">
      {mode === "chooser" && (
        <div className="flex flex-col justify-center">
          {/* Right: Close */}
          <button
            onClick={handleLocalClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-xl"
            aria-label="Close"
          >
            ✖
          </button>
          <MethodChooser
            onSelectUpload={() => setMode("upload")}
            onSelectManual={() => setMode("manual")}
            onClose={onClose}
          />
        </div>
      )}

      {mode === "upload" && (
        <>
          <button
            onClick={handleBackToChoice}
            className="absolute top-6 left-6 text-gray-600 hover:text-[#4f9cf9] text-sm"
          >
            ← Change Method
          </button>
          {/* Right: Close */}
          <button
            onClick={handleLocalClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-xl"
            aria-label="Close"
          >
            ✖
          </button>

          <ResumeUpload
            onUpload={handleResumeUpload}
            onRemove={async () => console.log("Removed")}
            onAddUrl={async (url) => console.log("Added URL:", url)}
            initialFileName={cvFileMeta?.name}
            initialFileSize={cvFileMeta?.size}
          />
        </>
      )}

      {mode === "manual" && (
        <>
          {/* Show this button ONLY on the first step to go back to the method chooser */}
          {step === 0 && (
            <button
              onClick={handleBackToChoice}
              className="absolute top-2 left-4 p-3 text-gray-600 hover:text-[#4f9cf9] text-sm "
            >
              ← Change Method
            </button>
          )}
          {/* Sticky white header with Back • centered pills • Close */}
          <header className="sticky top-0 z-40 bg-white mt-4">
            <div className="mx-auto max-w-[880px] px-4 py-3 grid grid-cols-[auto_1fr_auto] items-center">
              {/* Left: Back (reserve width when hidden to keep center centered) */}
              <div className="min-w-[60px]">
                {step > 0 && (
                  <button
                    onClick={handleBack} // ⬅ use handler so blur + scroll reset run
                    className="text-gray-600 hover:text-[#4f9cf9] text-sm"
                  >
                    ← Back
                  </button>
                )}
              </div>

              {/* Center: Progress pills */}
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

          {/* The ONLY scrollable area */}
          <div
            ref={contentRef}
            className="flex-1 overflow-y-auto px-6"
            style={{ scrollbarGutter: "stable" }}
          >
            <div ref={stepTopRef} className="h-0" />
            {renderStep()}
          </div>

          {/* Footer buttons */}
          <div className="flex justify-between p-4">
            <div className="mx-auto max-w-[680px] grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                className="inline-flex items-center justify-center
              h-12 md:h-14 px-8 md:px-10 rounded-full
              bg-white border-2 border-[#4f9cf9]
              text-[#4f9cf9] font-extrabold
              hover:bg-[#4f9cf9]/5
              focus:outline-none focus:ring-2 focus:ring-[#4f9cf9]
              min-w-[200px]"
                onClick={() => {
                playClickSound();
                handleClear();
              }}
              >
                Clear
              </button>

              {step < 3 ? (
                <button
                  className={`inline-flex items-center justify-center
                h-12 md:h-14 px-8 md:px-10 rounded-full
                bg-[#4f9cf9] text-white 
                font-extrabold text-base md:text-lg
                shadow-sm hover:bg-[#4f9cf9]/90
                focus:outline-none focus:ring-2 focus:ring-[#4f9cf9]
                min-w-[200px] ${!isStepValid() ? "opacity-60 cursor-not-allowed" : ""}`}
                onClick={() => {
                    if (!isStepValid()) return; // prevent sound if disabled

                    // Play click sound
                    playClickSound();

                    // Call your original function
                    handleSaveAndContinue();
                  }}
                  disabled={!isStepValid()}
                >
                  Save & Continue
                </button>
              ) : (
                <button
                  className={`inline-flex items-center justify-center
                h-12 md:h-14 px-8 md:px-10 rounded-full
                bg-[#4f9cf9] text-white
                font-extrabold text-base md:text-lg
                shadow-sm hover:bg-[#4f9cf9]/90
                focus:outline-none focus:ring-2 focus:ring-[#4f9cf9]
                min-w-[200px] ${!isStepValid() ? "opacity-65 cursor-not-allowed" : ""}`}
                  onClick={handleSubmit}
                  disabled={!isStepValid()}
                >
                  Save & Submit
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CVSubtask1;
