import React from "react";
import "./FlashCard.css"; // add CSS for flip

const FlashCard = ({ question, answer, flipped, onFlip, questionNumber }) => {
  return (
    <div className="w-full max-w-xl h-64 cursor-pointer perspective" onClick={onFlip}>
      <div className={`card-inner ${flipped ? "flipped" : ""}`}>
        <div className="card-front">
          <p className="text-xl font-bold">Question {questionNumber}</p>
          <p className="mt-3 text-lg">{question}</p>
          <span className="absolute bottom-3 right-3 text-sm opacity-80">Click to flip</span>
        </div>
        <div className="card-back">
          <p className="text-xl font-bold">Answer</p>
          <p className="mt-3 text-lg">{answer}</p>
          <span className="absolute bottom-3 right-3 text-sm opacity-80">Click to flip back</span>
        </div>
      </div>
    </div>
  );
};

export default FlashCard;
