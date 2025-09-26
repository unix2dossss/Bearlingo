import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { getSubtaskBySequenceNumber } from "../../utils/moduleHelpers";
import { useUserStore } from "../../store/user";
import FlashCard from "../../components/InterviewModuleComponents/FlashCard";

const COLORS = {
  primary: "#4f9cf9",
  primaryHover: "#3d86ea",
  textMuted: "#767687",
};

const cx = (...xs) => xs.filter(Boolean).join(" ");

/* Reusable button (compact, small) */
function ActionButton({
  children,
  onClick,
  variant = "solid", // 'solid' | 'outline'
  disabled = false,
  minWidth = 120,
  type = "button",
}) {
  const base =
    "inline-flex items-center justify-center h-10 px-5 rounded-full font-bold text-sm shadow-sm focus:outline-none focus:ring-2";
  const solid =
    "text-white bg-[#4f9cf9] hover:bg-[#3d86ea] focus:ring-[#4f9cf9]";
  const outline =
    "bg-white border-2 border-[#4f9cf9] text-[#4f9cf9] hover:bg-[#4f9cf9]/10 focus:ring-[#4f9cf9]";
  const disabledCls = "opacity-60 cursor-not-allowed";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cx(base, variant === "solid" ? solid : outline, disabled && disabledCls)}
      style={{ minWidth }}
    >
      {children}
    </button>
  );
}

export default function InterviewSubtask1({ setIsSubmitted, onClose }) {
  const questions = [
    { q: "Tell me about yourself", a: "I’m a Computer Science graduate with a strong foundation in software development, data structures, and databases. During my studies, I worked on several projects, including developing a full-stack web application and implementing algorithms to solve real-world problems. I’m passionate about learning new technologies and applying them to build practical, user-focused solutions." },
    { q: "What are your strengths?", a: "I would say my biggest strengths are problem-solving, adaptability, and collaboration. In team projects, I often take initiative to break down complex problems into smaller tasks, and I enjoy working with others to find efficient solutions. I’m also quick to learn new tools or frameworks when needed." },
    { q: "What are your weaknesses?", a: "At times, I can take on too many responsibilities because I want to contribute as much as possible. However, I’ve been working on improving my time management and learning how to delegate and prioritize tasks more effectively." },
    { q: "Why should we hire you?", a: "I bring both technical skills and a strong willingness to learn. My academic background gave me solid programming and analytical abilities, and my project work taught me how to collaborate effectively in teams. I’m confident I can quickly adapt to your environment and contribute value from day one." },
    { q: "Where do you see yourself in 5 years?", a: "In five years, I see myself growing into a senior developer or technical lead role, where I can mentor others and take on more responsibility for designing scalable and efficient solutions. I also want to continue expanding my skills and staying up to date with emerging technologies." },
    { q: "Tell me about a challenge you faced at work.", a: "In one of my group projects, we had to refactor a large piece of legacy code that was poorly documented. It was challenging because we had to balance fixing bugs with improving the structure. I suggested that we start by writing tests for the existing code to better understand its behavior, and that approach helped us confidently refactor the system without breaking functionality." },
    { q: "How do you handle stress?", a: "I stay organized by breaking tasks into smaller steps and prioritizing the most important ones. I also find that communicating with my teammates early helps avoid last-minute pressure. When I feel overwhelmed, I take short breaks to reset, which helps me stay focused and productive." },
    { q: "Why do you want to work here?", a: "I admire your company’s mission to deliver innovative software solutions and your culture of continuous learning. I’m excited by the opportunity to work with experienced professionals, grow my skills, and contribute to meaningful projects that make a real impact." },
  ];

  const total = questions.length;
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [subtaskAlreadyCompleted, setSubtaskAlreadyCompleted] = useState(false);
  const { completeTask } = useUserStore();

  // Warn on refresh/close if unfinished
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty && index < total - 1 && !subtaskAlreadyCompleted) {
        e.preventDefault();
        e.returnValue =
          "You haven't finished the interview practice. Are you sure you want to leave?";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, index, total, subtaskAlreadyCompleted]);

  const handleNext = async () => {
    if (index < total - 1) {
      setIndex((i) => i + 1);
      setFlipped(false);
      setIsDirty(true);
      return;
    }
    // Finish
    try {
      const subtaskId = await getSubtaskBySequenceNumber("Interview", 1, 1);
      const res = await completeTask(subtaskId);
      if (res?.data?.message === "Well Done! You completed the subtask") {
        toast.success("Task 1 completed!");
      }
      setSubtaskAlreadyCompleted(true);
      setIsSubmitted?.(true);
      setIsDirty(false);
      onClose?.(false, true);
    } catch (err) {
      console.error("Failed to complete subtask", err);
      toast.error("Could not mark task complete.");
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      setIndex((i) => i - 1);
      setFlipped(false);
    }
  };

  const handleReset = () => {
    setIndex(0);
    setFlipped(false);
    setIsDirty(false);
  };

  const handleLocalClose = () => {
    const hasChanges = isDirty && index < total - 1 && !subtaskAlreadyCompleted;
    onClose?.(hasChanges);
  };

  const progressPercentRaw = subtaskAlreadyCompleted ? 100 : ((index + 1) / total) * 100;
  const progressPercent = Math.min(100, Math.max(0, progressPercentRaw));

  return (
    <div className="relative flex flex-col h-full p-4">
      {/* Close button */}
      <button
        onClick={handleLocalClose}
        className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 text-xl"
        aria-label="Close"
        type="button"
      >
        ✖
      </button>

      {/* Progress */}
      <div className="w-full mt-8 mb-10 p-6">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-semibold text-gray-700">
            Progress {subtaskAlreadyCompleted ? total : index + 1} of {total}
          </span>
        </div>

        <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full transition-[width] duration-300 ease-in-out"
            style={{ width: `${progressPercent}%`, backgroundColor: COLORS.primary }}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progressPercent)}
            role="progressbar"
          />
        </div>
      </div>

      {/* Flashcard */}
      <div className="flex-1 flex items-center justify-center p-4">
        <FlashCard
          question={questions[index].q}
          answer={questions[index].a}
          flipped={flipped}
          onFlip={() => setFlipped((f) => !f)}
          questionNumber={index + 1}
        />
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3 mt-4">
        <ActionButton variant="outline" onClick={handlePrev} disabled={index === 0}>
          Previous
        </ActionButton>

        <ActionButton variant="outline" onClick={handleReset}>
          Reset
        </ActionButton>

        <ActionButton onClick={handleNext} disabled={subtaskAlreadyCompleted && index === total - 1}>
          {index === total - 1 ? "Finish" : "Next"}
        </ActionButton>
      </div>

      {/* Pro Tip */}
      <div className="mt-6 m-6 rounded-2xl border border-orange-200 bg-orange-50 p-4">
        <p className="text-orange-900 text-sm" style={{ color: COLORS }}>
          <span role="img" aria-label="light bulb">💡</span>{" "}
          <span className="font-semibold">Pro Tip:</span> Practice your answers out loud and
          personalize them to your experience. The best answers tell a story!
        </p>
      </div>
    </div>
  );
}
