import { React, useState } from "react";
import TopNavbar from "../../components/TopNavbar";
import ConfirmLeaveDialog from "../../components/ConfirmLeaveDialog";

// Import Interview subtasks
import InterviewSubtask1 from "./InterviewSubtask1";
import InterviewSubtask2 from "./InterviewSubtask2";
import InterviewSubtask3 from "./InterviewSubtask3";

const InterviewModule = () => {
  const [showSubtask, setShowSubtask] = useState(false);
  const [selectedSubtask, setSelectedSubtask] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);

  const [interviewData, setInterviewData] = useState({
    question: "",
    answer: "",
    notes: ""
  });

  //Ignore for now
  const handleSubtaskClick = (task) => {
    setSelectedSubtask(task);
    setShowSubtask(true);
  };

  const handleClose = (force = false) => {
    //Ignore for now
    const isEmpty =
      interviewData.question === "" && interviewData.answer === "" && interviewData.notes === "";
    //Ignore for now
    if (isEmpty || force) {
      setShowSubtask(false);
      setSelectedSubtask(null);
      return;
    }

    if (!isSubmitted) {
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

    //Ignore for now
    setInterviewData({
      question: "",
      answer: "",
      notes: ""
    });

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
          </main>
        </div>
      </div>

      {/* Modal */}
      {showSubtask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl relative h-[700px] flex flex-col">
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl"
            >
              ✖
            </button>
            <div className="overflow-y-auto pr-2">{renderSubtask()}</div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmLeave && (
        <ConfirmLeaveDialog
          isOpen={showConfirmLeave}
          title="Your changes will be lost!"
          message="Please finish the interview task to save your progress."
          onConfirm={confirmLeave}
          onCancel={() => setShowConfirmLeave(false)}
        />
      )}
    </div>
  );
};

export default InterviewModule;
