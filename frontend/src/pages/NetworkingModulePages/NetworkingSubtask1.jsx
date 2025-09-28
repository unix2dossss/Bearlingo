import React, { useEffect, useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { gsap } from "gsap";
import toast from "react-hot-toast";
import Bear from "../../assets/Bear.svg";
import api from "../../lib/axios";

export default function NetworkingSubtask1({ userInfo = {}, onBack }) {
  const [currentSpeechIndex, setCurrentSpeechIndex] = useState(0);
  const [animationDone, setAnimationDone] = useState(false);

  const [selectedHeadline, setSelectedHeadline] = useState("");
  const [customHeadline, setCustomHeadline] = useState("");
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
      if (profileExists.status == 200 && profileExists.message == "Linked In Profile Retrieved Succesfully! ") {
        setUserHasProfile(true);
        setSavedProfile(profileExists.data.linkedInProfile);
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


  // Run once when component mounts
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
      await api.put(
        "/users/me/networking/linkedin-profile",
        {
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          profressionalHeadline: selectedHeadline,
          keySkills: keySkills,
          objective: careerGoal
        },
        { withCredentials: true });
      setUserHasProfile(true);
      toast.success("Profile saved!");

    } catch (error) {
      console.log("Error in saving profile to database: ", error);
      toast.error("Error in saving profile to database");
    }
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
      <div className="flex flex-1 ">
        <div className="mt-20 relative">

          {animationDone && userHasProfile == true && (
            <div
              key={currentSpeechIndex}
              className="chat chat-start opacity-0 translate-y-4 bear-speech flex justify-center"
            >
              <div className="chat-bubble">
                Hi {userInfo?.username || "there"}! 👋. Take a look at your LinkedIn profile!
              </div>
            </div>
          )}


          {animationDone && userHasProfile == false && (
            <div
              key={currentSpeechIndex}
              className="chat chat-start opacity-0 translate-y-4 bear-speech flex justify-center"
            >
              <div className="chat-bubble">
                {currentSpeechIndex === 0
                  ? `Hi ${userInfo?.username || "there"}! 👋`
                  : speechForSubtask1[currentSpeechIndex]}
              </div>
            </div>
          )}

          {/* Next button */}
          {animationDone && userHasProfile == false && currentSpeechIndex < speechForSubtask1.length - 1 && (
            <button
              className="absolute bottom-4 left-96 transform -translate-x-1/2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-lg"
              onClick={handleNext}
            >
              Next
            </button>
          )}

          <img className="bear h-[600px] w-[600px]" src={Bear} alt="Bear Mascot" />
        </div>
      </div>

      {/* Right: Dynamic Panels */}
      <div className="flex-1">
        {/* Example card preview (index 2) */}
        {currentSpeechIndex === 2 && (
          <div className="flex justify-center mt-32">
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
        {currentSpeechIndex === 4 && userHasProfile == false && (
          <div className="flex flex-col items-center justify-center gap-6 mt-[30%] h-[40%]">
            <select
              value={selectedHeadline}
              onChange={(e) => setSelectedHeadline(e.target.value)}
              className="select w-[70%]"
            >
              <option disabled value="">
                Pick a headline
              </option>
              <option>Aspiring Software Engineer | Computer Science Student</option>
              <option>Computer Science Undergraduate | Passionate About AI & Machine Learning</option>
              <option>Future Full-Stack Developer | Tech Enthusiast</option>
              <option>CS Student | Exploring Cloud Computing & DevOps</option>
              <option>Software Developer in Training | Problem Solver & Innovator</option>
              <option>Tech Student | Building Projects in Web & Mobile Development</option>
              <option>Computer Science Enthusiast | Passionate About Data Science</option>
              <option>CS Student | Interested in Cybersecurity & Ethical Hacking</option>
            </select>

            <div className="flex flex-row gap-1 w-[70%]">
              <input
                type="text"
                placeholder="Enter headline here"
                className="input flex-1"
                value={customHeadline}
                onChange={(e) => setCustomHeadline(e.target.value)}
              />
              <button
                className="btn"
                onClick={() => {
                  if (customHeadline.trim() !== "") {
                    setSelectedHeadline(customHeadline);
                    setCustomHeadline("");
                    toast.success("Headline saved!");
                  }
                }}
              >
                Enter
              </button>
            </div>
          </div>
        )}

        {/* University (index 5) */}
        {currentSpeechIndex === 5 && userHasProfile == false && (
          <div className="flex justify-center mt-[50%]">
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
        {currentSpeechIndex === 6 && userHasProfile == false && (
          <div className="flex flex-col items-center gap-2 mt-[40%]">
            <label className="font-semibold">Select Your Skills</label>
            <select
              multiple
              size={10}
              className="select p-2 w-[70%] text-lg"
              value={selectedSkills}
              onChange={handleSkillChange}
            >
              {allSkills.map((skill, i) => (
                <option key={i} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
            <p className="mt-2">Selected Skills: {selectedSkills.join(", ")}</p>
            <button className="btn" onClick={() => toast.success("Skills saved!")}>
              Submit
            </button>
          </div>
        )}

        {/* Career goal (index 7) */}
        {currentSpeechIndex === 7 && userHasProfile == false && (
          <div className="mt-[50%]">
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
        {(currentSpeechIndex === 8 || userHasProfile) == true && (
          <div className="flex flex-col items-center mt-32">
            <div className="card w-full max-w-md bg-white shadow-lg rounded-xl overflow-hidden">
              <div className="card-body space-y-6">
                <div className="flex flex-col items-center text-center border-b border-gray-200 pb-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {userInfo?.firstName} {userInfo?.lastName}
                  </h1>
                  <p className="text-gray-600 mt-1">{userHasProfile ? savedProfile.headline : selectedHeadline}</p>
                  <p className="text-gray-500 mt-2 text-sm">{university}</p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Key Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {userHasProfile ? Object.values(savedProfile.keySkills).map((skill, index) => { //  Object.values(savedProfile.keySkills) converts the keySkills object into an array of its values
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
                  <p className="text-gray-600 text-sm"> {userHasProfile ? savedProfile.objective : careerGoal}</p>
                </div>
              </div>
            </div>
            {/* Save Profile button */}
            {userHasProfile == false &&
              <button
                className="btn btn-primary mt-4"
                onClick={saveProfile}
              >
                Save Profile
              </button>
            }

          </div>
        )}
      </div>
    </div>
  );
}
