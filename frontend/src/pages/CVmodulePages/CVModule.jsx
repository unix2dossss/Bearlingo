// src/pages/CVModule/CVModule.jsx
import { React, useState, useEffect, useRef } from "react";
import TopNavbar from "../../components/TopNavbar";
import { Home, FileText, Users, Trophy, Book, Settings } from "lucide-react";
import CVSubtask1 from "./CVSubtask1";
import CVSubtask2 from "./CVSubtask2";
import CVSubtask3 from "./CVSubtask3";
import ConfirmLeaveDialog from "../../components/ConfirmLeaveDialog";
import { useUserStore } from "../../store/user";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import BackgroundMusicBox from "../../components/BackgroundMusicBox";
import SideNavbar from "../../components/SideNavbar";

// Assets
import Floor from "../../assets/CVFloor.svg";
import Window from "../../assets/CVWindow.svg";
import WindowLocked from "../../assets/CVWindowB.svg";
import Drawers from "../../assets/CVDrawers.svg";
import DrawersLocked from "../../assets/CVDrawersB.svg";
import Desk from "../../assets/CVDesk.svg";
import DeskLocked from "../../assets/CVDeskB.svg";
import Bookcase from "../../assets/CVBook.svg";
import BookcaseLocked from "../../assets/CVBookB.svg";
import Bear from "../../assets/Bear.svg";

// ⬇️ NEW: Resume uploader
import ResumeUpload from "../../components/CVModuleComponent/ResumeUpload";

/* THEME */
const COLORS = {
  primary: "#4f9cf9",
  primaryHover: "#3d86ea",
  textMuted: "#767687"
};

