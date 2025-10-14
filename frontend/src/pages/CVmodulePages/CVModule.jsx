// src/pages/CVModule/CVModule.jsx
import { React, useState, useEffect, useRef } from "react";
import TopNavbar from "../../components/TopNavbar";
import { Home, FileText, Users, Trophy, Book, Settings, Music } from "lucide-react";
import CVSubtask1 from "./CVSubtask1";
import CVSubtask2 from "./CVSubtask2";
import CVSubtask3 from "./CVSubtask3";
import ConfirmLeaveDialog from "../../components/ConfirmLeaveDialog";
import { useUserStore } from "../../store/user";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import BackgroundMusicBox from "../../components/BackgroundMusicBox";
import SideNavbar from "../../components/SideNavbar";
import {
  getModuleByName,
  getLevelByNumber,
  getSubtasksByLevel,
  isSubtaskCompleted
} from "../../utils/moduleHelpers";

import { Info } from "lucide-react";
import SubtaskInfoPopup from "../../components/SubtaskInfoPopup";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

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

// Sound
import winSound from "/sounds/winner-game-sound-404167.mp3";

// Level Passed Pop up
import CongratsPage from "./CVLevelPass";

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

  // Check if subtasks are already completed before
  useEffect(() => {
    const fetchTaskCompletion = async () => {
      try {
        const task1Done = await isSubtaskCompleted("CV Builder", 1, 1);
        const task2Done = await isSubtaskCompleted("CV Builder", 1, 2);
        const task3Done = await isSubtaskCompleted("CV Builder", 1, 3);

        setTask1Complete(task1Done);
        setTask2Complete(task2Done);
        setTask3Complete(task3Done);
      } catch (err) {
        console.error("Failed to fetch CV task completion:", err);
      }
    };

    fetchTaskCompletion();
  }, [setTask1Complete, setTask2Complete, setTask3Complete]);

  // 🧠 Bear logic
  const [bearMessage, setBearMessage] = useState("Time to build our CV!");

  // Change bear message based on progress
  useEffect(() => {
    if (task1Complete && !task2Complete && !task3Complete) {
      setBearMessage("Nice! One step done! 🏆");
    } else if (task1Complete && task2Complete && !task3Complete) {
      setBearMessage("Almost there — keep going! 💪");
    } else if (task1Complete && task2Complete && task3Complete) {
      setBearMessage("You did it! CV ready! 🎉");
    } else {
      setBearMessage("Time to build our CV!");
    }
  }, [task1Complete, task2Complete, task3Complete]);

  // Animate bear each time message changes
  useEffect(() => {
    gsap.fromTo(
      bearRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }
    );
  }, [bearMessage]);

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

  // // ⬇️ NEW: First-visit behavior → show ResumeUpload first; if skipped, show landing intro
  useEffect(() => {
    // const skipResume = localStorage.getItem("cv_resume_prompt_skip") === "1";
    // if (!skipResume) {
    //   // wait before showing resume modal
    //   const timer = setTimeout(() => {
    //     setShowResumeModal(true);
    //   }, 2500); // 2.5s delay

    //   return () => clearTimeout(timer);
    // }
    const skipIntro = localStorage.getItem("cv_landing_intro_skip") === "1";
    if (!skipIntro) {
      setShowLandingIntro(true), 2500;
    }
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

  // Track victory sound
  const prevTask1 = useRef(false);
  const prevTask2 = useRef(false);
  const prevTask3 = useRef(false);

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
      // When still locked
      gsap.set(windowUnlockedRef.current, { opacity: 0 });
      gsap.to(windowLockedRef.current, {
        opacity: 0.8,
        duration: 0.6,
        ease: "power2.out"
      });
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
            ease: "bounce.out"
          });
        }
      });
    } else {
      gsap.set([drawersUnlockedRef.current, bookcaseUnlockedRef.current], { opacity: 0 });
      gsap.to([drawersLockedRef.current, bookcaseLockedRef.current], {
        opacity: 0.8,
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
      gsap.to(deskLockedRef.current, {
        opacity: 0.8,
        duration: 0.6,
        ease: "power2.out"
      });
    }
  }, [task3Complete]);

  //Bear moving up and down
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
            setTask1Complete={setTask1Complete}
            setTask2Complete={setTask2Complete}
            setTask3Complete={setTask3Complete}
            user={user}
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

  // Related to subtaskIntro popup
  const [hoveredSubtask, setHoveredSubtask] = useState(null);

  const handleMouseEnter = async (taskNumber) => {
    try {
      const module = await getModuleByName("CV Builder");
      const level = getLevelByNumber(module, 1);
      const subtasks = await getSubtasksByLevel(level);
      const subtask = subtasks.find((st) => st.sequenceNumber === taskNumber);
      setHoveredSubtask(subtask); // set the hovered subtask info
    } catch (err) {
      console.error("Failed to fetch subtask info:", err);
    }
  };

  const handleMouseLeave = () => setHoveredSubtask(null);

  // Hide popup when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (hoveredSubtask) setHoveredSubtask(null);
    };

    // Add event listener only when popup is visible
    if (hoveredSubtask) {
      document.addEventListener("click", handleClickOutside);
    }

    // Cleanup
    return () => document.removeEventListener("click", handleClickOutside);
  }, [hoveredSubtask]);

  const [showLottie, setShowLottie] = useState(false);
  const [showCongratsPage, setShowCongratsPage] = useState(false);
  const popupRef = useRef(null);

  // Create a user-specific key for localStorage
  const moduleName = "cv";
  const confettiKey = `hasPlayedConfetti_${moduleName}_${user?.id || user?.email || "guest"}`;

  // Show confetti only once per user
  useEffect(() => {
    const hasPlayedConfetti = localStorage.getItem(confettiKey);

    if (task1Complete && task2Complete && task3Complete && !hasPlayedConfetti) {
      setShowLottie(true);
      localStorage.setItem(confettiKey, "true"); // store per-user flag
    }
  }, [task1Complete, task2Complete, task3Complete, confettiKey]);

  // After Lottie finishes, show popup
  const handleLottieComplete = () => {
    console.log("🎉 Lottie finished, showing popup!");
    setShowLottie(false);
    setShowCongratsPage(true);
  };

  // Timeout fallback (in case onComplete doesn’t fire)
  useEffect(() => {
    if (showLottie) {
      const timer = setTimeout(() => handleLottieComplete(), 4000); // adjust to match your Lottie duration
      return () => clearTimeout(timer);
    }
  }, [showLottie]);

  // Animate popup
  useEffect(() => {
    if (showCongratsPage && popupRef.current) {
      const popup = popupRef.current.querySelector("#popup-card");

      // Animate backdrop fade-in
      gsap.fromTo(
        popupRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: "power2.out" }
      );

      // Animate popup scale and fade
      gsap.fromTo(
        popup,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.9, ease: "back.out(1.8)", delay: 0.1 }
      );
    }
  }, [showCongratsPage]);

  // BackgroundMusicBox visibility state
  const [showMusicBox, setShowMusicBox] = useState(false);

  // Sound Effects
  // Button Click
  const playClickSound = () => {
    const audio = new Audio("/sounds/mouse-click-290204.mp3");
    audio.currentTime = 0; // rewind to start for rapid clicks
    audio.play();
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Elevator Doors Overlay */}
      <div ref={leftDoor} className="absolute top-0 left-0 w-1/2 h-full bg-gray-400 z-50" />
      <div ref={rightDoor} className="absolute top-0 right-0 w-1/2 h-full bg-gray-500 z-50" />

      {/* 🎊 Lottie Confetti */}
      {showLottie && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-transparent">
          <DotLottieReact
            src="https://lottie.host/1099ed2e-a10f-41d3-9eb8-69559ac869bf/PyIymGiJIa.lottie"
            autoplay
            loop={false}
            onComplete={handleLottieComplete}
            style={{
              width: "100vw",
              height: "100vh",
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "none", // so user can still click underlying buttons
              zIndex: 9999
            }}
          />
        </div>
      )}

      {/* 🏆 Congrats Popup */}
      {showCongratsPage && (
        <div
          ref={popupRef}
          className="fixed inset-0 z-[10000] flex items-center justify-center 
                    bg-black/30 backdrop-blur-sm transition-opacity duration-700 ease-out"
        >
          <div
            id="popup-card"
            className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-[90%] 
                      transform scale-90 opacity-0 transition-all duration-700 ease-out"
          >
            <CongratsPage onClose={() => setShowCongratsPage(false)} />
          </div>
        </div>
      )}

      {/* Background */}
      <div className="flex-1 relative bg-cover bg-center bg-[#DBBBFB]">
        {/* Top Navbar */}
        <div className="relative z-[100]">
          <TopNavbar
            showMusicBox={showMusicBox}
            onToggleMusicBox={() => setShowMusicBox(!showMusicBox)}
          />
        </div>

        <div>
          <div>
            {/* Floating music control */}
            {/* Music Toggle Button */}
            {/* <button
              onClick={() => setShowMusicBox(!showMusicBox)}
              className="fixed top-24 right-6 z-50 bg-white rounded-full p-3 shadow-md hover:bg-blue-100 transition"
              aria-label="Toggle music player"
            >
              <Music className={`w-6 h-6 ${showMusicBox ? "text-blue-500" : "text-gray-600"}`} />
            </button> */}

            {/* Conditionally show music box */}
            {showMusicBox && <BackgroundMusicBox />}

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
                    className="absolute top-[34vh] w-[30vw] max-w-[600px] h-auto z-30"
                  />
                  <img
                    ref={deskUnlockedRef}
                    src={Desk}
                    alt="Unlocked CV Desk"
                    className="absolute top-[34vh] w-[30vw] max-w-[600px] h-auto z-30"
                  />
                </div>

                {/* Subtask 2 Object: Drawer + Bookcase */}
                <div className="relative">
                  <img
                    ref={drawersLockedRef}
                    src={DrawersLocked}
                    alt="Locked CV Drawers"
                    className="absolute top-[20vh] right-0 w-[35vw] max-w-[800px] h-auto z-20 pointer-events-none "
                  />
                  <img
                    ref={drawersUnlockedRef}
                    src={Drawers}
                    alt="Unlocked CV Drawers"
                    className="absolute top-[20vh] right-0 w-[35vw] max-w-[900px] h-auto z-20 pointer-events-none"
                  />
                  <img
                    ref={bookcaseLockedRef}
                    src={BookcaseLocked}
                    alt="Locked CV Bookcase"
                    className="absolute top-[10vh] left-0 w-[35vw] max-w-[800px] h-auto z-20 transition-opacity duration-500"
                  />
                  <img
                    ref={bookcaseUnlockedRef}
                    src={Bookcase}
                    alt="Unlocked CV Bookcase"
                    className="absolute top-[10vh] left-0 w-[35vw] max-w-[800px] h-auto z-20"
                  />
                </div>

                {/* Subtask 1 Object: Windows */}
                <div className="relative">
                  <img
                    ref={windowLockedRef}
                    src={WindowLocked}
                    alt="Locked CV Window"
                    className="absolute left-1/2 -translate-x-1/2 w-[1000px] z-10"
                    style={{ opacity: 0.4 }}
                  />
                  <img
                    ref={windowUnlockedRef}
                    src={Window}
                    alt="Unlocked CV Window"
                    className="absolute left-1/2 -translate-x-1/2 w-[1000px] z-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Button Container */}
          <div className="w-full bg-white shadow-md p-4 fixed bottom-10 left-0 flex justify-center z-40">
            <div className="flex space-x-6">
              <div className="flex space-x-6 relative">
                <button
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition"
                  onClick={() => {
                    playClickSound();
                    handleSubtaskClick("subtask1");
                  }}
                >
                  Task 1
                  <Info
                    className="w-5 h-5 cursor-pointer text-white hover:text-yellow-300"
                    onMouseEnter={() => handleMouseEnter(1)}
                    onMouseLeave={handleMouseLeave}
                  />
                </button>
                <button
                  disabled={!task1Complete}
                  className={`flex items-center gap-2 font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition 
                ${
                  task1Complete
                    ? "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
                  onClick={() => {
                    playClickSound();
                    handleSubtaskClick("subtask2");
                  }}
                >
                  Task 2
                  <Info
                    className="w-5 h-5 cursor-pointer text-white hover:text-yellow-300"
                    onMouseEnter={() => handleMouseEnter(2)}
                    onMouseLeave={handleMouseLeave}
                  />
                </button>
                <button
                  disabled={!task2Complete}
                  className={`flex items-center gap-2 font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition
                ${
                  task2Complete
                    ? "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
                  onClick={() => {
                    playClickSound();
                    handleSubtaskClick("subtask3");
                  }}
                >
                  Task 3
                  <Info
                    className="w-5 h-5 cursor-pointer text-white hover:text-yellow-300"
                    onMouseEnter={() => handleMouseEnter(3)}
                    onMouseLeave={handleMouseLeave}
                  />
                </button>
                {/* Subtask Info Popup */}
                {hoveredSubtask && (
                  <SubtaskInfoPopup
                    subtask={hoveredSubtask}
                    taskNumber={hoveredSubtask.sequenceNumber}
                  />
                )}
              </div>

              {/* Bear + Speech Bubble */}
              <div className="absolute -bottom-[20vh] right-16 flex flex-col items-end z-40">
                <img
                  ref={bearRef}
                  src={Bear}
                  alt="Bear mascot"
                  className="w-[40vw] max-w-[300px] sm:w-[30vw] sm:max-w-[250px] md:w-[20vw] md:max-w-[240px] lg:w-[18vw] lg:max-w-[220px] h-auto"
                />

                {/* Speech bubble */}
                <div
                  key="bear-speech"
                  className="chat chat-end absolute -top-10 -left-32 opacity-100 bear-speech"
                >
                  <div className="chat-bubble bg-[#031331] text-[#C5CBD3] font-semibold shadow-md text-sm sm:text-sm md:text-sm">
                    {bearMessage}
                  </div>
                </div>
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
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = COLORS.primaryHover)
                    }
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
