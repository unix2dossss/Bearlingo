import React from "react";

export default function ProgressPills({ step = 0 }) {
  const dot = (active) =>
    `h-5 w-28 rounded-full ${active ? "bg-[#4f9cf9]" : "bg-blue-200"}`;
  return (
    <div className="flex items-center justify-center gap-3 mb-3">
      <div className={dot(step >= 0)} />
      <div className={dot(step >= 1)} />
      <div className={dot(step >= 2)} />
    </div>
  );
}
