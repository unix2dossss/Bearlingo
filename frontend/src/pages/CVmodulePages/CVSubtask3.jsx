import React from "react";
import { toast } from "react-hot-toast";
import { getSubtaskBySequenceNumber } from "../../utils/moduleHelpers";
import { useUserStore } from "../../store/user";

const CVSubtask3 = ({ onClose, setIsSubmitted }) => {
  const { completeTask } = useUserStore();

  const handleComplete = async () => {
    try {
      // Get subtaskId for CV Builder level 1, sequence 3
      const subtaskId = await getSubtaskBySequenceNumber("CV Builder", 1, 3);
      const res = await completeTask(subtaskId);
      if (res) {
        toast.success(res.data.message);
      } else {
        toast.success("Well Done! You completed the subtask!");
      }
      
      setIsSubmitted(true);
      onClose(true); // force close modal
    } catch (err) {
      console.error("Failed to complete Subtask 3:", err);
      toast.error("Could not complete task 3");
    }
  };
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handlePreview = () => {
    window.open(`${BASE_URL}/users/me/cv/preview`, "_blank");
  };

  const handleDownload = async () => {
    try {
      const res = await fetch(`${BASE_URL}/users/me/cv/download`, {
        credentials: "include"
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "MyCV.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
      await handleComplete();
    } catch (err) {
      console.error(err);
      toast.error("Failed to download CV");
    }
  };

  return (
    <div className="card bg-neutral text-neutral-content w-full max-w-lg mx-auto">
      <div className="card-body items-center text-center">
        <h2 className="card-title">Your CV is ready for the world! 🎉</h2>
        <p className="mt-2">Choose what you want to do with it:</p>
        <div className="card-actions justify-center mt-6 gap-4">
          <button className="btn btn-primary" onClick={handlePreview}>
            Preview My CV
          </button>
          <button className="btn btn-ghost" onClick={handleDownload}>
            Download as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default CVSubtask3;
