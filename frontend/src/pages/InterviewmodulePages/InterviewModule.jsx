import { React, useState, useEffect, useRef } from "react";
import TopNavbar from "../../components/TopNavbar";
import ConfirmLeaveDialog from "../../components/ConfirmLeaveDialog";
import { useUserStore } from "../../store/user";
import { useNavigate } from "react-router-dom";
import Floor from "../../assets/IFloor.svg";
import Desk from "../../assets/IDesk.svg";
import Sofa from "../../assets/ISofa.svg";
import Wall from "../../assets/IWall.svg";
import WallLocked from "../../assets/IWallB.svg";
import DeskLocked from "../../assets/IDeskB.svg";
import SofaLocked from "../../assets/ISofaB.svg";
import { gsap } from "gsap";
import BackgroundMusicBox from "../../components/BackgroundMusicBox";
import SideNavbar from "../../components/SideNavbar";
import Bear from "../../assets/Bear.svg";
import {
  getModuleByName,
  getLevelByNumber,
  getSubtasksByLevel,
  isSubtaskCompleted
} from "../../utils/moduleHelpers";

import { Info, Music } from "lucide-react";
import SubtaskInfoPopup from "../../components/SubtaskInfoPopup";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// Import Interview subtasks
import InterviewSubtask1 from "./InterviewSubtask1";
import InterviewSubtask2 from "./interviewSubtask2";
import InterviewSubtask3 from "./InterviewSubtask3";

// Level Passed Pop up
import CongratsPage from "./InterviewLevelPass";

/* THEME (blue) */
const COLORS = {
  primary: "#4f9cf9",
  primaryHover: "#3d86ea",
  textMuted: "#767687"
};

// const cx = (...xs) => xs.filter(Boolean).join(" ");