const CVModule = () => {
  const [showSubtask, setShowSubtask] = useState(false);
  const [selectedSubtask, setSelectedSubtask] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);
  const [task1Complete, setTask1Complete] = useState(false);
  const [task2Complete, setTask2Complete] = useState(false);
  const [task3Complete, setTask3Complete] = useState(false);

  // Landing intro modal (already existed)
  const [showLandingIntro, setShowLandingIntro] = useState(false);
  const [dontShowLandingAgain, setDontShowLandingAgain] = useState(false);

  // ⬇️ NEW: Resume modal state
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [dontShowResumeAgain, setDontShowResumeAgain] = useState(false);

  const navigate = useNavigate();
  // const currentUser = useUserStore.getState().user;
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        await useUserStore.getState().fetchUser();
      }
      const currentUser = useUserStore.getState().user;
      if (!currentUser) {
        navigate("/login");
      }
    };
    fetchUserData();
  }, [navigate, user]);

  // ⬇️ NEW: First-visit behavior → show ResumeUpload first; if skipped, show landing intro
  useEffect(() => {
    const skipResume = localStorage.getItem("cv_resume_prompt_skip") === "1";
    if (!skipResume) {
      // wait before showing resume modal
      const timer = setTimeout(() => {
        setShowResumeModal(true);
      }, 2500); // 2.5s delay

      return () => clearTimeout(timer);
    }
    const skipIntro = localStorage.getItem("cv_landing_intro_skip") === "1";
    if (!skipIntro) {setShowLandingIntro(true), 2500};
  }, []);

  // ⬇️ NEW: lock body scroll when any modal is open
  useEffect(() => {
    const anyModalOpen = showResumeModal || showLandingIntro || showSubtask || showConfirmLeave;
    const prev = document.body.style.overflow;
    document.body.style.overflow = anyModalOpen ? "hidden" : prev || "";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [showResumeModal, showLandingIntro, showSubtask, showConfirmLeave]);

  // Anim refs
  const windowLockedRef = useRef(null);
  const windowUnlockedRef = useRef(null);
  const drawersLockedRef = useRef(null);
  const drawersUnlockedRef = useRef(null);
  const bookcaseLockedRef = useRef(null);
  const bookcaseUnlockedRef = useRef(null);
  const deskLockedRef = useRef(null);
  const deskUnlockedRef = useRef(null);
  const bearRef = useRef(null);

  useEffect(() => {
    if (task1Complete) {
      gsap.to(windowLockedRef.current, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          gsap.set(windowUnlockedRef.current, {
            opacity: 0,
            scale: 0.5,
            rotation: -30,
            y: -300
          });
          gsap.to(windowUnlockedRef.current, {
            opacity: 1,
            scale: 1,
            rotation: 0,
            y: 0,
            duration: 1.5,
            ease: "bounce.out"
          });
        }
      });
    } else {
      gsap.set(windowUnlockedRef.current, { opacity: 0 });
      gsap.to(windowLockedRef.current, { opacity: 1, duration: 0.6, ease: "power2.out" });
    }
  }, [task1Complete]);

  useEffect(() => {
    if (task2Complete) {
      gsap.to(drawersLockedRef.current, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          gsap.set(drawersUnlockedRef.current, { opacity: 0, scale: 0.5, rotation: -30, y: -300 });
          gsap.to(drawersUnlockedRef.current, {
            opacity: 1,
            scale: 1,
            rotation: 0,
            y: 0,
            duration: 1.5,
            ease: "bounce.out"
          });
        }
      });
      gsap.to(bookcaseLockedRef.current, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          gsap.set(bookcaseUnlockedRef.current, { opacity: 0, scale: 0.5, rotation: 15, y: 300 });
          gsap.to(bookcaseUnlockedRef.current, {
            opacity: 1,
            scale: 1,
            rotation: 0,
            y: 0,
            duration: 1.5,
            ease: "elastic.out(1, 0.5)"
          });
        }
      });
    } else {
      gsap.set([drawersUnlockedRef.current, bookcaseUnlockedRef.current], { opacity: 0 });
      gsap.to([drawersLockedRef.current, bookcaseLockedRef.current], {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out"
      });
    }
  }, [task2Complete]);

  useEffect(() => {
    if (task3Complete) {
      gsap.to(deskLockedRef.current, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          gsap.set(deskUnlockedRef.current, { opacity: 0, scale: 0.5, rotation: -30, y: -300 });
          gsap.to(deskUnlockedRef.current, {
            opacity: 1,
            scale: 1,
            rotation: 0,
            y: 0,
            duration: 1.5,
            ease: "bounce.out"
          });
        }
      });
    } else {
      gsap.set(deskUnlockedRef.current, { opacity: 0 });
      gsap.to(deskLockedRef.current, { opacity: 1, duration: 0.6, ease: "power2.out" });
    }
  }, [task3Complete]);

  useEffect(() => {
    gsap.fromTo(
      bearRef.current,
      { y: 200 },
      { y: 0, duration: 1.5, ease: "bounce.out", delay: 0.5 }
    );
    gsap.fromTo(
      ".speech-bubble",
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)", delay: 1.2 }
    );
    gsap.to(bearRef.current, {
      y: -15,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 2
    });
  }, []);

  // Elevator doors
  const leftDoor = useRef(null);
  const rightDoor = useRef(null);

  // Animate elevator opening when CVModule loads
  useEffect(() => {
    gsap.set(leftDoor.current, { x: "0%" });
    gsap.set(rightDoor.current, { x: "0%" });

    gsap.to(leftDoor.current, {
      x: "-100%",
      duration: 1.5,
      ease: "power2.inOut",
      delay: 0.3
    });

    gsap.to(rightDoor.current, {
      x: "100%",
      duration: 1.5,
      ease: "power2.inOut",
      delay: 0.3
    });
  }, []);

  const handleSubtaskClick = (task) => {
    setSelectedSubtask(task);
    setShowSubtask(true);
  };

  const handleClose = (hasChanges, force = false) => {
    if (force) {
      setShowSubtask(false);
      setSelectedSubtask(null);
      return;
    }
    if (hasChanges) {
      setShowConfirmLeave(true);
    } else {
      setShowSubtask(false);
      setSelectedSubtask(null);
    }
  };

  const confirmLeave = () => {
    setShowConfirmLeave(false);
    setShowSubtask(false);
    setSelectedSubtask(null);
    setIsSubmitted(false);
  };

  const renderSubtask = () => {
    switch (selectedSubtask) {
      case "subtask1":
        return (
          <CVSubtask1
            task={selectedSubtask}
            isSubmitted={isSubmitted}
            setIsSubmitted={setIsSubmitted}
            onClose={handleClose}
            onTaskComplete={() => setTask1Complete(true)}
          />
        );
      case "subtask2":
        return (
          <CVSubtask2
            isSubmitted={isSubmitted}
            setIsSubmitted={setIsSubmitted}
            onClose={handleClose}
            onTaskComplete={() => setTask2Complete(true)}
          />
        );
      case "subtask3":
        return (
          <CVSubtask3
            onClose={handleClose}
            setIsSubmitted={setIsSubmitted}
            onTaskComplete={() => setTask3Complete(true)}
          />
        );
      default:
        return null;
    }
  };

  // ⬇️ NEW: close Resume modal & optionally show landing intro
  const closeLandingIntro = (startTaskKey = null) => {
    if (dontShowLandingAgain) localStorage.setItem("cv_landing_intro_skip", "1");
    setShowLandingIntro(false);
    if (startTaskKey) handleSubtaskClick(startTaskKey);
  };

  const closeResumeModal = (openIntroAfter = true) => {
    if (dontShowResumeAgain) localStorage.setItem("cv_resume_prompt_skip", "1");
    setShowResumeModal(false);

    if (openIntroAfter) {
      const skipIntro = localStorage.getItem("cv_landing_intro_skip") === "1";
      if (!skipIntro) setShowLandingIntro(true);
    }
  };

  // ⬇️ NEW: After successful upload → never show resume modal again
  const handleResumeUploaded = async () => {
    localStorage.setItem("cv_resume_prompt_skip", "1");
    setDontShowResumeAgain(true);
    setShowResumeModal(false);
    // If you want to show the landing intro after upload, uncomment:
    // setShowLandingIntro(true);
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Elevator Doors Overlay */}
      <div ref={leftDoor} className="absolute top-0 left-0 w-1/2 h-full bg-gray-400 z-50" />
      <div ref={rightDoor} className="absolute top-0 right-0 w-1/2 h-full bg-gray-500 z-50" />

      {/* Background */}
      <div className="flex-1 relative bg-cover bg-center bg-[#DBBBFB]">
        {/* Top Navbar */}
        <div className="relative z-[100]">
          <TopNavbar />
        </div>

        <div>
          <div>
            {/* Floating music control */}
            <div className="fixed top-20 right-6 z-30 pointer-events-auto">
              <BackgroundMusicBox />
            </div>

            {/* Purple Floor */}
            <img src={Floor} alt="Welcome" className="absolute bottom-0 left-0 w-full h-auto" />

            <div className="flex">
              <div className="mt-4 z-40">
                <SideNavbar />
              </div>

              <div className="relative w-full">
                {/* Subtask 3 Object: Desk */}
                <div className="relative w-full flex justify-center">
                  <img
                    ref={deskLockedRef}
                    src={DeskLocked}
                    alt="Locked CV Desk"
                    className="absolute top-[30vh] w-[30vw] max-w-[600px] h-auto z-30"
                    style={{ opacity: 0.4 }}

                  />
                  <img
                    ref={deskUnlockedRef}
                    src={Desk}
                    alt="Unlocked CV Desk"
                    className="absolute top-[30vh] w-[30vw] max-w-[600px] h-auto z-30"
                  />
                </div>

                {/* Subtask 2 Object: Drawer + Bookcase */}
                <div className="relative">
                  <img
                    ref={drawersLockedRef}
                    src={DrawersLocked}
                    alt="Locked CV Drawers"
                    className="absolute top-[20vh] right-0 w-[35vw] max-w-[800px] h-auto z-30 pointer-events-none"
                    style={{ opacity: 0.4 }}
                  />
                  <img
                    ref={drawersUnlockedRef}
                    src={Drawers}
                    alt="Unlocked CV Drawers"
                    className="absolute top-[20vh] right-0 w-[35vw] max-w-[900px] h-auto z-30 pointer-events-none"
                  />
                  <img
                    ref={bookcaseLockedRef}
                    src={BookcaseLocked}
                    alt="Locked CV Bookcase"
                    className="absolute top-[8vh] left-0 w-[35vw] max-w-[800px] h-auto z-30 transition-opacity duration-500"
                    style={{ opacity: 0.4 }}
                  />
                  <img
                    ref={bookcaseUnlockedRef}
                    src={Bookcase}
                    alt="Unlocked CV Bookcase"
                    className="absolute top-[8vh] left-0 w-[35vw] max-w-[800px] h-auto z-30"
                  />
                </div>

                {/* Subtask 1 Object: Windows */}
                <div className="relative">
                  <img
                    ref={windowLockedRef}
                    src={WindowLocked}
                    alt="Locked CV Window"
                    className="absolute left-1/2 -translate-x-1/2 w-[1000px] z-20"
                    style={{ opacity: 0.4 }}
                  />
                  <img
                    ref={windowUnlockedRef}
                    src={Window}
                    alt="Unlocked CV Window"
                    className="absolute left-1/2 -translate-x-1/2 w-[1000px] z-20"
                  />
                </div>

              </div>
            </div>
          </div>

          {/* Bottom Button Container */}
          <div className="w-full bg-white shadow-md p-4 fixed bottom-10 left-0 flex justify-center z-40">
            <div className="flex space-x-6">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition"
                onClick={() => handleSubtaskClick("subtask1")}
              >
                Task 1
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition"
                onClick={() => handleSubtaskClick("subtask2")}
              >
                Task 2
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition"
                onClick={() => handleSubtaskClick("subtask3")}
              >
                Task 3
              </button>

              {/* Bear + Speech Bubble */}
              <div className="absolute -bottom-[28vh] left-16 flex flex-col items-start z-40">
                <div className="speech-bubble relative bg-white text-black font-semibold px-4 py-2 rounded-xl shadow-md mb-2 text-lg sm:text-xl md:text-xl">
                  Time to build our CV!
                  <div className="absolute -bottom-2 left- w-4 h-4 bg-white rotate-45 shadow-md" />
                </div>
                <img
                  ref={bearRef}
                  src={Bear}
                  alt="Bear peeking"
                  className="w-[25vw] max-w-[300px] sm:w-[20vw] sm:max-w-[250px] md:w-[18vw] md:max-w-[240px]"
                />
              </div>
            </div>
          </div>

          {/* ⬇️ NEW: Resume Upload Landing Modal */}
          {showResumeModal && (
            <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50">
              <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl relative">
                {/* Close X */}
                <button
                  onClick={() => closeResumeModal(true)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 text-xl"
                  aria-label="Close"
                >
                  ✖
                </button>

                {/* Header */}
                <div className="px-6 pt-6">
                  <h3 className="text-2xl font-extrabold mb-1" style={{ color: COLORS.primary }}>
                    Quick step: Upload your resume
                  </h3>
                  <p className="text-sm font-semibold" style={{ color: COLORS.textMuted }}>
                    This helps us personalize your CV building experience.
                  </p>
                </div>

                {/* ResumeUpload component */}
                <div className="pb-2">
                  <ResumeUpload
                    // If you want to hit your default API routes, no props are needed.
                    // Provide onUpload to mark the modal as done after a successful upload:
                    onUpload={handleResumeUploaded}
                  />
                </div>

                {/* Footer: Don't show again / Skip */}
                <div className="px-6 pb-6 -mt-2 flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-gray-600 select-none">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={dontShowResumeAgain}
                      onChange={(e) => setDontShowResumeAgain(e.target.checked)}
                    />
                    Don’t show this again
                  </label>

                  <div className="flex gap-2">
                    <button
                      onClick={() => closeResumeModal(true)}
                      className="h-10 px-5 rounded-full border-2 font-bold text-sm bg-white hover:bg-[#4f9cf9]/5"
                      style={{ borderColor: COLORS.primary, color: COLORS.primary }}
                    >
                      Skip for now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Landing Intro Modal (your existing one) */}
          {showLandingIntro && (
            <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50">
              <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
                {/* Close X */}
                <button
                  onClick={() => closeLandingIntro()}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 text-xl"
                  aria-label="Close"
                >
                  ✖
                </button>

                <h3 className="text-2xl font-extrabold mb-1" style={{ color: COLORS.primary }}>
                  Welcome to the CV Builder
                </h3>
                <p className="text-sm font-semibold" style={{ color: COLORS.textMuted }}>
                  Quick heads-up before you start
                </p>

                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 my-4">
                  <li>There are 3 tasks: Skills, Projects, and Review.</li>
                  <li>You can save and come back anytime.</li>
                  <li>We’ll guide you step-by-step and auto-validate fields.</li>
                </ul>

                <label className="flex items-center gap-2 text-sm text-gray-600 mb-4 select-none">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={dontShowLandingAgain}
                    onChange={(e) => setDontShowLandingAgain(e.target.checked)}
                  />
                  Don’t show this again
                </label>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => closeLandingIntro()}
                    className="h-10 px-5 rounded-full border-2 font-bold text-sm bg-white hover:bg-[#4f9cf9]/5"
                    style={{ borderColor: COLORS.primary, color: COLORS.primary }}
                  >
                    Explore
                  </button>
                  <button
                    onClick={() => closeLandingIntro("subtask1")}
                    className="h-10 px-5 rounded-full font-bold text-sm text-white"
                    style={{ backgroundColor: COLORS.primary }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = COLORS.primaryHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = COLORS.primary)}
                  >
                    Start Task 1
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Subtask Modal */}
          {showSubtask && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl relative h-[700px] flex flex-col border-4 border-[#4f9cf9]">
                <div className="overflow-y-auto pr-2">{renderSubtask()}</div>
              </div>
            </div>
          )}

          {/* Confirm Leave */}
          {showConfirmLeave && (
            <ConfirmLeaveDialog
              isOpen={showConfirmLeave}
              title="Your changes will be lost!"
              message="Please finish the task to save the changes."
              onConfirm={confirmLeave}
              onCancel={() => setShowConfirmLeave(false)}
            />
          )}

        </div>

      </div>
    </div>
  );
};

export default CVModule;
