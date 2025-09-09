import { React, useState, useEffect } from "react";
import TopNavbar from "../../components/TopNavbar";
import { Home, FileText, Users, Trophy, Book, Settings } from "lucide-react";
import CVSubtask1 from "./CVSubtask1";

const CVModule = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Restore state on mount (refresh page)
  // Save modal state only when modal is open
  useEffect(() => {
    if (showForm && selectedTask) {
      localStorage.setItem("cvModalState", JSON.stringify({ showForm, selectedTask }));
    } else {
      localStorage.removeItem("cvModalState"); // clear only when modal closed
    }
  }, [showForm, selectedTask]);

  useEffect(() => {
    const saved = localStorage.getItem("cvModalState");
    if (saved) {
      const parsed = JSON.parse(saved);
      setShowForm(parsed.showForm || false);
      setSelectedTask(parsed.selectedTask || null);
    }
  }, []);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedTask(null);
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
        {/* Overlay to soften bg */}
        <div className="absolute inset-0 bg-white/70" />

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row h-full">
          {/* Sidebar */}
          <aside className="w-full md:w-64 mt-10 bg-blue-400 text-white rounded-r-2xl shadow-xl p-4">
            {/* User Info */}
            <div className="flex flex-col items-center mb-6">
              <img
                src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
                alt="User Avatar"
                className="w-16 h-16 rounded-full border-2 border-white mb-2"
              />
              <p className="font-semibold">Rachel Green</p>
            </div>

            {/* Menu */}
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
            {/* Tasks */}
            <div className="flex space-x-6">
              <button
                className="bg-blue-400 hover:bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition"
                onClick={() => handleTaskClick("Task 1")}
              >
                Task 1
              </button>
              <button
                className="bg-blue-400 hover:bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition"
                // onClick={() => handleTaskClick("Task 2")}
              >
                Task 2
              </button>
              <button
                className="bg-blue-400 hover:bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition"
                // onClick={() => handleTaskClick("Task 3")}
              >
                Task 3
              </button>
            </div>
          </main>
        </div>
      </div>
      {/* Modal for CVSubtask1 */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl relative h-[500px] flex flex-col">
            {/* Close Button at Top-Right */}
            <button
              onClick={handleCloseForm}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl"
            >
              ✖
            </button>

            {/* Content Wrapper with Scroll */}
            <div className="overflow-y-auto pr-2">
              <CVSubtask1 task={selectedTask} onClose={handleCloseForm} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVModule;