const InterviewModule = () => {
  const [showSubtask, setShowSubtask] = useState(false);
  const [selectedSubtask, setSelectedSubtask] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);
  const [task1Complete, setTask1Complete] = useState(false);
  const [task2Complete, setTask2Complete] = useState(false);
  const [task3Complete, setTask3Complete] = useState(false);

  // Check if subtasks are already completed before
  useEffect(() => {
    const fetchTaskCompletion = async () => {
      try {
        const task1Done = await isSubtaskCompleted("Interview", 1, 1);
        const task2Done = await isSubtaskCompleted("Interview", 1, 2);
        const task3Done = await isSubtaskCompleted("Interview", 1, 3);

        setTask1Complete(task1Done);
        setTask2Complete(task2Done);
        setTask3Complete(task3Done);
      } catch (err) {
        console.error("Failed to fetch CV task completion:", err);
      }
    };

    fetchTaskCompletion();
  }, [setTask1Complete, setTask2Complete, setTask3Complete]);

  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        await useUserStore.getState().fetchUser();
      }

      const currentUser = useUserStore.getState().user;
      if (!currentUser) {
        navigate("/login"); // redirect if still not logged in
      }
    };
    fetchUserData();
  }, [navigate, user]);

  const handleSubtaskClick = (task) => {
    setSelectedSubtask(task);
    setShowSubtask(true);
  };

  const handleClose = (hasChanges, force = false) => {
    // Allow force close
    if (force) {
      setShowSubtask(false);
      setSelectedSubtask(null);
      return;
    }
    if (hasChanges) {
      // show confirm popup
      setShowConfirmLeave(true);
    } else {
      setShowSubtask(false);
      setSelectedSubtask(null);
    }
  };

  // If user clicked "Leave", allow them to leave
  const confirmLeave = () => {
    setShowConfirmLeave(false);
    setShowSubtask(false);
    setSelectedSubtask(null);

    // Reset submission state if needed
    setIsSubmitted(false);
  };

  const renderSubtask = () => {
    switch (selectedSubtask) {
      case "subtask1":
        return (
          <InterviewSubtask1
            isSubmitted={isSubmitted}
            setIsSubmitted={setIsSubmitted}
            onClose={handleClose}
            onTaskComplete={() => setTask1Complete(true)}
          />
        );
      case "subtask2":
        return (
          <InterviewSubtask2
            isSubmitted={isSubmitted}
            setIsSubmitted={setIsSubmitted}
            onClose={handleClose}
            onTaskComplete={() => setTask2Complete(true)}
          />
        );
      case "subtask3":
        return (
          <InterviewSubtask3
            isSubmitted={isSubmitted}
            setIsSubmitted={setIsSubmitted}
            onClose={handleClose}
            onTaskComplete={() => setTask3Complete(true)}
          />
        );
      default:
        return null;
    }
  };

  const deskLockedRef = useRef(null);
  const deskUnlockedRef = useRef(null);

  useEffect(() => {
    if (task1Complete) {
      // Fade out locked desk
      gsap.to(deskLockedRef.current, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          // Bounce in unlocked drawers
          gsap.set(deskUnlockedRef.current, {
            opacity: 0,
            scale: 0.5,
            rotation: -30,
            y: -300
          });
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
      // Fade in locked desk
      gsap.set(deskUnlockedRef.current, { opacity: 0 });
      gsap.to(deskLockedRef.current, {
        opacity: 0.7,
        duration: 0.6,
        ease: "power2.out"
      });
    }
  }, [task1Complete]);

  const sofaLockedRef = useRef(null);
  const sofaUnlockedRef = useRef(null);

  useEffect(() => {
    if (task2Complete) {
      // Fade out locked desk
      gsap.to(sofaLockedRef.current, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          // Bounce in unlocked drawers
          gsap.set(sofaUnlockedRef.current, {
            opacity: 0,
            scale: 0.5,
            rotation: -30,
            y: -300
          });
          gsap.to(sofaUnlockedRef.current, {
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
      // Fade in locked desk
      gsap.set(sofaUnlockedRef.current, { opacity: 0 });
      gsap.to(sofaLockedRef.current, {
        opacity: 0.7,
        duration: 0.6,
        ease: "power2.out"
      });
    }
  }, [task2Complete]);

  const wallLockedRef = useRef(null);
  const wallUnlockedRef = useRef(null);

  useEffect(() => {
    if (task3Complete) {
      // Fade out locked desk
      gsap.to(wallLockedRef.current, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          // Bounce in unlocked drawers
          gsap.set(wallUnlockedRef.current, {
            opacity: 0,
            scale: 0.5,
            rotation: -30,
            y: -300
          });
          gsap.to(wallUnlockedRef.current, {
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
      // Fade in locked desk
      gsap.set(wallUnlockedRef.current, { opacity: 0 });
      gsap.to(wallLockedRef.current, {
        opacity: 0.7,
        duration: 0.6,
        ease: "power2.out"
      });
    }
  }, [task3Complete]);

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

  // 🧠 Bear logic
  const [bearMessage, setBearMessage] = useState("Ready to ace that interview?");
  const bearRef = useRef(null);

  // Update bear message as user progresses
  useEffect(() => {
    if (task1Complete && !task2Complete && !task3Complete) {
      setBearMessage("Good start! Let's keep practicing 💬");
    } else if (task1Complete && task2Complete && !task3Complete) {
      setBearMessage("You're getting interview-ready! 💼");
    } else if (task1Complete && task2Complete && task3Complete) {
      setBearMessage("Interview master! You're all set! 🎉");
    } else {
      setBearMessage("Ready to ace that interview?");
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

  // Related to subtaskIntro popup
  const [hoveredSubtask, setHoveredSubtask] = useState(null);

  const handleMouseEnter = async (taskNumber) => {
    try {
      const module = await getModuleByName("Interview");
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
    const moduleName = "interview"; 
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
                zIndex: 9999,
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
      <div className="flex-1 relative bg-cover bg-center bg-[#deffbd]">
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
            {showMusicBox && <BackgroundMusicBox moduleName="InterviewModule" />}

            {/* Purple Floor */}
            <img src={Floor} alt="Welcome" className="absolute bottom-0 left-0 w-full h-auto" />

            <div className="flex">
              <div className="mt-4 z-40">
                <SideNavbar />
              </div>

              <div className="relative w-full">
                {/* Subtask 3 Object: Wall */}
                <div className="relative">
                  <img
                    ref={wallLockedRef}
                    src={WallLocked}
                    alt="Unlocked Interview Wall"
                    className="absolute top-[2vh] left-1/2 -translate-x-1/2 w-[70vw] max-w-[1100px] h-auto z-20"
                  />

                  <img
                    ref={wallUnlockedRef}
                    src={Wall}
                    alt="Unlocked Interview Wall"
                    className="absolute top-[2vh] left-1/2 -translate-x-1/2 w-[70vw] max-w-[1100px] h-auto z-20"
                  />
                </div>

                {/* Subtask 1 Object: Desk */}

                <div className="relative w-full flex justify-center">
                  <img
                    ref={deskLockedRef}
                    src={DeskLocked}
                    alt="Locked CV Desk"
                    className="absolute top-[35vh] left-28 w-[30vw] max-w-[400px] h-auto z-30"
                  />
                  <img
                    ref={deskUnlockedRef}
                    src={Desk}
                    alt="Unlocked CV Desk"
                    className="absolute top-[35vh] left-28 w-[30vw] max-w-[400px] h-auto z-30"
                  />
                </div>

                {/* Subtask 2 Object: Sofa */}
                <div className="relative w-full flex justify-center">
                  <img
                    ref={sofaLockedRef}
                    src={SofaLocked}
                    alt="Locked CV Desk"
                    className="absolute top-[40vh] right-20 w-[40vw] max-w-[600px] h-auto z-30"
                  />
                  <img
                    ref={sofaUnlockedRef}
                    src={Sofa}
                    alt="Unlocked CV Desk"
                    className="absolute top-[40vh] right-20 w-[40vw] max-w-[600px] h-auto z-30"
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
                  className="chat chat-end absolute -top-10 -left-48 opacity-100 bear-speech"
                >
                  <div className="chat-bubble bg-[#031331] text-[#C5CBD3] font-semibold shadow-md text-sm sm:text-sm md:text-sm">
                    {bearMessage}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal */}
          {showSubtask && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative h-[700px] flex flex-col border-4"
                style={{ borderColor: COLORS.primary }}
              >
                <div className="overflow-y-auto pr-2">{renderSubtask()}</div>
              </div>
            </div>
          )}

          {/* Confirmation Modal */}
          {showConfirmLeave && (
            <ConfirmLeaveDialog
              isOpen={showConfirmLeave}
              title="Your changes will be lost!"
              message="Please finish the task to save your progress."
              onConfirm={confirmLeave}
              onCancel={() => setShowConfirmLeave(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewModule;
