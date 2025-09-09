import React, { useState, useEffect } from "react";
import api from "../../lib/axios";
import { toast } from "react-hot-toast";

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
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-center">Section 1: Personal Info</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Enter your first name"
                className="input input-bordered w-full"
                value={personal.firstName}
                onChange={(e) => setPersonal({ ...personal, firstName: e.target.value })}
              />
              <input
                type="text"
                placeholder="Enter your last name"
                className="input input-bordered w-full"
                value={personal.lastName}
                onChange={(e) => setPersonal({ ...personal, lastName: e.target.value })}
              />
            </div>
            <input
              type="text"
              placeholder="Phone Number"
              className="input input-bordered w-full"
              value={personal.phone}
              onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full"
              value={personal.email}
              onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="LinkedIn Profile"
              className="input input-bordered w-full"
              value={personal.linkedin}
              onChange={(e) => setPersonal({ ...personal, linkedin: e.target.value })}
            />
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-center">Section 2: Secondary Education</h2>
            <input
              type="text"
              placeholder="Enter your school name"
              className="input input-bordered w-full"
              value={secondary.school}
              onChange={(e) => setSecondary({ ...secondary, school: e.target.value })}
            />
            <input
              type="text"
              placeholder="List the main subjects you studied"
              className="input input-bordered w-full"
              value={secondary.subjects}
              onChange={(e) => setSecondary({ ...secondary, subjects: e.target.value })}
            />
            <input
              type="text"
              placeholder="Achievements (optional)"
              className="input input-bordered w-full"
              value={secondary.achievements}
              onChange={(e) => setSecondary({ ...secondary, achievements: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Start Year"
                className="input input-bordered w-full"
                value={secondary.startYear}
                onChange={(e) => setSecondary({ ...secondary, startYear: e.target.value })}
              />
              <input
                type="text"
                placeholder="End Year"
                className="input input-bordered w-full"
                value={secondary.endYear}
                onChange={(e) => setSecondary({ ...secondary, endYear: e.target.value })}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-center">Section 3: Tertiary Education</h2>
            <input
              type="text"
              placeholder="Enter your university name"
              className="input input-bordered w-full"
              value={tertiary.university}
              onChange={(e) => setTertiary({ ...tertiary, university: e.target.value })}
            />
            <input
              type="text"
              placeholder="Degree(s) Name"
              className="input input-bordered w-full"
              value={tertiary.degree}
              onChange={(e) => setTertiary({ ...tertiary, degree: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Start Year"
                className="input input-bordered w-full"
                value={tertiary.startYear}
                onChange={(e) => setTertiary({ ...tertiary, startYear: e.target.value })}
              />
              <input
                type="text"
                placeholder="End Year"
                className="input input-bordered w-full"
                value={tertiary.endYear}
                onChange={(e) => setTertiary({ ...tertiary, endYear: e.target.value })}
                disabled={tertiary.studying}
              />
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="checkbox"
                checked={tertiary.studying}
                onChange={(e) => setTertiary({ ...tertiary, studying: e.target.checked })}
              />
              <span>Currently studying</span>
            </label>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-center">Section 4: About Me</h2>
            <p className="text-center text-gray-600">Please fill out your details</p>

            {/* Writing Guide */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold">Writing Guide (3–5 sentences):</h3>
              <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
                <li>
                  <strong>Sentence 1:</strong> Who You Are – Start with your academic status and
                  field of study. Mention 1–2 key positive attributes.
                </li>
                <li>
                  <strong>Sentences 2–3:</strong> Your Key Skills & Knowledge – Highlight
                  coursework, technical skills, internships, or soft skills through university
                  projects.
                </li>
                <li>
                  <strong>Sentence 4–5:</strong> Your General Goal – State the type of role you’re
                  seeking and what you hope to contribute.
                </li>
              </ul>
            </div>

            {/* Example */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="font-semibold">Example:</p>
              <p className="text-sm italic text-gray-700 mt-1">
                "A motivated and detail-oriented recent graduate with a Bachelor of Science in
                Computer Science. Developed a strong foundation in object-oriented programming and
                database management through challenging academic projects, including the creation of
                a full-stack web application. Seeking an entry-level software developer position to
                apply my problem-solving skills and contribute to building innovative software
                solutions."
              </p>
            </div>

            {/* About Me Paragraph Input */}
            <div className="space-y-2">
              <label className="font-semibold">About Me Paragraph</label>
              <textarea
                className="textarea textarea-bordered w-full h-32"
                placeholder="Write your about me paragraph following the guide above..."
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
              />
            </div>
          </div>
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
          <button className="btn btn-outline" onClick={handleClear}>
            Clear
          </button>
          {step < 3 && (
            <button className="btn btn-primary" onClick={handleSaveAndContinue}>
              Save & Continue
            </button>
          )}
          {step === 3 && (
            <button className="btn btn-primary" onClick={handleSubmit}>
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CVSubtask1;
