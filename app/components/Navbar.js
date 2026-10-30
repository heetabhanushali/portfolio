"use client";
import { useState, useEffect, useRef } from "react";

const LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "research", label: "Research" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [theme, setTheme] = useState("light");

  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  const closeMenu = () => setMenuOpen(false);

  // ---------- Theme ----------
  const applyTheme = (value) => {
    document.documentElement.setAttribute("data-theme", value);
    localStorage.setItem("theme", value);
    setTheme(value);
  };

  const toggleTheme = () => {
    // read the real current value, so the keyboard shortcut never uses stale state
    const current = document.documentElement.getAttribute("data-theme") || "light";
    applyTheme(current === "light" ? "dark" : "light");
  };

  // load the saved theme once on startup
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", saved);
    setTheme(saved);
  }, []);

  // ---------- Scroll: navbar style + active link ----------
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 100);

      let current = "home";
      document.querySelectorAll("section[id]").forEach((section) => {
        const top = section.getBoundingClientRect().top + y;
        if (y >= top - 200) current = section.id;
      });
      setActive(current);
    };

    onScroll(); // run once on load
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ---------- Lock page scroll while the mobile menu is open ----------
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // ---------- Close menu on outside click ----------
  useEffect(() => {
    const onClick = (e) => {
      if (!menuRef.current?.contains(e.target) && !toggleRef.current?.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // ---------- Keyboard shortcuts ----------
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);

      const typing = e.target.matches?.("input, textarea");
      const hasModifier = e.metaKey || e.ctrlKey || e.altKey;
      if ((e.key === "t" || e.key === "T") && !typing && !hasModifier) toggleTheme();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <nav className={scrolled ? "navbar scrolled" : "navbar"}>
      <div className="nav-container">
        <div className="nav-logo">
          <span className="logo-text">
            HB<span className="logo-dot">.</span>
          </span>
        </div>

        <ul className={menuOpen ? "nav-menu active" : "nav-menu"} ref={menuRef}>
          {LINKS.map((link) => (
            <li className="nav-item" key={link.id}>
              <a
                href={`#${link.id}`}
                className={active === link.id ? "nav-link active" : "nav-link"}
                onClick={closeMenu}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            <i className={theme === "light" ? "fas fa-moon" : "fas fa-sun"}></i>
          </button>

          <button
            className={menuOpen ? "nav-toggle active" : "nav-toggle"}
            ref={toggleRef}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </div>
    </nav>
  );
}