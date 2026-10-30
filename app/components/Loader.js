"use client";
import { useState, useEffect } from "react";

export default function Loader() {
  const [hidden, setHidden] = useState(false);   // starts the fade-out
  const [removed, setRemoved] = useState(false); // removes it from the page

  // 1. Hide the loader 500ms after the page has loaded
  useEffect(() => {
    let timer;
    const hide = () => {
      timer = setTimeout(() => setHidden(true), 500);
    };

    if (document.readyState === "complete") {
      hide(); // page already loaded before React started
    } else {
      window.addEventListener("load", hide);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", hide);
    };
  }, []);

  // 2. After the fade-out finishes, remove the loader completely
  useEffect(() => {
    if (!hidden) return;
    const timer = setTimeout(() => setRemoved(true), 400);
    return () => clearTimeout(timer);
  }, [hidden]);

  if (removed) return null; // draws nothing

  return (
    <div id="loader" className={hidden ? "loader hidden" : "loader"}>
      <div className="loader-content">
        <div className="loader-spinner"></div>
        <p className="loader-text">Loading...</p>
      </div>
    </div>
  );
}