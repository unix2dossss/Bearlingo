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
import { isSubtaskCompleted } from "../../utils/moduleHelpers";

// Import Interview subtasks
import InterviewSubtask1 from "./InterviewSubtask1";
import InterviewSubtask2 from "./interviewSubtask2";
import InterviewSubtask3 from "./InterviewSubtask3";

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
        opacity: 1,
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
        opacity: 1,
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
        opacity: 1,
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
  
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Elevator Doors Overlay */}
      <div ref={leftDoor} className="absolute top-0 left-0 w-1/2 h-full bg-gray-400 z-50" />
      <div ref={rightDoor} className="absolute top-0 right-0 w-1/2 h-full bg-gray-500 z-50" />

      {/* Background */}
      <div className="flex-1 relative bg-cover bg-center bg-[#deffbd]">
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
                    className="absolute top-[35vh] left-40 w-[30vw] max-w-[600px] h-auto z-30"
                  />
                  <img
                    ref={deskUnlockedRef}
                    src={Desk}
                    alt="Unlocked CV Desk"
                    className="absolute top-[35vh] left-40 w-[30vw] max-w-[600px] h-auto z-30"
                  />
                </div>

                {/* Subtask 2 Object: Sofa */}
                <div className="relative w-full flex justify-center">
                  <img
                    ref={sofaLockedRef}
                    src={SofaLocked}
                    alt="Locked CV Desk"
                    className="absolute top-[43vh] right-40 w-[40vw] max-w-[600px] h-auto z-30"
                  />
                  <img
                    ref={sofaUnlockedRef}
                    src={Sofa}
                    alt="Unlocked CV Desk"
                    className="absolute top-[43vh] right-40 w-[40vw] max-w-[600px] h-auto z-30"
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
