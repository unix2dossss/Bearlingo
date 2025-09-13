import React, { useState, useEffect } from "react";
import api from "../../lib/axios";
import { toast } from "react-hot-toast";
import { getSubtaskBySequenceNumber } from "../../utils/moduleHelpers";
import { useUserStore } from "../../store/user";

const InterviewSubtask3 = ({ isSubmitted, setIsSubmitted, onClose }) => {
  const [whatWentWell, setWhatWentWell] = useState("");
  const [whatWasDifficult, setWhatWasDifficult] = useState("");
  const [improvementPlan, setImprovementPlan] = useState("");

  // Snapshots of DB data for change detection
  const [dbWhatWentWell, setDbWhatWentWell] = useState("");
  const [dbWhatWasDifficult, setDbWhatWasDifficult] = useState("");
  const [dbImprovementPlan, setDbImprovementPlan] = useState("");

  // Fetch existing reflection journal data
  useEffect(() => {
    const fetchReflection = async () => {
      try {
        const res = await api.get("/users/me/interview/reflection-journal", {
          withCredentials: true
        });
        const data = res.data;

        if (data) {
          setWhatWentWell(data.whatWentWell || "");
          setDbWhatWentWell(data.whatWentWell || "");

          setWhatWasDifficult(data.whatWasDifficult || "");
          setDbWhatWasDifficult(data.whatWasDifficult || "");

          setImprovementPlan(data.improvementPlan || "");
          setDbImprovementPlan(data.improvementPlan || "");
        }
      } catch (err) {
        console.error("Failed to fetch reflection journal", err);
      }
    };

    fetchReflection();
  }, []);

  // Warn before reload/close browser
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isSubmitted) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave this page?";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isSubmitted]);

  // Clear all fields
  const handleClear = () => {
    setWhatWentWell("");
    setWhatWasDifficult("");
    setImprovementPlan("");
  };

  // Check if form valid
  const isFormValid = whatWentWell.trim() && whatWasDifficult.trim() && improvementPlan.trim();

  // Secnding reflection journal data to backend
  const { completeTask } = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      whatWentWell,
      whatWasDifficult,
      improvementPlan
    };

    try {
      // Save reflection
      const res = await api.post("/users/me/interview/reflection-journal", payload, {
        withCredentials: true
      });
      toast.success(res.data.message || "Reflection saved!");

      // Update DB snapshot after successful save
      setDbWhatWentWell(whatWentWell);
      setDbWhatWasDifficult(whatWasDifficult);
      setDbImprovementPlan(improvementPlan);

      setIsSubmitted(true);
      onClose(false, true); // no unsaved changes, force close

      // Get subtaskId by module name, level number and subtask sequence number
      let subtaskId;
      try {
        subtaskId = await getSubtaskBySequenceNumber("Interview", 1, 3);
      } catch (err) {
        console.error("Failed to get subtask ID", err);
        toast.error("Could not find subtask");
        return;
      }

      // Mark subtask as completed
      try {
        const res = await completeTask(subtaskId);
        if (res.data.message === "Well Done! You completed the subtask") {
          toast.success("Task 3 completed!");
        }
      } catch (err) {
        console.error("Failed to complete task", err);
        toast.error("Could not mark task complete");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving reflection!");
    }
  };

  // Local Close with unsaved-changes check
  const handleLocalClose = () => {
    const hasChanges =
      whatWentWell !== dbWhatWentWell ||
      whatWasDifficult !== dbWhatWasDifficult ||
      improvementPlan !== dbImprovementPlan;

    onClose(hasChanges);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Right: Close */}
      <button
        onClick={handleLocalClose}
        className="absolute top-2 right-2 p-4 text-gray-400 hover:text-gray-600 text-xl"
        aria-label="Close"
      >
        ✖
      </button>
      <form onSubmit={handleSubmit} className="mx-auto max-w-[680px] w-full space-y-6 p-6">
        <h2 className="text-2xl font-bold text-center text-[#4f9cf9]">Reflection Journal</h2>

        <div className="form-control">
          <label className="label font-semibold">What went well?</label>
          <textarea
            className="textarea textarea-bordered h-32 resize-none"
            value={whatWentWell}
            onChange={(e) => setWhatWentWell(e.target.value)}
            placeholder="Share what worked smoothly..."
          />
        </div>

        <div className="form-control">
          <label className="label font-semibold">What was difficult?</label>
          <textarea
            className="textarea textarea-bordered h-32 resize-none"
            value={whatWasDifficult}
            onChange={(e) => setWhatWasDifficult(e.target.value)}
            placeholder="What challenges did you face?"
          />
        </div>

        <div className="form-control">
          <label className="label font-semibold">What will I improve next time?</label>
          <textarea
            className="textarea textarea-bordered h-32 resize-none"
            value={improvementPlan}
            onChange={(e) => setImprovementPlan(e.target.value)}
            placeholder="Your improvement plan..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <button
            type="button"
            className="inline-flex items-center justify-center
              h-12 md:h-14 px-8 md:px-10 rounded-full
              bg-white border-2 border-[#4f9cf9]
              text-[#4f9cf9] font-extrabold
              hover:bg-[#4f9cf9]/5
              focus:outline-none focus:ring-2 focus:ring-[#4f9cf9]
              min-w-[200px]"
            onClick={handleClear}
          >
            Clear
          </button>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`inline-flex items-center justify-center
              h-12 md:h-14 px-8 md:px-10 rounded-full
              bg-[#4f9cf9] text-white 
              font-extrabold text-base md:text-lg
              shadow-sm hover:bg-[#4f9cf9]/90
              focus:outline-none focus:ring-2 focus:ring-[#4f9cf9]
              min-w-[200px] ${!isFormValid ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            Update Reflection
          </button>
        </div>
      </form>
    </div>
  );
};

export default InterviewSubtask3;
