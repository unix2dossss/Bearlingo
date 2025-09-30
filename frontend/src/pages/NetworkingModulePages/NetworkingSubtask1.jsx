import React, { useEffect, useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { gsap } from "gsap";
import toast from "react-hot-toast";
import Bear from "../../assets/Bear.svg";
import api from "../../lib/axios";

//Import Components
import SkillList from "../../components/NetworkingModuleComponents/NetworkingSubtask1/SkillList";
import Headline from "../../components/NetworkingModuleComponents/NetworkingSubtask1/HeadLine";


export default function NetworkingSubtask1({ userInfo = {}, onBack }) {
  const [currentSpeechIndex, setCurrentSpeechIndex] = useState(0);
  const [animationDone, setAnimationDone] = useState(false);

  const [selectedHeadline, setSelectedHeadline] = useState("");
  //const [customHeadline, setCustomHeadline] = useState("");
  const [university, setUniversity] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [careerGoal, setCareerGoal] = useState("");
  const [userHasProfile, setUserHasProfile] = useState(false);
  const [savedProfile, setSavedProfile] = useState("");

  const speechForSubtask1 = [
    "Hi there! 👋",
    "Welcome to the first subtask of the Networking Module!",
    "This will only take a few minutes - you'll create a simple LinkedIn profile like this one.",
    "Complete this task to earn XPs and advance your career!",
    "Choose one of the suggested headlines or create your own.",
    "Which university are you attending?",
    "Select top four skills that apply — both technical and soft skills.",
    "What is your career goal?",
    "Congratulations! You have finished your LinkedIn profile! Nice job 🔥",
  ];

  const allSkills = [
    "Python", "Java", "C++", "JavaScript", "React", "Node.js",
    "SQL", "Git", "Linux", "AWS", "Docker", "Machine Learning",
    "Communication", "Teamwork", "Problem Solving", "Adaptability",
  ];


  const getLinkedInProfile = async () => {
    try {
      const profileExists = await api.get(
        "/users/me/networking/linkedin-profile",
        { withCredentials: true });
      console.log("profileExists: ", profileExists);
      if (profileExists.status == 200 && profileExists.data.message == "Linked In Profile Retrieved Succesfully!") {
        setSavedProfile(profileExists.data.linkedInProfile);
        setUserHasProfile(true);
        console.log("profileExists.data.linkedInProfile", profileExists.data.linkedInProfile);
        toast.success("Profile retrieved!");
      } else {
        setUserHasProfile(false);
      }
    } catch (error) {

      console.log("Error in retrieving linkedInProfile: ", error.message);
      toast.error("Server error");
    }
  };


  // Run once when component mounts to check if user already has a profile
  useEffect(() => {
    getLinkedInProfile();
  }, []);

  // Bear intro animation (runs once when mounted)
  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { duration: 0.8, ease: "power3.out" },
      onComplete: () => setAnimationDone(true),
    });

    tl.fromTo(
      ".bear",
      { scale: 0, rotation: -180, opacity: 0, x: -200, y: -100 },
      { scale: 1, rotation: 0, opacity: 1, x: 0, y: 0, duration: 1.2 }
    ).to(".bear", { y: -30, duration: 0.4, yoyo: true, repeat: 1, ease: "power2.inOut" });
  }, []);

  // Bubble pop animation when text changes
  useEffect(() => {
    if (!animationDone) return;
    gsap.fromTo(
      ".bear-speech",
      { opacity: 0, y: 50, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: "back.out(1.7)" }
    );
  }, [currentSpeechIndex, animationDone]);

  const handleNext = () => {
    if (currentSpeechIndex < speechForSubtask1.length - 1) {
      setCurrentSpeechIndex((i) => i + 1);
    }
  };

  const handleSkillChange = (e) => {
    const value = Array.from(e.target.selectedOptions, (o) => o.value);
    setSelectedSkills(value);
  };

  // Save profile to database
  const saveProfile = async () => {
    try {
      // Build keySkills object
      const keySkills = {};
      selectedSkills.forEach((skill, index) => {
        keySkills[`keySkill${index + 1}`] = skill;
      });
      const profile = await api.put(
        "/users/me/networking/linkedin-profile",
        {
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          profressionalHeadline: selectedHeadline,
          keySkills: keySkills,
          objective: careerGoal
        },
        { withCredentials: true });
      setSavedProfile(profile.data.linkedInProfile);
      setUserHasProfile(true);

      toast.success("Profile saved!");

    } catch (error) {
      console.log("Error in saving profile to database: ", error);
      toast.error("Error in saving profile to database");
    }
  };

