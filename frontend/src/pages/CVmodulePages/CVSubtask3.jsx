// src/pages/CVModule/CVSubtask3.jsx
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { getSubtaskBySequenceNumber } from "../../utils/moduleHelpers";
import { useUserStore } from "../../store/user";

const CVSubtask3 = ({ onClose = () => {}, setIsSubmitted = () => {}, onTaskComplete}) => {
  const { completeTask } = useUserStore();
  const [downloading, setDownloading] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleComplete = async () => {
    try {
      const subtaskId = await getSubtaskBySequenceNumber("CV Builder", 1, 3);
      const res = await completeTask(subtaskId);
      if (res?.data?.message !== "Well Done! You completed the subtask") {
        toast.success("CV downloaded successfully!");
      } else {
        toast.success("CV downloaded successfully!");
        toast.success("Task 3 completed!");
      }

      setIsSubmitted(true);
      onTaskComplete?.();
      onClose(false, true);
    } catch (err) {
      console.error("Failed to complete Subtask 3:", err);
      toast.error("Could not complete task 3");
    }
  };

  const handlePreview = () => {
    try {
      window.open(`${BASE_URL}/users/me/cv/preview`, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error(err);
      toast.error("Failed to open preview");
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const res = await fetch(`${BASE_URL}/users/me/cv/download`, {
        credentials: "include"
      });
      if (!res.ok) throw new Error("Download failed");
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
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto relative">
      {/* Sticky header with Close */}
      <header className="sticky top-0 z-40 bg-white">
        <div className="mx-auto max-w-3xl w-full px-6 py-4 relative text-center">
          <button
            onClick={() => onClose?.()}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 text-xl"
            aria-label="Close"
          >
            ✖
          </button>

          <h2 className="text-center text-[32px] md:text-4xl font-extrabold text-[#4f9cf9]">
            Section 3: Review & Export
          </h2>
          <p className="text-sm font-semibold text-[#767687]">
            Your CV is ready — preview or download it
          </p>
        </div>
      </header>

      {/* Status card (subtle, optional) */}
      <div className="max-w-3xl mx-auto px-6 w-full mt-2">
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 text-center">
          <p className="text-sm font-semibold text-[#767687]">
            Looking great! When you’re happy, download your PDF.
          </p>
        </div>
      </div>

      {/* Actions – same button look as Section 1 */}
      <div className="px-6 pb-6 pt-4">
        <div className="mx-auto max-w-[680px] grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Preview (outlined) */}
          <button
            onClick={handlePreview}
            className="inline-flex items-center justify-center
            h-12 md:h-14 px-8 md:px-10 rounded-full
            bg-white border-2 border-[#4f9cf9]
            text-[#4f9cf9] font-extrabold
            hover:bg-[#4f9cf9]/5
            focus:outline-none focus:ring-2 focus:ring-[#4f9cf9]
            min-w-[200px]"
          >
            Preview my CV
          </button>

          {/* Download (solid) */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className={`inline-flex items-center justify-center
            h-12 md:h-14 px-8 md:px-10 rounded-full
            bg-[#4f9cf9] text-white 
            font-extrabold text-base md:text-lg
            shadow-sm hover:bg-[#4f9cf9]/90
            focus:outline-none focus:ring-2 focus:ring-[#4f9cf9]
            min-w-[200px] ${downloading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {downloading ? "Preparing PDF…" : "Download as PDF"}
          </button>
        </div>
      </div>

      {/* Gentle tip card */}
      <div className="max-w-3xl mx-auto px-6 w-full pb-6">
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
          <p className="text-orange-900 text-sm">
            <span className="font-bold">Tip:</span> Double-check contact details and dates. Keep an
            editable copy of your CV for quick updates later.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CVSubtask3;
