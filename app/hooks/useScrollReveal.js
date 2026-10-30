"use client";
import { useEffect } from "react";

export default function useScrollReveal(ref) {
  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("aos-animate");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );

    ref.current.querySelectorAll("[data-aos]").forEach((el) => observer.observe(el));

    return () => observer.disconnect(); // cleanup
  }, [ref]);
}