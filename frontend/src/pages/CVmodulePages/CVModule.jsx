import { React, useState, useEffect, useRef } from "react";
import TopNavbar from "../../components/TopNavbar";
import { Home, FileText, Users, Trophy, Book, Settings } from "lucide-react";
import CVSubtask1 from "./CVSubtask1";
import CVSubtask2 from "./CVSubtask2";
import CVSubtask3 from "./CVSubtask3";
import ConfirmLeaveDialog from "../../components/ConfirmLeaveDialog";
import { useUserStore } from "../../store/user";
import { useNavigate } from "react-router-dom";
import Floor from '../../assets/CVFloor.svg';
import Window from '../../assets/CVWindow.svg';
import WindowLocked from '../../assets/CVWindowB.svg';
import Drawers from '../../assets/CVDrawers.svg';
import DrawersLocked from '../../assets/CVDrawersB.svg';
import Desk from '../../assets/CVDesk.svg';
import DeskLocked from '../../assets/CVDeskB.svg';
import { gsap } from "gsap";


const CVModule = () => {
  const [showSubtask, setShowSubtask] = useState(false);
  const [selectedSubtask, setSelectedSubtask] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);
  const [task1Complete, setTask1Complete] = useState(false);
  const [task2Complete, setTask2Complete] = useState(false);
  const [task3Complete, setTask3Complete] = useState(false);



  const navigate = useNavigate();
  const currentUser = useUserStore.getState().user;
  console.log("User:", currentUser);

  // Check if user is logged in and redirect if not
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

    const windowLockedRef = useRef(null);
    const windowUnlockedRef = useRef(null);

    useEffect(() => {
      if (task1Complete) {
        // Fade out locked window
        gsap.to(windowLockedRef.current, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            // Bounce in unlocked window
            gsap.set(windowUnlockedRef.current, {
              opacity: 0,
              scale: 0.5,
              rotation: -30,
              y: -300,
            });
            gsap.to(windowUnlockedRef.current, {
              opacity: 1,
              scale: 1,
              rotation: 0,
              y: 0,
              duration: 1.5,
              ease: "bounce.out",
            });
          },
        });
      } else {
        // Fade in locked window
        gsap.set(windowUnlockedRef.current, { opacity: 0 });
        gsap.to(windowLockedRef.current, {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
        });
      }
    }, [task1Complete]);

    const drawersLockedRef = useRef(null);
    const drawersUnlockedRef = useRef(null);

    useEffect(() => {
      if (task2Complete) {
        // Fade out locked drawers
        gsap.to(drawersLockedRef.current, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            // Bounce in unlocked drawers
            gsap.set(drawersUnlockedRef.current, {
              opacity: 0,
              scale: 0.5,
              rotation: -30,
              y: -300,
            });
            gsap.to(drawersUnlockedRef.current, {
              opacity: 1,
              scale: 1,
              rotation: 0,
              y: 0,
              duration: 1.5,
              ease: "bounce.out",
            });
          },
        });
      } else {
        // Fade in locked window
        gsap.set(drawersUnlockedRef.current, { opacity: 0 });
        gsap.to(drawersLockedRef.current, {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
        });
      }
    }, [task2Complete]);

    const deskLockedRef = useRef(null);
    const deskUnlockedRef = useRef(null);

    useEffect(() => {
      if (task3Complete) {
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
              y: -300,
            });
            gsap.to(deskUnlockedRef.current, {
              opacity: 1,
              scale: 1,
              rotation: 0,
              y: 0,
              duration: 1.5,
              ease: "bounce.out",
            });
          },
        });
      } else {
        // Fade in locked desk
        gsap.set(deskUnlockedRef.current, { opacity: 0 });
        gsap.to(deskLockedRef.current, {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
        });
      }
    }, [task3Complete]);

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

  // Render the selected subtask
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
        return <CVSubtask3 
          onClose={handleClose} 
          setIsSubmitted={setIsSubmitted}
          onTaskComplete={() => setTask3Complete(true)}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
    

      {/* Background */}
      <div className="flex-1 relative bg-cover bg-center bg-[#DBBBFB]">
        
        {/* Top Navbar */}
      <div className="relative z-10">
        <TopNavbar />
      </div>

      {/* Purple Floor */}
      <img
        src={Floor}
        alt="Welcome"
        className="absolute bottom-0 left-0 w-full h-auto"
      />

      {/* Subtask 3 Object: Desk */}
      <div className="relative">
        <img
          ref={deskLockedRef}
          src={DeskLocked}
          alt="Locked CV Desk"
          className="absolute top-[200px] left-1/2 -translate-x-1/2 w-[33vw] max-w-[800px] h-auto"
        />
        <img
          ref={deskUnlockedRef}
          src={Desk}
          alt="Unlocked CV Desk"
          className="absolute top-[200px] left-1/2 -translate-x-1/2 w-[33vw] max-w-[800px] h-auto"
        />
      </div>

      {/* Subtask 2 Object: Drawer */}
      <div className="relative">
        <img
          ref={drawersLockedRef}
          src={DrawersLocked}
          alt="Locked CV Drawers"
          className="absolute top-[200px] right-0 w-[33vw] max-w-[800px] h-auto"
        />
        <img
          ref={drawersUnlockedRef}
          src={Drawers}
          alt="Unlocked CV Drawers"
          className="absolute top-[200px] right-0 w-[33vw] max-w-[800px] h-auto"
        />
      </div>

      {/* Subtask 1 Object: Windows */}
      <div className="relative">
        <img
          ref={windowLockedRef}
          src={WindowLocked}
          alt="Locked CV Window"
          className="absolute left-1/2 -translate-x-1/2 w-[600px] z-20"
        />
        <img
          ref={windowUnlockedRef}
          src={Window}
          alt="Unlocked CV Window"
          className="absolute left-1/2 -translate-x-1/2 w-[600px] z-20"
        />
      </div>


        <div className="relative z-10 flex flex-col md:flex-row h-full bottom-0">
          {/* Main Workspace */}
          <main className="flex-1 flex flex-col justify-center items-center p-6 space-y-6 bottom-0">
            
          </main>
        </div>
      </div>
      {/* Bottom Button Container */}
      <div className="w-full bg-white shadow-md p-4 fixed bottom-10 left-0 flex justify-center z-20">
        <div className="flex space-x-6">
          <button
            className="bg-blue-400 hover:bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition"
            onClick={() => handleSubtaskClick("subtask1")}
          >
            Task 1
          </button>
          <button
            className="bg-blue-400 hover:bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition"
            onClick={() => handleSubtaskClick("subtask2")}
          >
            Task 2
          </button>
          <button
            className="bg-blue-400 hover:bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition"
            onClick={() => handleSubtaskClick("subtask3")}
          >
            Task 3
          </button>
        </div>
      </div>

      {/* Modal for CVSubtask1 */}
      {showSubtask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl relative h-[700px] flex flex-col border-4 border-[#4f9cf9]">
            <div className="overflow-y-auto pr-2">{renderSubtask()}</div>
          </div>
        </div>
      )}
      {/* Confirmation Modal */}
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
  );
};

export default CVModule;
