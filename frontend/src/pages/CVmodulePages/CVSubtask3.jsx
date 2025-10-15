// src/pages/CVModule/CVSubtask3.jsx
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { getSubtaskBySequenceNumber } from "../../utils/moduleHelpers";
import { useUserStore } from "../../store/user";
import CVAnalyse from "../../components/CVModuleComponent/CVAnalyse";

const COLORS = {
  primary: "#4f9cf9",
  primaryHover: "#3d86ea",
  textMuted: "#767687"
};

const SIZING = {
  panelMaxW: "max-w-3xl",
  panelHPx: 700
};

const BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const ENDPOINTS = {
  preview: `${BASE}/users/me/cv/preview`,
  download: `${BASE}/users/me/cv/download`
};

/* Small utility */
const cx = (...classes) => classes.filter(Boolean).join(" ");

/* Reusable Button */
function ActionButton({
  children,
  variant = "solid", // 'solid' | 'outline'
  disabled = false,
  onClick,
  minWidth = 200,
  ariaBusy = false
}) {
  const base =
    "inline-flex items-center justify-center h-12 md:h-14 px-8 md:px-10 rounded-full font-extrabold text-base md:text-lg shadow-sm focus:outline-none focus:ring-2";
  const solid = `text-white bg-[${COLORS.primary}] hover:bg-[${COLORS.primaryHover}] focus:ring-[${COLORS.primary}]`;
  const outline = `bg-white border-2 border-[${COLORS.primary}] text-[${COLORS.primary}] hover:bg-[${COLORS.primary}]/5 focus:ring-[${COLORS.primary}]`;
  const disabledCls = "opacity-65 cursor-not-allowed";

  // NOTE: If your Tailwind build doesn't safelist arbitrary color classes with template strings,
  // replace the dynamic classes above with static ones like: bg-[#4f9cf9] etc.
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-busy={ariaBusy || undefined}
      className={cx(base, variant === "solid" ? solid : outline, disabled ? disabledCls : "")}
      style={{ minWidth }}
    >
      {children}
    </button>
  );
}

const CVSubtask3 = ({ onClose = () => {}, setIsSubmitted = () => {}, onTaskComplete }) => {
  const { completeTask } = useUserStore();
  const [downloading, setDownloading] = useState(false);

  /* ─────────────────────────────
   * Actions
   * ───────────────────────────── */
  const handleComplete = async () => {
    const subtaskId = await getSubtaskBySequenceNumber("CV Builder", 1, 3);
    const res = await completeTask(subtaskId);

    toast.success("CV downloaded successfully!");
    if (res?.data?.message === "Well Done! You completed the subtask") {
      toast.success("Task 3 completed!");
    }

    setIsSubmitted(true);
    onTaskComplete?.();
    onClose(false, true); // force-close, bypass confirm
  };

  const handlePreview = async () => {
    try {
      // const win = window.open(ENDPOINTS.preview, "_blank", "noopener,noreferrer");
      // if (!win) throw new Error("Popup blocked");
      window.open(ENDPOINTS.preview, "_blank", "noopener,noreferrer");
      await handleComplete();
    } catch (err) {
      console.error(err);
      toast.error("Failed to open preview");
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const res = await fetch(ENDPOINTS.download, { credentials: "include" });
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "MyCV.pdf";
      a.click();
      URL.revokeObjectURL(url);

      await handleComplete();
    } catch (err) {
      console.error(err);
      toast.error("Failed to download CV");
      setDownloading(false); // allow retry if complete() didn't run
    }
  };

  // Sound Effect
  const playClickSound = () => {
  const audio = new Audio("/sounds/mouse-click-290204.mp3");
  audio.currentTime = 0; // rewind to start for rapid clicks
  audio.play();
  };
  return (
    <div className="flex flex-col h-full overflow-y-auto relative">
      {/* Sticky header with Close */}
      <header className="sticky top-0 z-40 bg-white">
        <div className={cx("w-full px-6 py-4 relative text-center", SIZING.panelMaxW, "mx-auto")}>
          <button
            onClick={() => onClose?.()}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 text-xl"
            aria-label="Close"
            type="button"
          >
            ✖
          </button>

          <h2
            className="text-center text-[32px] md:text-4xl font-extrabold"
            style={{ color: COLORS.primary }}
          >
            Section 3: Review &amp; Export
          </h2>
          <p className="text-sm font-semibold" style={{ color: COLORS.textMuted }}>
            Your CV is ready — preview or download it
          </p>
        </div>
      </header>

      {/* Status card */}
      <div className={cx("px-6 w-full mt-2", SIZING.panelMaxW, "mx-auto")}>
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 text-center">
          <p className="text-sm font-semibold" style={{ color: COLORS.textMuted }}>
            Looking great! When you’re happy, download your PDF.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 pb-6 pt-4">
        <div className="mx-auto max-w-[680px] grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ActionButton variant="outline" onClick={() => { playClickSound(); handlePreview();}}>
            Preview my CV
          </ActionButton>

          <ActionButton
            variant="solid"
            onClick={() => { playClickSound(); handleDownload(); }}
            disabled={downloading}
            ariaBusy={downloading}
          >
            {downloading ? "Preparing PDF…" : "Download as PDF"}
          </ActionButton>
        </div>
      </div>

      {/* Tip card */}
      <div className={cx("px-6 w-full pb-6", SIZING.panelMaxW, "mx-auto")}>
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
          <p className="text-sm text-orange-900">
            <span className="font-bold">Tip:</span> Double-check contact details and dates. Keep an
            editable copy of your CV for quick updates later.
          </p>
        </div>
      </div>
      <CVAnalyse onTaskComplete={onTaskComplete} setIsSubmitted={setIsSubmitted} />
    </div>
  );
};

export default CVSubtask3;
