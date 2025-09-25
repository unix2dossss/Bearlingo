import React, { useState, useEffect } from "react";
import Navbar from '../../components/TopNavbar';
import ConfirmLeaveDialog from "../../components/ConfirmLeaveDialog";
import { useUserStore } from "../../store/user";
import { useNavigate } from "react-router-dom";

import NetworkingSubtask1 from "./NetworkingSubtask1";
import NetworkingSubtask2 from "./NetworkingSubtask2";
import NetworkingSubtask3 from "./NetworkingSubtask3";
import Floor from "../../assets/CVFloor.svg"; 

const NetworkingModule = () => {
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
        navigate("/login");
      }
    };
    fetchUserData();
  }, [navigate, user]);

  const handleSubtaskClick = (task) => {
    setSelectedSubtask(task);
    setShowSubtask(true);
  };

  const handleClose = (hasChanges, force = false) => {
    if (force) {
      setShowSubtask(false);
      setSelectedSubtask(null);
      return;
    }
    if (hasChanges) {
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
    setIsSubmitted(false);
  };

  const renderSubtask = () => {
    switch (selectedSubtask) {
      case "subtask1":
        return (
          <NetworkingSubtask1
            isSubmitted={isSubmitted}
            setIsSubmitted={setIsSubmitted}
            onClose={handleClose}
          />
        );
      case "subtask2":
        return (
          <NetworkingSubtask2
            isSubmitted={isSubmitted}
            setIsSubmitted={setIsSubmitted}
            onClose={handleClose}
          />
        );
      case "subtask3":
        return (
          <NetworkingSubtask3
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
          backgroundImage: `url(${Floor})`,
        }}
      />

      {/* Top Navbar */}
      <div className="fixed top-0 inset-x-0 z-[100]">
        <Navbar />
      </div>

      {/* Task Buttons */}
      <div className="relative z-10 flex-1 flex flex-col justify-end items-center pb-10">
        <div className="flex space-x-48 mb-[51px]">
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

      {/* Subtask Modal */}
      {showSubtask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl relative h-[700px] flex flex-col border-4 border-[#4f9cf9]">
            <div className="overflow-y-auto pr-2">{renderSubtask()}</div>
          </div>
        </div>
      )}

      {/* Confirm Leave Dialog */}
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

export default NetworkingModule;
