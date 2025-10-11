// src/components/SubtaskInfoPopup.jsx
import React, { useRef } from "react";
import { Sparkles, Trophy, Star } from "lucide-react";
import Seeds from "../assets/Seeds.png";
import PlantGrow1 from "../assets/PlantGrow1.png";
import PlantGrow2 from "../assets/PlantGrow2.png";

export default function SubtaskInfoPopup({ subtask, taskNumber }) {
  const popupRef = useRef();

  if (!subtask) return null;

  // Decide which image to show based on task number
  let topImage;
  switch (taskNumber) {
    case 1:
      topImage = Seeds;
      break;
    case 2:
      topImage = PlantGrow1;
      break;
    case 3:
      topImage = PlantGrow2;
      break;
    default:
      topImage = Seeds; // fallback
  }

  return (
    <div
      ref={popupRef}
      className="absolute -top-96 left-1/2 -translate-x-1/2 w-80 max-w-sm z-50 pointer-events-auto animate-fade-in"
    >
      {/* half Rectangle behind the plant */}
      <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-full h-48 rounded-[2.5rem] bg-sky-100 border-8 border-blue-400" />

      {/* Plant at top */}
      <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-44">
        <img src={topImage} alt="Plant grow stages" className="w-full h-full object-contain" />
      </div>
      
      <div className="relative bg-sky-100 border-8 border-blue-400 rounded-[2.5rem] shadow-lg p-4 pt-12 filter drop-shadow-lg text-center">
        {/* Header Tab */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#2b1c15] text-blue-200 px-8 py-2 rounded-full border-4 border-blue-400 shadow-lg whitespace-nowrap">
          <h3 className="text-lg font-extrabold uppercase tracking-wider">{subtask.title}</h3>
        </div>

        {/* Description in a blue background */}
        <div className="bg-blue-200/70 rounded-2xl p-4 mb-6">
          <p className="text-blue-800 text-base font-medium min-h-[4rem] flex items-center justify-center">
            {subtask.description}
          </p>
        </div>

        {/* Rewards Badge */}
        <div className="inline-flex items-center gap-2 bg-yellow-400 text-yellow-900 font-bold px-6 py-3 rounded-full border-b-4 border-yellow-600 active:border-b-0 active:mt-1 shadow-sm transition-all">
          <Star className="w-5 h-5 text-yellow-700" />
          <span className="text-lg">XP: {subtask.xpReward}</span>
        </div>
      </div>
    </div>
  );
}
