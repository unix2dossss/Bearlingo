import React, { useEffect, useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { gsap } from "gsap";
import toast from "react-hot-toast";
import Bear from "../../assets/NetworkBear.svg";
import api from "../../lib/axios";
import { useUserStore } from "../../store/user";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { getSubtaskBySequenceNumber } from "../../utils/moduleHelpers";
import Floor from "../../assets/NFloor.svg";
// ATTRIBUTE - <a href="https://www.flaticon.com/free-icons/linkedin" title="linkedin icons">Linkedin icons created by riajulislam - Flaticon</a>

//Import Components
import SkillList from "../../components/NetworkingModuleComponents/NetworkingSubtask1/SkillList";
import Headline from "../../components/NetworkingModuleComponents/NetworkingSubtask1/HeadLine";


const COLORS = {
  primary: "#4f9cf9",
  primaryHover: "#3d86ea",
  textMuted: "#767687",
};

export default function NetworkingSubtask1({ userInfo = {}, onBack, onTaskComplete }) {
  const [currentSpeechIndex, setCurrentSpeechIndex] = useState(0);
  const [animationDone, setAnimationDone] = useState(false);

  const [selectedHeadline, setSelectedHeadline] = useState("");
  //const [customHeadline, setCustomHeadline] = useState("");
  const [university, setUniversity] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [careerGoal, setCareerGoal] = useState("");
  const [userHasProfile, setUserHasProfile] = useState(false);
  const [savedProfile, setSavedProfile] = useState("");
  const [nextButtonValid, _] = useState(true);
  const { completeTask } = useUserStore();
  const [isSaving, setIsSaving] = useState(false);


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

  const EXAMPLES = [
    {
      id: 1,
      title: "Internship",
      text: "Motivated Computer Science student with strong foundations in algorithms, web development, and databases, seeking an internship to apply problem-solving skills in real-world projects and contribute to a collaborative engineering team.",
    },
    {
      id: 2,
      title: "Graduate role",
      text: "Recent Software Engineering student eager to begin a career as a Software Developer. Passionate about building scalable web applications, learning new technologies, and contributing to innovative solutions in a fast-paced environment.",
    },
    {
      id: 3,
      title: "General tech",
      text: "Aspiring software engineer with a strong academic background in computer science and practical experience through projects. Interested in developing user-friendly, reliable, and efficient software that creates real-world impact.",
    },
    {
      id: 4,
      title: "Teamwork & adaptability",
      text: "Enthusiastic Computer Science student with hands-on experience in team-based software projects. Skilled in Java, React, and databases, and eager to contribute to collaborative problem-solving in dynamic tech environments.",
    },
    {
      id: 5,
      title: "Research / AI",
      text: "Computer Science student passionate about artificial intelligence and data science. Looking to contribute research-driven and innovative solutions while expanding technical expertise in machine learning and big data systems.",
    },
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
        onTaskComplete?.();   // mark completed in parent
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
    let valid = true;

    if (currentSpeechIndex === 4 && selectedHeadline.trim() === "") {
      toast.error("Please choose or type a headline!");
      valid = false;
    }

    if (currentSpeechIndex === 5 && university.trim() === "") {
      toast.error("Please enter your university!");
      valid = false;
    }

    if (currentSpeechIndex === 6 && selectedSkills.length === 0) {
      toast.error("Please select at least one skill!");
      valid = false;
    }

    if (currentSpeechIndex === 7 && careerGoal.trim() === "") {
      toast.error("Please enter your career goal!");
      valid = false;
    }

    if (valid && currentSpeechIndex < speechForSubtask1.length - 1) {
      setCurrentSpeechIndex((i) => i + 1);
    }
  };

  const handleBack = () => {
    setCurrentSpeechIndex((i) => i - 1);
  }


  // const handleSkillChange = (e) => {
  //   const value = Array.from(e.target.selectedOptions, (o) => o.value);
  //   setSelectedSkills(value);
  // };

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
          university: university,
          keySkills: keySkills,
          objective: careerGoal
        },
        { withCredentials: true });
      setSavedProfile(profile.data.linkedInProfile);
      console.log("profile.data.linkedInProfile: ", profile.data.linkedInProfile);
      setUserHasProfile(true);

      toast.success("Profile saved!");
      onTaskComplete?.();      // parent sets completed.subtask1 = true
      onBack?.(false, true);   // hasChanges=false, force=true (close without popup)

      // Get subtaskId by module name, level number and subtask sequence number
      let subtaskId;
      try {
        subtaskId = await getSubtaskBySequenceNumber("Networking Hub", 1, 1);
      } catch (err) {
        console.error("Failed to get subtask ID", err);
        toast.error("Could not find subtask");
        return;
      }

      try {
        const done = await completeTask(subtaskId);
        if (done?.data?.message === "Well Done! You completed the subtask") {
          toast.success("Task 1 completed!");
          onTaskComplete?.();    // mark completed
          onBack?.(false, true);
        }
      } catch (err) {
        console.error("Failed to complete task", err);
        toast.error("Could not mark task complete");
      }

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


  // Sound Effects
  // Button Click
  const playClickSound = () => {
    const audio = new Audio("/sounds/mouse-click-290204.mp3");
    audio.currentTime = 0; // rewind to start for rapid clicks
    audio.play();
  };

  return (
    <div className='pt-16 bg-[#fff9c7] relative min-h-screen flex flex-row min-w-0 gap-4 p-4' >
      {/* Go back */}
      < button
        className="btn btn-ghost absolute top-20 left-6 z-10"
        onClick={onBack}
      >
        <ArrowLeftIcon className="size-5" />
        Back to subtasks
      </button >

      {/* Yellow Floor */}
      <img src={Floor} alt="Welcome" className="absolute bottom-0 left-0 w-full h-auto" />


      {/* Left: Bear + Speech */}
      < div className="flex flex-1 items-center justify-center" >
        <div className="relative w-full max-w-[700px] aspect-square">
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

          <div>

            {/* Next & back buttons */}
            <div>
              {animationDone && userHasProfile === false && (
                <div className="absolute -bottom-0 left-1/2 -translate-x-1/2 flex gap-4">
                  {/* Back button */}
                  {currentSpeechIndex > 0 && (
                    <button
                      className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 shadow-lg"
                      onClick={() => {
                        playClickSound();
                        handleBack();
                      }}
                    >
                      Back
                    </button>
                  )}

                  {/* Next button */}
                  {userHasProfile === false &&
                    currentSpeechIndex < speechForSubtask1.length - 1 && (
                      <button
                        className={`px-6 py-2 rounded-lg shadow-lg text-white
              ${nextButtonValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                        onClick={() => {
                          playClickSound();
                          handleNext();
                        }}
                        disabled={!nextButtonValid}
                      >
                        Next
                      </button>
                    )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div >



      {/* Right: Dynamic Panels */}
      < div className="flex-1" >

        {userHasProfile == true && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/4 -translate-y-1/2 translate-x-48">
            <div className="card w-full max-w-md bg-white shadow-lg rounded-xl overflow-hidden">
              <div className="card-body space-y-6">
                <div className="flex flex-col items-center text-center border-b border-gray-200 pb-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {userInfo?.firstName} {userInfo?.lastName}
                  </h1>
                  <p className="text-gray-600 mt-1">{savedProfile.profressionalHeadline}</p>
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
        )
        }

        {/* Example card preview (index 2) */}
        {
          currentSpeechIndex === 2 && (
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
          )
        }

        {/* Lottie animation */}
        {
          currentSpeechIndex === 3 && !userHasProfile && (
            <div className="absolute top-1/2 right-40 transform -translate-y-1/2
      w-[400px] h-[400px]  /* bigger */
      flex items-center justify-center
      rounded-full
      "
              style={{ marginRight: "5%" }} /* moves it slightly left from the edge */
            >
              <DotLottieReact
                src="/achievement-animation.lottie"
                loop
                autoplay
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          )
        }

        {/* Headline pick (index 4) */}
        {
          currentSpeechIndex === 4 && !userHasProfile && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/4 -translate-y-1/4 translate-x-48">
              {/* Headline component */}
              <Headline
                value={selectedHeadline}
                onChange={setSelectedHeadline} // 👈 dropdown OR custom input will update this
                className="w-[350px]"
              />
            </div>
          )
        }


        {
          currentSpeechIndex === 5 && !userHasProfile && (
            <div className="absolute top-1/2 left-[85%] transform -translate-x-1/2 -translate-y-1/2 
                  flex flex-row items-center gap-12 w-full max-w-4xl px-4">

              <div className="flex flex-col items-center gap-6 w-full max-w-md">
                <DotLottieReact
                  src="/university.lottie"
                  loop
                  autoplay
                  style={{ width: "100%", height: "250px", maxHeight: "40vh" }}
                />

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-5 shadow-md flex flex-col gap-4 w-full">
                  {/* Header */}
                  <h3 className="text-purple-700 font-semibold text-lg">
                    🎓 Enter Your University
                  </h3>

                  {/* Input and Button */}
                  <div className="flex w-full gap-3">
                    <input
                      type="text"
                      placeholder="Type your university name..."
                      className="flex-1 px-4 py-2 text-gray-700 bg-white border border-purple-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                    />
                    <button
                      className="px-6 py-2 text-sm font-semibold text-white bg-purple-500 hover:bg-purple-600 rounded-lg shadow-sm transition active:scale-95"
                      onClick={() => {
                        playClickSound();
                        if (university.trim() !== "") toast.success("University saved!");
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )
        }


        {/* Skills (index 6) */}
        {
          currentSpeechIndex === 6 && userHasProfile === false && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 translate-x-24 w-[min(92vw,600px)]">
              <SkillList
                allSkills={allSkills}
                selectedSkills={selectedSkills}
                toggleSkill={toggleSkill}
                maxSkills={MAX_SKILLS}
              />
            </div>
          )
        }

        {/* Career goal (index 7) */}
        {
          currentSpeechIndex === 7 && !userHasProfile && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 translate-x-24 w-[min(92vw,600px)]">
              <div className="relative p-6 rounded-2xl shadow-2xl bg-indigo-100/80">
                {/* Animated border overlay */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 animate-gradient-x blur-lg opacity-50"></div>

                {/* Content */}
                <div className="relative z-10 bg-indigo-50/90 rounded-2xl border border-indigo-300 p-6">
                  <h3 className="text-2xl font-bold text-indigo-900">
                    Career Objective Examples
                  </h3>
                  <p className="mt-1 text-sm text-indigo-700">
                    Useful templates for CVs, LinkedIn, or applications.
                  </p>

                  {/* Scrollable container */}
                  <div className="mt-6 max-h-64 overflow-y-auto pr-2 bg-indigo-100/70 border border-indigo-200 rounded-xl p-3 scrollbar-thin scrollbar-thumb-pink-400 scrollbar-track-indigo-200/40">
                    <div className="space-y-4">
                      {EXAMPLES.map((ex) => (
                        <article
                          key={ex.id}
                          className="bg-indigo-50/80 border border-indigo-300 rounded-xl p-4 shadow hover:shadow-lg hover:border-pink-400 transition-all duration-300"
                        >
                          <h4 className="text-sm font-semibold text-indigo-900">
                            {ex.title}
                          </h4>
                          <p className="mt-2 text-sm text-indigo-700 leading-relaxed">
                            {ex.text}
                          </p>
                        </article>
                      ))}
                    </div>
                  </div>

                  {/* Input Section */}
                  <div className="flex flex-row gap-2 mt-6">
                    <input
                      type="text"
                      placeholder="Enter career goal here"
                      className="flex-1 px-4 py-2 rounded-xl bg-indigo-50/80 text-indigo-900 placeholder-indigo-500 border-2 border-indigo-300 focus:border-pink-400 focus:ring-1 focus:ring-pink-300 transition-colors duration-300 outline-none"
                      value={careerGoal}
                      onChange={(e) => setCareerGoal(e.target.value)}
                    />
                    <button
                      className="btn bg-pink-400 hover:bg-pink-500 text-white border-none rounded-xl px-4"
                      onClick={() => {
                        playClickSound();
                        if (careerGoal.trim() !== "") {
                          toast.success("Career goal saved!");
                        }
                      }}
                    >
                      Enter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        }

        {/* Final preview (index 8) */}
        {
          currentSpeechIndex === 8 && userHasProfile == false && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/4 -translate-y-1/2 translate-x-48">
              <div className="card w-full max-w-md bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="card-body space-y-6">
                  <div className="flex flex-col items-center text-center border-b border-gray-200 pb-4">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {userInfo?.firstName} {userInfo?.lastName}
                    </h1>
                    <p className="text-gray-600 mt-1">{selectedHeadline}</p>
                    <p className="text-gray-500 mt-2 text-sm">{university}</p>

                    {console.log("university: ", university)}

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
                onClick={() => {
                  playClickSound();
                  saveProfile();
                }}
              >
                Save Profile
              </button>

            </div>
          )
        }
      </div >
    </div >
  );
}
