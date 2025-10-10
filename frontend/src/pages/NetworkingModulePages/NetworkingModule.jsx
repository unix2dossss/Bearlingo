import React, { useState, useEffect, useRef } from "react";
import TopNavbar from "../../components/TopNavbar";
import ConfirmLeaveDialog from "../../components/ConfirmLeaveDialog";
import { useUserStore } from "../../store/user";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import toast from "react-hot-toast";
import api from "../../lib/axios";

// Subtasks
import NetworkingSubtask1 from "./NetworkingSubtask1";
import NetworkingSubtask2 from "./NetworkingSubtask2";
import NetworkingSubtask3 from "./NetworkingSubtask3";

// UI bits
import BackgroundMusicBox from "../../components/BackgroundMusicBox";
import SideNavbar from "../../components/SideNavbar";

// Assets
import Floor from "../../assets/NFloor.svg";
import Cafe from "../../assets/NCafe.svg";
import Sign from "../../assets/NSign.svg";
import Table from "../../assets/NTable.svg";
import Bear from "../../assets/Bear.svg";

const COLORS = {
  bg: "#fff9c7",
  primary: "#3d86ea",
  primaryHover: "#4f9cf9",
  doorLeft: "#9ca3af",
  doorRight: "#6b7280",
};

const NetworkingModule = () => {
  const [selectedSubtask, setSelectedSubtask] = useState(null);
  const [showSubtask, setShowSubtask] = useState(false);
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);

  const [userInfo, setUserInfo] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [userEvents, setUserEvents] = useState([]);

  const [currentSpeechIndex, setCurrentSpeechIndex] = useState(0);
  const [animationDone, setAnimationDone] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [elevatorOpen, setElevatorOpen] = useState(true);

  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  const bearRef = useRef(null);
  const [bearMessage] = useState("Let’s make new connections!");

  // Elevator doors (hub only)
  const leftDoor = useRef(null);
  const rightDoor = useRef(null);

  // Auth
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) await useUserStore.getState().fetchUser();
      const currentUser = useUserStore.getState().user;
      if (!currentUser) {
        navigate("/login");
      } else {
        setUserInfo(currentUser);
      }
    };
    fetchUserData();
  }, [navigate, user]);

  // Script for bear speech (hub)
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

  // Load events when entering subtask 2
  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        const res = await api.get("/users/me/networking/events", { withCredentials: true });
        setUserEvents(res.data.eventsToAttend || []);
      } catch (error) {
        console.error("User events were not fetched", error);
        toast.error("User events were not fetched");
      }
    };
    const fetchAllEvents = async () => {
      try {
        const res = await api.get("/users/me/networking/all-events", { withCredentials: true });
        setAllEvents(res.data.allEventsFromBackend || []);
      } catch (error) {
        console.log("Error in obtaining events", error);
        toast.error("Error in obtaining events");
      }
    };
    if (showSubtask && selectedSubtask === "subtask2") {
      fetchUserEvents();
      fetchAllEvents();
    }
  }, [showSubtask, selectedSubtask]);

  // Bear entrance (hub)
  useEffect(() => {
    if (!showSubtask) {
      const tl = gsap.timeline({
        defaults: { duration: 0.8, ease: "power3.out" },
        onComplete: () => setAnimationDone(true),
      });
      tl.fromTo(
        ".bear",
        { scale: 0, rotation: -180, opacity: 0, x: -200, y: -100 },
        { scale: 1, rotation: 0, opacity: 1, x: 0, y: 0, duration: 1.2 }
      ).to(".bear", { y: -30, duration: 0.4, yoyo: true, repeat: 1, ease: "power2.inOut" });
    }
  }, [showSubtask]);

  useEffect(() => {
    if (!animationDone || showSubtask) return;
    gsap.fromTo(
      ".bear-speech",
      { opacity: 0, y: 50, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: "back.out(1.7)" }
    );
  }, [currentSpeechIndex, animationDone, showSubtask]);

  // Elevator opening (hub only)
  useEffect(() => {
    if (!showSubtask && elevatorOpen) {
      gsap.set(leftDoor.current, { x: "0%" });
      gsap.set(rightDoor.current, { x: "0%" });
      const tl = gsap.timeline({
        defaults: { duration: 1.5, ease: "power2.inOut", delay: 0.3 },
        onComplete: () => {
          setElevatorOpen(false);
          if (leftDoor.current) leftDoor.current.style.pointerEvents = "none";
          if (rightDoor.current) rightDoor.current.style.pointerEvents = "none";
        },
      });
      tl.to(leftDoor.current, { x: "-100%" }).to(rightDoor.current, { x: "100%" }, "<");
    }
  }, [showSubtask, elevatorOpen]);

  // Actions
  const handleSubtaskClick = (task) => {
    setSelectedSubtask(task);
    setShowSubtask(true); // full-page swap
  };

  const handleClose = (hasChanges, force = false) => {
    if (force) {
      setShowSubtask(false);
      setSelectedSubtask(null);
      setIsSubmitted(false);
      return;
    }
    if (hasChanges) {
      setShowConfirmLeave(true);
    } else {
      setShowSubtask(false);
      setSelectedSubtask(null);
      setIsSubmitted(false);
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
        return <NetworkingSubtask1 userInfo={userInfo} onBack={(hasChanges) => handleClose(hasChanges)} />;
      case "subtask2":
        return (
          <NetworkingSubtask2
            userInfo={userInfo}
            onBack={(hasChanges) => handleClose(hasChanges)}
            allEvents={allEvents}
            userEvents={userEvents}
          />
        );
      case "subtask3":
        return <NetworkingSubtask3 userInfo={userInfo} onBack={(hasChanges) => handleClose(hasChanges)} />;
      default:
        return null;
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen relative overflow-hidden"
      style={{
        "--bg": COLORS.bg,
        "--primary": COLORS.primary,
        "--primary-hover": COLORS.primaryHover,
        "--door-left": COLORS.doorLeft,
        "--door-right": COLORS.doorRight,
      }}
    >
    {/* Elevator Doors (hub only) */}
    <div ref={leftDoor} className="absolute top-0 left-0 w-1/2 h-full bg-[var(--door-left)] z-50" />
    <div ref={rightDoor} className="absolute top-0 right-0 w-1/2 h-full bg-[var(--door-right)] z-50" />

    <div className="flex-1 relative bg-cover bg-center bg-[#fff9c7]">
      {/* Top Navbar (always visible) */}
      <div className="relative z-[100]">
        <TopNavbar />
      </div>

      {/* ================= HUB SCENE (hidden when subtask is open) ================= */}
      {!showSubtask && (
        <div>
          {/* Music control */}
          <BackgroundMusicBox moduleName="NetworkingModule" />

          {/* Floor (decorative) */}
          <img
            src={Floor}
            alt="Welcome" className="absolute bottom-0 left-0 w-full h-auto"
          />

          <div className="flex">
            {/* Side Nav */}
            <div className="mt-4 z-40">
              <SideNavbar />
            </div>

            {/* Scene (decorative) */}
            <div className="relative w-full">
              <div className="relative w-full flex justify-center">
                <img
                  src={Cafe}
                  alt=""
                  aria-hidden="true"
                  className="absolute top-[13vh] left-40 w-[45vw] max-w-[800px] h-auto z-30 pointer-events-none select-none"
                />
              </div>
              <div className="relative w-full flex justify-center">
                <img
                  src={Sign}
                  alt=""
                  aria-hidden="true"
                  className="absolute top-[10vh] right-64 w-[20vw] max-w-[800px] h-auto z-30 pointer-events-none select-none"
                />
              </div>
              <div className="relative">
                <img
                  src={Table}
                  alt=""
                  aria-hidden="true"
                  className="absolute top-[43vh] right-[12vw] w-[28vw] max-w-[800px] h-auto z-30 pointer-events-none select-none"
                />
              </div>
            </div>
          </div>

          {/* Bottom Button Container (same logic, now triggers full-page swap) */}
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

        
              </div>
            </div>
          </div>
      )}

      {/* ================= FULL-PAGE SUBTASK (fills screen) ================= */}
      {showSubtask && (
        <div className="flex-1 relative bg-cover bg-center min-h-screen" style={{ backgroundColor: COLORS.bg }}>
          {/* Optional: include SideNavbar / music here too if desired */}
          <div className="relative">{renderSubtask()}</div>
        </div>
      )}

      {/* Confirmation Modal (works for both hub and subtask views) */}
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
  );
};

export default NetworkingModule;
