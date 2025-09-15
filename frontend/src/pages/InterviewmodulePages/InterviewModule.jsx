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
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <TopNavbar />

      {/* Background */}
      <div className="flex-1 relative bg-cover bg-center">
        <div className="absolute inset-0 bg-white/70" />

        <div className="relative z-10 flex flex-col md:flex-row h-full">
          {/* Main Workspace */}
          <main className="flex-1 flex flex-col justify-center items-center p-6 space-y-6">
            <div className="flex space-x-6">
              <button
                className="bg-[#79B66F] hover:bg-[#5f9c56] text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition"
                onClick={() => handleSubtaskClick("subtask1")}
              >
                Task 1
              </button>
              <button
                className="bg-[#79B66F] hover:bg-[#5f9c56] text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition"
                onClick={() => handleSubtaskClick("subtask2")}
              >
                Task 2
              </button>
              <button
                className="bg-[#79B66F] hover:bg-[#5f9c56] text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition"
                onClick={() => handleSubtaskClick("subtask3")}
              >
                Task 3
              </button>
            </div>
          </main>
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
