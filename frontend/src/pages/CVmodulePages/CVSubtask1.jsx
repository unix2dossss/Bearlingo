import React, { useState, useEffect } from "react";
import api from "../../lib/axios";
import { toast } from "react-hot-toast";
import PerInfo from "../../components/CVModuleComponent/PerInfo";
import TerEdu from "../../components/CVModuleComponent/TerEdu";
import SecEdu from "../../components/CVModuleComponent/SecEdu";
import Aboutme from "../../components/CVModuleComponent/Aboutme";

const CVSubtask1 = () => {
  const [step, setStep] = useState(0);

  // form states
  const [personal, setPersonal] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    linkedin: ""
  });

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

  // Load saved state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cvTask1");
    if (saved) {
      const parsed = JSON.parse(saved);
      setStep(parsed.step || 0);
      setPersonal(parsed.personal || personal);
      setSecondary(parsed.secondary || secondary);
      setTertiary(parsed.tertiary || tertiary);
      setAboutMe(parsed.aboutMe || "");
    }
  }, []);

  // Save progress to localStorage when user clicks Save & Continue
  const handleSaveAndContinue = () => {
    const stateToSave = { step: step + 1, personal, secondary, tertiary, aboutMe };
    localStorage.setItem("cvTask1", JSON.stringify(stateToSave));
    setStep(step + 1);
  };

  // clear current section
  const handleClear = () => {
    if (step === 0)
      setPersonal({ firstName: "", lastName: "", phone: "", email: "", linkedin: "" });
    else if (step === 1)
      setSecondary({ school: "", subjects: "", achievements: "", startYear: "", endYear: "" });
    else if (step === 2)
      setTertiary({ university: "", degree: "", startYear: "", endYear: "", studying: false });
    else if (step === 3) setAboutMe("");
  };

  // Sending data to backend after form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      contact: {
        firstName: personal.firstName,
        lastName: personal.lastName,
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
      const res = await api.post("/users/me/cv/personal-information", payload);
      toast.success("Data saved successfully!");
      console.log(res.data);
      // Save latest state locally
      localStorage.setItem(
        "cvTask1",
        JSON.stringify({ step, personal, secondary, tertiary, aboutMe })
      );
    } catch (err) {
      console.error(err);
      toast.error("Error saving data!");
    }
  };

  // step content
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
         <><PerInfo></PerInfo></>
        );
      case 1:
        return (
          <><SecEdu></SecEdu></>
        );
      case 2:
        return (
          //<TerEdu form={terßiary} setForm={setTertiary}></TerEdu>
          <><TerEdu></TerEdu></>
        );
      case 3:
        return (
          <><Aboutme></Aboutme></>
        );
      default:
        return <p className="text-center">All sections completed 🎉</p>;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="w-full p-6 space-y-6 flex-1">
        {/* ✅ Back button */}
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="absolute top-3 left-3 text-gray-600 hover:text-blue-500 text-lg"
          >
            ← Back
          </button>
        )}
        {renderStep()}
        <div className="flex justify-between mt-6">
          <button className="inline-flex items-center justify-center
              h-12 md:h-14 px-8 md:px-10 rounded-full
             bg-white border-2 border-[#4f9cf9]
             text-[#4f9cf9] font-extrabold
             hover:bg-[#4f9cf9]/5
             focus:outline-none focus:ring-2 focus:ring-[#4f9cf9]
             min-w-[300px] " onClick={handleClear}>
            Clear
          </button>
          {step < 3 && (
            <button className="inline-flex items-center justify-center
                 h-12 md:h-14 px-8 md:px-10 rounded-full
                 bg-[#4f9cf9] text-white 
                 font-extrabold text-base md:text-lg
                 shadow-sm hover:bg-[#4f9cf9]/90
                 focus:outline-none focus:ring-2 focus:ring-[#4f9cf9]
                 min-w-[300px]"onClick={handleSaveAndContinue}>
              Save & Continue
            </button>
          )}
          {step === 3 && (
            <button className="inline-flex items-center justify-center
                 h-12 md:h-14 px-8 md:px-10 rounded-full
                 bg-[#4f9cf9] text-white
                 font-extrabold text-base md:text-lg
                 shadow-sm hover:bg-[#4f9cf9]/90
                 focus:outline-none focus:ring-2 focus:ring-[#4f9cf9]
                 min-w-[300px]" onClick={handleSubmit}>
              Save & Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CVSubtask1;