// Max skills user can pick on step skills
const MAX_SKILLS = 4;

const toggleSkill = (skill) => {
  setSelectedSkills((prev) => {
    const isSelected = prev.includes(skill);
    if (isSelected) return prev.filter((s) => s !== skill);
    if (prev.length >= MAX_SKILLS) {
      toast.error(`You can select up to ${MAX_SKILLS} skills.`);
      return prev;
    }
    return [...prev, skill];
  });
};



  return (
    <div className="pt-16 bg-[#4f9cf9] relative min-h-screen flex flex-row min-w-0 gap-4 p-4">
      {/* Go back */}
      <button
        className="btn btn-ghost absolute top-20 left-6 z-10"
        onClick={onBack}
      >
        <ArrowLeftIcon className="size-5" />
        Back to subtasks
      </button>

    {/* Left: Bear + Speech */}
    <div className="flex flex-1 items-center justify-center">
    <div className="relative w-full max-w-[500px] aspect-square">
      <img
        src={Bear}
        alt="Bear Mascot"
        className="absolute inset-0 w-full h-full object-contain"
      />

      {/* Speech bubble */}
      {animationDone && userHasProfile === true && (
        <div
          key="profile-speech"
          className="chat chat-start absolute -top-4 left-1/2 -translate-x-1/2 translate-x-24 opacity-0 bear-speech"
        >
          <div className="chat-bubble">
            Hi {userInfo?.username || "there"}! 👋. Take a look at your LinkedIn profile!
          </div>
        </div>
      )}

      {animationDone && userHasProfile === false && (
        <div
          key={currentSpeechIndex}
          className="chat chat-start absolute -top-4 left-1/2 -translate-x-1/2 translate-x-24 opacity-0 bear-speech"
        >
          <div className="chat-bubble">
            {currentSpeechIndex === 0
              ? `Hi ${userInfo?.username || "there"}! 👋`
              : speechForSubtask1[currentSpeechIndex]}
          </div>
        </div>
      )}

      {/* Next button */}
      {animationDone &&
        userHasProfile === false &&
        currentSpeechIndex < speechForSubtask1.length - 1 && (
          <button
            className="absolute -bottom-20 left-1/2 -translate-x-1/2 px-6 py-2
                      bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-lg"
            onClick={handleNext}
          >
            Next
          </button>
              )}
          </div>
        </div>



      {/* Right: Dynamic Panels */}
      <div className="flex-1">

        {userHasProfile == true && (
          <div className="flex flex-col items-center mt-32">
            <div className="card w-full max-w-md bg-white shadow-lg rounded-xl overflow-hidden">
              <div className="card-body space-y-6">
                <div className="flex flex-col items-center text-center border-b border-gray-200 pb-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {userInfo?.firstName} {userInfo?.lastName}
                  </h1>
                  <p className="text-gray-600 mt-1">{savedProfile.professionalHeadline}</p>
                  <p className="text-gray-500 mt-2 text-sm">{savedProfile.university}</p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Key Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(savedProfile.keySkills).map((skill, index) => { //  Object.values(savedProfile.keySkills) converts the keySkills object into an array of its values
                      if (!skill) return null; // skip empty values
                      return (
                        <span key={index} className="badge badge-outline">
                          {skill}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Career Goals</h2>
                  <p className="text-gray-600 text-sm">{savedProfile.objective}</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Example card preview (index 2) */}
        {currentSpeechIndex === 2 && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/4 -translate-y-1/2 translate-x-48">
            <div className="card w-full max-w-md bg-white shadow-lg rounded-xl overflow-hidden">
              <div className="card-body space-y-6">
                <div className="flex flex-col items-center text-center border-b border-gray-200 pb-4">
                  <h1 className="text-2xl font-bold text-gray-900">John Smith</h1>
                  <p className="text-gray-600 mt-1">Manager at Xero | CEO of Meta</p>
                  <p className="text-gray-500 mt-2 text-sm">University of Auckland</p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Key Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="badge badge-outline">Python</span>
                    <span className="badge badge-outline">Java</span>
                    <span className="badge badge-outline">React</span>
                    <span className="badge badge-outline">Leadership</span>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Career Goals</h2>
                  <p className="text-gray-600 text-sm">
                    Interested in developing innovative software solutions and leading tech teams in the fintech industry.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Headline pick (index 4) */}
        {currentSpeechIndex === 4 && !userHasProfile && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/4 -translate-y-1/4 translate-x-48 ">
            {/* Headline component */}
            <Headline
              value={selectedHeadline}
              onChange={setSelectedHeadline}
              className="w-[350px]"
            />
          </div>
        )}


        {/* University (index 5) */}
        {currentSpeechIndex === 5 && userHasProfile == false && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/4 -translate-y-1/4 translate-x-48">
            <div className="flex flex-row gap-1">
              <input
                type="text"
                placeholder="Enter university here"
                className="input w-3/4 text-xl px-4 py-2"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
              />
              <button
                className="btn"
                onClick={() => {
                  if (university.trim() !== "") {
                    toast.success("University saved!");
                  }
                }}
              >
                Submit
              </button>
            </div>
            {console.log("Headline: ", selectedHeadline)}
          </div>
        )}

        {/* Skills (index 6) */}
        {currentSpeechIndex === 6 && userHasProfile === false && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/4 -translate-y-1/2 translate-x-48">
          <SkillList
            allSkills={allSkills}
            selectedSkills={selectedSkills}
            toggleSkill={toggleSkill}
            maxSkills={MAX_SKILLS}
          />
        </div>
      )}

        {/* Career goal (index 7) */}
        {currentSpeechIndex === 7 && userHasProfile == false && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/4 -translate-y-1/4 translate-x-48">
            <div className="flex flex-row gap-1">
              <input
                type="text"
                placeholder="Enter career goal here"
                className="input w-[90%]"
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
              />
              <button
                className="btn"
                onClick={() => {
                  if (careerGoal.trim() !== "") {
                    toast.success("Career goal saved!");
                  }
                }}
              >
                Enter
              </button>
            </div>
          </div>
        )}

        {/* Final preview (index 8) */}
        {currentSpeechIndex === 8 && userHasProfile == false && (
          <div className="absolute w-full max-w-md top-1/2 left-1/2 transform -translate-x-1/4 -translate-y-1/2 translate-x-48">
            <div className="card w-full max-w-md bg-white shadow-lg rounded-xl overflow-hidden">
              <div className="card-body space-y-6">
                <div className="flex flex-col items-center text-center border-b border-gray-200 pb-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {userInfo?.firstName} {userInfo?.lastName}
                  </h1>
                  <p className="text-gray-600 mt-1">{selectedHeadline}</p>
                  <p className="text-gray-500 mt-2 text-sm">{university}</p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Key Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {userHasProfile && savedProfile ? Object.values(savedProfile?.keySkills).map((skill, index) => { //  Object.values(savedProfile.keySkills) converts the keySkills object into an array of its values
                      if (!skill) return null; // skip empty values
                      return (
                        <span key={index} className="badge badge-outline">
                          {skill}
                        </span>
                      );
                    }) : selectedSkills.map((skill, i) => (
                      <span key={i} className="badge badge-outline">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Career Goals</h2>
                  <p className="text-gray-600 text-sm">{careerGoal}</p>
                </div>
              </div>
            </div>
            {/* Save Profile button */}

            <button
              className="btn btn-white mt-8 align-right"
              onClick={saveProfile}
            >
              Save Profile
            </button>

          </div>
        )}
      </div>
    </div>
  );
}
