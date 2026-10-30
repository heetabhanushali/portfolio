"use client";
import { useEffect } from "react";
import MiniHeetaPiskel from "../lib/MiniHeetaPiskel";

export default function MiniHeeta() {
  useEffect(() => {
    let heeta;

    const timer = setTimeout(() => {
      heeta = new MiniHeetaPiskel();
      window.miniHeeta = heeta; // Contact.js calls this
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (heeta) {
        heeta.destroy();
        if (window.miniHeeta === heeta) delete window.miniHeeta;
      }
    };
  }, []);

  return null;
}