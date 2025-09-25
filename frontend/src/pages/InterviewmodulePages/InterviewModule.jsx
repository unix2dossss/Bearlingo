import { React, useState, useEffect } from "react";
import TopNavbar from "../../components/TopNavbar";
import ConfirmLeaveDialog from "../../components/ConfirmLeaveDialog";
import { useUserStore } from "../../store/user";
import { useNavigate } from "react-router-dom";

// Import Interview subtasks
import InterviewSubtask1 from "./InterviewSubtask1";
import InterviewSubtask2 from "./InterviewSubtask2";
import InterviewSubtask3 from "./InterviewSubtask3";

const InterviewModule = () => {
  const [showSubtask, setShowSubtask] = useState(false);
  const [selectedSubtask, setSelectedSubtask] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);

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
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url("src/assets/Interview-Floor1.svg")`
        }}
      />
      {/* Top Navbar */}
      <div className="relative z-10">
        <TopNavbar />
      </div>

        <div className="relative z-10 flex-1 flex flex-col justify-end items-center pb-10">
          {/* Main Workspace */}
            <div className="flex space-x-48 mb-[51px]">
              <button
                className="bg-[#43a047] hover:bg-[#5f9c56] text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition"
                onClick={() => handleSubtaskClick("subtask1")}
              >
                Task 1
              </button>
              <button
                className="bg-[#43a047] hover:bg-[#5f9c56] text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition"
                onClick={() => handleSubtaskClick("subtask2")}
              >
                Task 2
              </button>
              <button
                className="bg-[#43a047] hover:bg-[#5f9c56] text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition"
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
