import React from "react";

const InterviewSubtask1 = ({ onClose }) => {
  // Close button handler with ConfirmLeave logic
  const handleLocalClose = () => {
    const hasChanges = false;
    onClose(hasChanges, true);
  };
  return (
    <div className="p-4">
      {/* Right: Close */}
      <button
        onClick={handleLocalClose}
        className="absolute top-2 right-2 p-4 text-gray-400 hover:text-gray-600 text-xl"
        aria-label="Close"
      >
        ✖
      </button>
    </div>
  );
};

export default InterviewSubtask1;
