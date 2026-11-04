"use client";
import { useState, useEffect, useRef } from "react";
import { usePdfModal } from "./PdfModal/PdfModalProvider";

const TEXTS = [
  "Computer Engineer",
  "Problem Solver",
  "Tech Enthusiast",
  "Creative Thinker",
];


export default function Hero() {

    // TYPEWRITER EFFECT
    const [textIndex, setTextIndex] = useState(0);
    const [displayed, setDisplayed] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const dialogRef = useRef(null);
    const { openPdf } = usePdfModal();

    useEffect(() => {
        const current = TEXTS[textIndex];

        let delay = isDeleting ? 50 : 150;
        if (!isDeleting && displayed === current) delay = 2000; // pause at end
        else if (isDeleting && displayed === "") delay = 500;   // pause before next word

        const timer = setTimeout(() => {
        if (!isDeleting && displayed === current) {
            setIsDeleting(true);
        } else if (isDeleting && displayed === "") {
            setIsDeleting(false);
            setTextIndex((textIndex + 1) % TEXTS.length);
        } else if (isDeleting) {
            setDisplayed(current.slice(0, displayed.length - 1));
        } else {
            setDisplayed(current.slice(0, displayed.length + 1));
        }
        }, delay);

        return () => clearTimeout(timer); // cleanup, like dispose()
    }, [displayed, isDeleting, textIndex]);


    // PARALLAX EFFECT
    const heroRef = useRef(null);

    useEffect(() => {
        const onScroll = () => {
        const scrolled = window.pageYOffset;
        const elements = heroRef.current.querySelectorAll("[data-speed]");
        elements.forEach((el) => {
            const speed = el.getAttribute("data-speed");
            el.style.transform = `translateY(${-(scrolled * speed)}px)`;
        });
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <section id="home" className="hero-section" ref={heroRef}>
        {/* Parallax Background Layers */}
            <div className="parallax-layer layer-1" data-speed="0.5"></div>
            <div className="parallax-layer layer-2" data-speed="0.3"></div>
            <div className="parallax-layer layer-3" data-speed="0.1"></div>
                
            <div className="container hero-container">
                <div className="hero-content">
                    <div className="hero-text">
                        <span className="hero-greeting">Hello, I'm</span>
                        <h1 className="hero-name">
                            Heeta <span className="accent">Bhanushali</span>
                        </h1>
                        <div className="hero-title">
                            <span className="typing-text">
                                I&apos;m a <span className="dynamic-text" id="dynamicText">{displayed}</span>
                            </span>
                        </div>
                        <p className="hero-description">
                            Passionate about creating innovative solutions and exploring cutting-edge technologies.
                            Currently pursuing Software Systems Engineering at RWTH Aachen.
                        </p>
                        <div className="hero-cta">
                            <button className="btn btn-primary" onClick={() => openPdf({ title: "My Resume", url: "/Heeta_Bhanushali_Resume.pdf" })}>
                                <i className="fas fa-download"></i> Download Resume
                            </button>
                            <button className="btn btn-secondary" onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}>
                                <i className="fas fa-folder"></i> View Projects
                            </button>
                        </div>
                    </div>
                    <div className="hero-visual">
                        {/* Animated SVG or 3D element will go here */}
                        <div className="floating-icons">
                            <i className="devicon-flutter-plain tech-icon" data-speed="1.5"></i>
                            <i className="devicon-python-plain tech-icon" data-speed="1"></i>
                            <i className="devicon-javascript-plain tech-icon" data-speed="1.3"></i>
                            <i className="devicon-cplusplus-plain tech-icon" data-speed="0.8"></i>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}