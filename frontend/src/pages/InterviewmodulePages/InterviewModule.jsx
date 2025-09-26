import { React, useState, useEffect, useRef } from "react";
import TopNavbar from "../../components/TopNavbar";
import ConfirmLeaveDialog from "../../components/ConfirmLeaveDialog";
import { useUserStore } from "../../store/user";
import { useNavigate } from "react-router-dom";
import Floor from '../../assets/IFloor.svg';
import Desk from '../../assets/IDesk.svg';
import Sofa from '../../assets/ISofa.svg';
import Wall from '../../assets/IWall.svg';
import WallLocked from '../../assets/IWallB.svg';
import { gsap } from "gsap";

// Import Interview subtasks
import InterviewSubtask1 from "./InterviewSubtask1";
import InterviewSubtask2 from "./InterviewSubtask2";
import InterviewSubtask3 from "./InterviewSubtask3";

const InterviewModule = () => {
  const [showSubtask, setShowSubtask] = useState(false);
  const [selectedSubtask, setSelectedSubtask] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);
  const [task3Complete, setTask3Complete] = useState(false);

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
          />
        );
      case "subtask2":
        return (
          <InterviewSubtask2
            isSubmitted={isSubmitted}
            setIsSubmitted={setIsSubmitted}
            onClose={handleClose}
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
              y: -300,
            });
            gsap.to(wallUnlockedRef.current, {
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
        gsap.set(wallUnlockedRef.current, { opacity: 0 });
        gsap.to(wallLockedRef.current, {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
        });
      }
    }, [task3Complete]);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-[#deffbd]"
      />
      
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
            
      <div className="absolute top-[42vh] left-1/2 -translate-x-1/2 flex justify-between w-[70%] max-w-[1400px] z-30">
        {/* Subtask 1 Object: Desk */}
        <img 
          src={Desk} 
          alt="Desk" 
          className="w-[32vw] max-w-[400px] h-auto" 
        />
        {/* Subtask 2 Object: Sofa */}
        <div className="flex flex-col justify-end">
          <img 
            src={Sofa} 
            alt="Sofa" 
            className="w-[50vw] max-w-[500px] h-auto" 
          />
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

      {/* Modal */}
      {showSubtask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl relative h-[700px] flex flex-col border-4 border-[#79B66F]">
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
  );
};

export default InterviewModule;
