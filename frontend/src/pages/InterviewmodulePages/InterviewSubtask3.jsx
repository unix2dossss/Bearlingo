
import React, { useEffect, useRef, useLayoutEffect, useState } from "react";
import api from "../../lib/axios";
import { toast } from "react-hot-toast";
import { getSubtaskBySequenceNumber } from "../../utils/moduleHelpers";
import { useUserStore } from "../../store/user";

const ACCENT = "#43a047"; // Interview theme color (green)

const InterviewSubtask3 = ({ isSubmitted, setIsSubmitted, onClose }) => {
  const [whatWentWell, setWhatWentWell] = useState("");
  const [whatWasDifficult, setWhatWasDifficult] = useState("");
  const [improvementPlan, setImprovementPlan] = useState("");

  // DB snapshots for unsaved-change detection
  const [dbWhatWentWell, setDbWhatWentWell] = useState("");
  const [dbWhatWasDifficult, setDbWhatWasDifficult] = useState("");
  const [dbImprovementPlan, setDbImprovementPlan] = useState("");

  // single scrollable area (uniform with Subtask 1)
  const contentRef = useRef(null);

  // ensure the scroll area starts at top on mount
  useLayoutEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "auto" });
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, []);



  // fetch existing reflection
  useEffect(() => {
    const fetchReflection = async () => {
      try {
        const res = await api.get("/users/me/interview/reflection-journal", {
          withCredentials: true
        });
        const data = res.data || {};

        setWhatWentWell(data.whatWentWell || "");
        setDbWhatWentWell(data.whatWentWell || "");
        setWhatWasDifficult(data.whatWasDifficult || "");
        setDbWhatWasDifficult(data.whatWasDifficult || "");

        setImprovementPlan(data.improvementPlan || "");
        setDbImprovementPlan(data.improvementPlan || "");
      } catch (err) {
        console.error("Failed to fetch reflection journal", err);
      }

    };
    fetchReflection();

  }, []);



  // warn before reload/close if not submitted
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



  // local close with unsaved changes check (uniform with CVSubtask1 local close)

  const handleLocalClose = () => {
    const hasChanges =
      whatWentWell !== dbWhatWentWell ||
      whatWasDifficult !== dbWhatWasDifficult ||
      improvementPlan !== dbImprovementPlan;
    onClose?.(hasChanges); // parent shows confirm if true
  };



  const handleClear = () => {
    setWhatWentWell("");
    setWhatWasDifficult("");
    setImprovementPlan("");
  };

  const isFormValid =
    whatWentWell.trim().length > 0 &&
    whatWasDifficult.trim().length > 0 &&
    improvementPlan.trim().length > 0;



  // complete task hook
  const { completeTask } = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      whatWentWell,
      whatWasDifficult,
      improvementPlan
    };



    try {
      const res = await api.post("/users/me/interview/reflection-journal", payload, {
        withCredentials: true
      });

      toast.success(res?.data?.message || "Reflection saved!");

      // refresh DB snapshots
      setDbWhatWentWell(whatWentWell);
      setDbWhatWasDifficult(whatWasDifficult);
      setDbImprovementPlan(improvementPlan);

      setIsSubmitted?.(true);
      onClose?.(false, true); // no unsaved changes, force close (same pattern as Subtask 1)



      // mark subtask complete

      try {
        const subtaskId = await getSubtaskBySequenceNumber("Interview", 1, 3);
        const done = await completeTask(subtaskId);
        if (done?.data?.message === "Well Done! You completed the subtask") {
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



  return (
  <div className="flex flex-col h-full">
    {/* Sticky white header (close only) */}
    <header className="sticky top-0 z-40 bg-white">
      <div className="mx-auto max-w-[880px] px-4 py-3 grid grid-cols-[auto_1fr_auto] items-center">
        <div className="min-w-[60px]"/><div/>
        <button
          onClick={handleLocalClose}
          className="text-gray-400 hover:text-gray-600 text-xl"
          aria-label="Close"
        >
          ✖
        </button>
      </div>
    </header>
    

    {/* The ONLY scrollable content area */}
    <div
      ref={contentRef}
      className="flex-1 overflow-y-auto"
      style={{ scrollbarGutter: "stable" }}
    >
      <form onSubmit={handleSubmit} className="mx-auto max-w-[680px] w-full p-6">
        {/* Heading BELOW the white bar*/}
        <div className="pt-4 pb-2 px-8 text-center">
          <h2
            className="text-center text-[32px] md:text-4xl font-extrabold "
            style={{ color: ACCENT }}
          >
            Reflection Journal
          </h2>
          <p className="text-sm font-semibold text-[#767687]">
            Capture your thoughts after an interview
          </p>
        </div>


        {/* Single card containing all fields */}
        <div className="mt-5 rounded-2xl border border-gray-300 bg-white p-6 md:p-7 shadow-sm space-y-5">
          {/* What went well */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              What went well? <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full min-h-[120px] rounded bg-gray-100 px-3 py-2 placeholder:text-gray-400 focus:outline-none focus:ring-2"
              style={{ borderColor: "transparent", outline: "none", boxShadow: `0 0 0 2px transparent` }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 2px ${ACCENT}55`)}
              onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
              value={whatWentWell}
              onChange={(e) => setWhatWentWell(e.target.value)}
              placeholder="Share what worked smoothly..."
            />
          </div>

          {/* What was difficult */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              What was difficult? <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full min-h-[120px] rounded bg-gray-100 px-3 py-2 placeholder:text-gray-400 focus:outline-none focus:ring-2"
              style={{ borderColor: "transparent", outline: "none", boxShadow: `0 0 0 2px transparent` }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 2px ${ACCENT}55`)}
              onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
              value={whatWasDifficult}
              onChange={(e) => setWhatWasDifficult(e.target.value)}
              placeholder="What challenges did you face?"
            />
          </div>

          {/* What to improve */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              What will I improve next time? <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full min-h-[120px] rounded bg-gray-100 px-3 py-2 placeholder:text-gray-400 focus:outline-none focus:ring-2"
              style={{ borderColor: "transparent", outline: "none", boxShadow: `0 0 0 2px transparent` }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 2px ${ACCENT}55`)}
              onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
              value={improvementPlan}
              onChange={(e) => setImprovementPlan(e.target.value)}
              placeholder="Your improvement plan..."
            />
          </div>
          </div>

        {/* Gentle tip card */}
        <div className="mt-4 max-w-3xl mx-auto px-6 w-full pb-6">
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
            <p className="text-orange-900 text-sm">
              <span className="font-bold">Tip:</span> Write immediately after the interview while
              details are fresh. Specifics help you improve faster.
            </p>
          </div>
        </div>
        </form>
        </div>

        {/* Buttons */}
        <div className="flex justify-between p-4">
          <div className="mx-auto max-w-[680px] grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center justify-center
              h-12 md:h-14 px-8 md:px-10 rounded-full
              bg-white border-2 border-[#43a047]
              text-[#43a047] font-extrabold
              hover:bg-[#43a047]/5
              focus:outline-none focus:ring-2 focus:ring-[#43a047]
              min-w-[200px]"
              style={{ borderColor: ACCENT, color: ACCENT, fontWeight: 800, minWidth: 200 }}
            >
              Clear
            </button>

            <button
              type="submit"
              disabled={!isFormValid}
               onClick={handleSubmit}
              className="inline-flex items-center justify-center h-12 md:h-14 px-8 md:px-10 rounded-full 
              text-white font-extrabold shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: ACCENT, minWidth: 200 }}
            >
              Update Reflection
            </button>
          </div>
        </div>
      </div>);
};

export default InterviewSubtask3;
