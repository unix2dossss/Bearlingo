import React, { useState, useEffect, useRef } from "react";
const stepTopRef = useRef(null);

// Scroll to the top of the step after it renders
useEffect(() => {
  const goTop = () => {
    // scroll the nearest scrollable ancestor (modal content) to the very top
    stepTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    // fallback in case window is the scroller
    window.requestAnimationFrame(() =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );
  };
  // wait a frame so the next step is mounted before scrolling
  const id = requestAnimationFrame(goTop);
  return () => cancelAnimationFrame(id);
}, [step]);
