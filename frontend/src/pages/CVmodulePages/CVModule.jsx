import { React, useState } from "react";
import TopNavbar from "../../components/TopNavbar";
import { Home, FileText, Users, Trophy, Book, Settings } from "lucide-react";
import CVSubtask1 from "./CVSubtask1";
import CVSubtask2 from "./CVSubtask2";
import CVSubtask3 from "./CVSubtask3";
import ConfirmLeaveDialog from "../../components/ConfirmLeaveDialog";

const CVModule = () => {
  const [showSubtask, setShowSubtask] = useState(false);
  const [selectedSubtask, setSelectedSubtask] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);

  const handleSubtaskClick = (task) => {
    setSelectedSubtask(task);
    setShowSubtask(true);
  };
  const handleClose = (force = false) => {
    // Check if user hasn't typed anything yet
    const isEmpty =
      personal.firstName === "" &&
      personal.lastName === "" &&
      personal.phone === "" &&
      personal.email === "" &&
      personal.linkedin === "";

    if (isEmpty || force) {
      // User hasn't started → allow close
      setShowSubtask(false);
      setSelectedSubtask(null);
      return;
    }
    if (!isSubmitted) {
      // show confirm popup
      setShowConfirmLeave(true);
    } else {
      setShowSubtask(false);
      setSelectedSubtask(null);
    }
  };

  // Lifted states from CVSubtask1 to clear the personal info state on close
  const [personal, setPersonal] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    linkedin: ""
  });

  // If user clicked "Leave", allow them to leave
  const confirmLeave = () => {
    setShowConfirmLeave(false);
    setShowSubtask(false);
    setSelectedSubtask(null);

    // Reset personal info state
    setPersonal({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      linkedin: ""
    });

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
            personal={personal}
            setPersonal={setPersonal}
            isSubmitted={isSubmitted}
            setIsSubmitted={setIsSubmitted}
            onClose={handleClose}
          />
        );
      case "subtask2":
        return (
        <CVSubtask2
          onClose={handleClose}
          // optional: let subtask2 mark modal-safe state if you track it
          setIsSubmitted={setIsSubmitted}
        />
      );
      case "subtask3":
        return (
          <CVSubtask3
            onClose={handleClose}
            setIsSubmitted={setIsSubmitted}
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
      <div
        className="flex-1 relative bg-cover bg-center"
      >
        {/* Overlay */}
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

      {/* Modal for CVSubtask1 */}
      {showSubtask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl relative h-[700px] flex flex-col">
            {/* Close Button at Top-Right */}
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
          message="Please finish the task to save the changes."
          onConfirm={confirmLeave}
          onCancel={() => setShowConfirmLeave(false)}
        />
      )}
    </div>
  );
};

export default CVModule;
