import React from "react";

export default function ProgressPills({ step = 0 }) {
  const dot = (active) =>
    `h-2 w-28 rounded-full ${active ? "bg-[#4f9cf9]" : "bg-blue-200"}`;
  return (
    <div className="inline-flex items-center gap-3">
      <div className={dot(step >= 0)} />
      <div className={dot(step >= 1)} />
      <div className={dot(step >= 2)} />
      <div className={dot(step >= 3)} />
    </div>
  );
}
