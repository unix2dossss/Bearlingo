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
          />
        );
      case "subtask2":
        return(
          <CVSubtask2
            isSubmitted={isSubmitted}
            setIsSubmitted={setIsSubmitted}
            onClose={handleClose}
          />  

        )
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
        style={{
          backgroundImage: "url('https://cdn-icons-png.flaticon.com/512/616/616408.png')"
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-white/70" />

        <div className="relative z-10 flex flex-col md:flex-row h-full">
          {/* Sidebar */}
          <aside className="w-full md:w-64 mt-10 bg-blue-400 text-white rounded-r-2xl shadow-xl p-4">
            <div className="flex flex-col items-center mb-6">
              <img
                src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
                alt="User Avatar"
                className="w-16 h-16 rounded-full border-2 border-white mb-2"
              />
              <p className="font-semibold">Rachel Green</p>
            </div>

            <nav className="space-y-3">
              <button className="flex items-center w-full px-3 py-2 rounded-lg hover:bg-blue-600">
                <Home className="w-5 h-5 mr-2" /> Pathway
              </button>
              <div className="ml-6 space-y-2">
                <button className="flex items-center w-full px-3 py-2 text-sm rounded-lg hover:bg-blue-600">
                  <FileText className="w-4 h-4 mr-2" /> CV
                </button>
                <button className="flex items-center w-full px-3 py-2 text-sm rounded-lg hover:bg-blue-600">
                  <Users className="w-4 h-4 mr-2" /> Networking
                </button>
                <button className="flex items-center w-full px-3 py-2 text-sm rounded-lg hover:bg-blue-600">
                  <FileText className="w-4 h-4 mr-2" /> Interview
                </button>
              </div>
              <button className="flex items-center w-full px-3 py-2 rounded-lg hover:bg-blue-600">
                <Trophy className="w-5 h-5 mr-2" /> Leaderboard
              </button>
              <button className="flex items-center w-full px-3 py-2 rounded-lg hover:bg-blue-600">
                <Book className="w-5 h-5 mr-2" /> Journal
              </button>
              <button className="flex items-center w-full px-3 py-2 rounded-lg hover:bg-blue-600">
                <Settings className="w-5 h-5 mr-2" /> Setting
              </button>
            </nav>
          </aside>

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
