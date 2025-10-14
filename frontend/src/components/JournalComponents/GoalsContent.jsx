import React from "react";

const GoalsContent = ({
  openFolder,
  openFile,
  setOpenFile,
  showAddFileModal,
  setShowAddFileModal,
  newFileName,
  setNewFileName,
}) => {
  return (
    <div className="flex flex-1 overflow-hidden">
      {showAddFileModal ? (
        <div className="border border-yellow-300 flex-1 bg-yellow-50 p-6 overflow-y-auto flex flex-col rounded-lg shadow-sm">
          {/* Add New Goal Form */}
          <div className="bg-white w-[100%] h-[90%] p-6 rounded-xl shadow-lg flex flex-col gap-4 overflow-y-scroll">
            <h2 className="text-2xl font-bold text-yellow-700 text-center mb-2">
              Create a New Goal
            </h2>

            <label className="text-yellow-800 font-medium text-sm mt-2">
              Goal Title
            </label>
            <input
              type="text"
              placeholder="Enter your goal title"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="border border-yellow-400 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <label className="text-yellow-800 font-medium text-sm mt-4">
              Goal Description
            </label>
            <textarea
              placeholder="Describe what you want to achieve..."
              className="border border-yellow-400 rounded-md px-3 py-2 text-sm h-32 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <label className="text-yellow-800 font-medium text-sm mt-4">
              Progress
            </label>
            <select className="border border-yellow-400 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400">
              <option>Not Started</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>

            <div className="flex justify-end mt-6">
              <button
                className="bg-yellow-500 text-white px-6 py-2 rounded-full font-medium hover:bg-yellow-600 transition-colors"
                onClick={() => setShowAddFileModal(false)}
              >
                Save Goal
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-yellow-300 flex-1 bg-yellow-50 p-6 overflow-y-auto flex flex-col rounded-lg shadow-sm">
          {openFile ? (
            /* Opened Goal Details */
            <div className="p-4 bg-white rounded-lg shadow-sm h-full flex flex-col">
              <h1 className="text-yellow-800 font-semibold mb-2 text-xl mt-2">
                {openFile.title || "Goal Title"}
              </h1>
              <p className="text-yellow-700 text-sm leading-relaxed mt-2">
                {openFile.description ||
                  "Describe your goal details here... (goal description, steps, or notes)"}
              </p>
              <div className="mt-auto flex justify-center items-center p-2">
                <button
                  className="mt-4 btn btn-ghost w-40 border border-yellow-500"
                  onClick={() => setOpenFile(null)}
                >
                  Back to Goals Overview
                </button>
              </div>
            </div>
          ) : (
            /* Goals Overview */
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-yellow-800">
                  Your Goals
                </h2>
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm hover:bg-yellow-600"
                  onClick={() => setShowAddFileModal(true)}
                >
                  + Add New Goal
                </button>
              </div>

              <ul className="space-y-3 overflow-y-scroll flex-1">
                {openFolder.items.length > 0 ? (
                  openFolder.items.map((goal, index) => (
                    <li
                      key={index}
                      onClick={() => setOpenFile(goal)}
                      className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:bg-yellow-100 transition-colors cursor-pointer"
                    >
                      <div className="flex flex-col">
                        <span className="text-yellow-800 font-medium">
                          {goal.fileName || "Untitled Goal"}
                        </span>
                        <p className="text-yellow-600 font-light text-sm italic">
                          {goal.text || "No details provided"}
                        </p>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-yellow-600 italic">
                    You haven’t added any goals yet.
                  </p>
                )}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default GoalsContent;
