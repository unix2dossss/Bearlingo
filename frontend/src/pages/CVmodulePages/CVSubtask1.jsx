import React, { useState, useEffect } from "react";
import api from "../../lib/axios";
import { toast } from "react-hot-toast";
import PerInfo from "../../components/CVModuleComponent/PerInfo";
import TerEdu from "../../components/CVModuleComponent/TerEdu";
import SecEdu from "../../components/CVModuleComponent/SecEdu";
import Aboutme from "../../components/CVModuleComponent/Aboutme";
import { getSubtaskBySequenceNumber } from "../../utils/moduleHelpers";
import { useUserStore } from "../../store/user";

const CVSubtask1 = ({ personal, setPersonal, isSubmitted, setIsSubmitted, onClose }) => {
  const [step, setStep] = useState(0);
  const [secondary, setSecondary] = useState({
    school: "",
    subjects: "",
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
  const [loading, setLoading] = useState(true);

  // Fetch existing data from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/users/me/cv", { withCredentials: true });
        const data = res.data;

        if (data) {
          setPersonal({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            phone: data.contact?.phone || "",
            email: data.contact?.email || "",
            linkedin: data.contact?.linkedin || ""
          });

          setSecondary({
            school: data.education?.secondary?.schoolName || "",
            subjects: data.education?.secondary?.subjects || "",
            achievements: data.education?.secondary?.achievements || "",
            startYear: data.education?.secondary?.startYear || "",
            endYear: data.education?.secondary?.endYear || ""
          });

          const tertiaryData = data.education?.tertiary?.[0] || {};
          setTertiary({
            university: tertiaryData.university || "",
            degree: tertiaryData.degree || "",
            startYear: tertiaryData.startYear || "",
            endYear: tertiaryData.endYear === "Present" ? "" : tertiaryData.endYear || "",
            studying: tertiaryData.endYear === "Present"
          });

          setAboutMe(data.aboutMe || "");
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [setPersonal]);

  // Warn before reload/close browser
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isSubmitted) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave this page?";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isSubmitted]);

  const handleSaveAndContinue = () => {
    setStep(step + 1);
  };

  const handleClear = () => {
    if (step === 0)
      setPersonal({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        linkedin: ""
      });
    if (step === 1)
      setSecondary({
        school: "",
        subjects: "",
        achievements: "",
        startYear: "",
        endYear: ""
      });
    if (step === 2)
      setTertiary({
        university: "",
        degree: "",
        startYear: "",
        endYear: "",
        studying: false
      });
    if (step === 3) setAboutMe("");
  };

  // Sending data to backend after form submission
  const { completeTask } = useUserStore();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      firstName: personal.firstName,
      lastName: personal.lastName,
      contact: {
        phone: personal.phone,
        email: personal.email,
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
      aboutMe: aboutMe
    };

    try {
      const res = await api.post("/users/me/cv/personal-information", payload, {
        withCredentials: true // Tells the browser to accept cookies from the backend and include them in future requests.
      });
      toast.success(res.data.message);
      console.log(res.data);
      setIsSubmitted(true); // allow closing/leaving
      onClose(true); // force close, bypass ConfirmLeave check
      // Get subtaskId by module name, level number and subtask sequence number
      let subtaskId;
      try {
        subtaskId = await getSubtaskBySequenceNumber("CV Builder", 1, 1);
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
    if (loading) return <p>Loading...</p>;

    switch (step) {
      case 0:
        return <PerInfo personal={personal} setPersonal={setPersonal} />;
      case 1:
        return <SecEdu secondary={secondary} setSecondary={setSecondary} />;
      case 2:
        return <TerEdu tertiary={tertiary} setTertiary={setTertiary} />;
      case 3:
        return <Aboutme aboutMe={aboutMe} setAboutMe={setAboutMe} />;
      default:
        return <p>All done 🎉</p>;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto relative">
      {step > 0 && (
        <button
          onClick={() => setStep(step - 1)}
          className="absolute top-2 left-2 text-gray-600 hover:text-blue-500 text-sm"
        >
          ← Back
        </button>
      )}

      {/* Removed close button - parent handles it */}
      {renderStep()}

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
            onClick={handleClear}
          >
            Clear
          </button>
          {step < 3 && (
            <button
              className={`inline-flex items-center justify-center
                 h-12 md:h-14 px-8 md:px-10 rounded-full
                 bg-[#4f9cf9] text-white 
                 font-extrabold text-base md:text-lg
                 shadow-sm hover:bg-[#4f9cf9]/90
                 focus:outline-none focus:ring-2 focus:ring-[#4f9cf9]
                 min-w-[200px] ${!isStepValid() ? "opacity-60 cursor-not-allowed" : ""}`}
              onClick={handleSaveAndContinue}
              disabled={!isStepValid()}
            >
              Save & Continue
            </button>
          )}
          {step === 3 && (
            <button
              className={`inline-flex items-center justify-center
                 h-12 md:h-14 px-8 md:px-10 rounded-full
                 bg-[#4f9cf9] text-white
                 font-extrabold text-base md:text-lg
                 shadow-sm hover:bg-[#4f9cf9]/500
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
    </div>
  );
};

export default CVSubtask1;
