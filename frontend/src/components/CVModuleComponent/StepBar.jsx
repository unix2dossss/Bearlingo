import React from "react";


export default function StepsBar({
  steps = ["Personal information", "Secondary Education", "Tertiary Education", "About me"],
  current = 0,
  onStepChange = () => {},
  onClose = () => {},
}) {
  return (
    <div className="flex items-center gap-3 w-full select-none">
      {/* X button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="text-2xl leading-none text-gray-700 hover:text-gray-900 px-2"
      >
        ×
      </button>

      {/* Segmented bar */}
      <div className="flex-1 grid grid-cols-4 gap-6">
        {steps.map((label, i) => {
          const isActiveOrDone = i <= current;
          return (
            <button
              key={label}
              type="button"
              title={label}
              aria-label={label}
              aria-current={i === current ? "step" : undefined}
              onClick={() => onStepChange(i)}
              className={[
                "h-2 w-full rounded-full transition-colors",
                isActiveOrDone ? "bg-[#4f9cf9]" : "bg-blue-200 hover:bg-blue-300",
                "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#4f9cf9]",
              ].join(" ")}
            />
          );
        })}
      </div>
    </div>
  );
}
