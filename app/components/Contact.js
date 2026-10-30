"use client";
import { useState, useRef, useEffect } from "react";
import useScrollReveal from "../hooks/useScrollReveal";

const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

export default function Contact() {
  // type: "idle" | "sending" | "success" | "error"
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const sectionRef = useRef(null);
  useScrollReveal(sectionRef);

  // hide the success/error message after 5 seconds
  useEffect(() => {
    if (status.type !== "success" && status.type !== "error") return;
    const timer = setTimeout(() => setStatus({ type: "idle", message: "" }), 5000);
    return () => clearTimeout(timer);
  }, [status]);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget; // save it: currentTarget is gone after an await
    const json = JSON.stringify(Object.fromEntries(new FormData(form)));

    setStatus({ type: "sending", message: "Sending message..." });

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: json,
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      setStatus({ type: "success", message: "✓ Message sent successfully!" });
      form.reset();

      // Mini-Heeta isn't converted yet, so this safely does nothing for now
      window.miniHeeta?.celebrateFormSubmit?.();
    } catch (error) {
      setStatus({ type: "error", message: "✗ " + error.message });
    }
  }

  const resultClass =
    status.type === "success" || status.type === "error"
      ? `form-result ${status.type}`
      : "form-result";

  return (
    <section id="contact" className="contact-section" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title" data-aos="fade-up">Get In Touch</h2>
        </div>

        <div className="contact-content">
          <div className="contact-info" data-aos="fade-right">
            <h3>Let&apos;s Connect!</h3>
            <p>
              I&apos;m always interested in hearing about new opportunities and
              interesting projects.
            </p>

            <div className="contact-links">
              <a href="mailto:heetabhanushali@gmail.com" className="contact-link">
                <i className="fas fa-envelope"></i>
                <span>heetabhanushali@gmail.com</span>
              </a>
              <a href="tel:+918591156784" className="contact-link">
                <i className="fas fa-phone"></i>
                <span>+91 8591156784</span>
              </a>
              <a href="https://github.com/heetabhanushali" target="_blank"
                 rel="noopener noreferrer" className="contact-link">
                <i className="fab fa-github"></i>
                <span>GitHub</span>
              </a>
              <a href="https://www.linkedin.com/in/heetabhanushali" target="_blank"
                 rel="noopener noreferrer" className="contact-link">
                <i className="fab fa-linkedin"></i>
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          <div className="contact-form" data-aos="fade-left">
            <form onSubmit={handleSubmit} autoComplete="off">
              <input type="hidden" name="access_key" value={ACCESS_KEY} />

              <div className="form-group">
                <input type="text" name="name" placeholder=" " autoComplete="off" id="name" required />
                <label htmlFor="name">Your Name</label>
              </div>
              <div className="form-group">
                <input type="email" name="email" placeholder=" " autoComplete="off" id="email" required />
                <label htmlFor="email">Your Email</label>
              </div>
              <div className="form-group">
                <textarea name="message" placeholder=" " autoComplete="off" id="message" rows={5} required />
                <label htmlFor="message">Your Message</label>
              </div>

              <button type="submit" className="btn btn-primary" disabled={status.type === "sending"}>
                Send Message <i className="fas fa-paper-plane"></i>
              </button>

              {status.type !== "idle" && <div className={resultClass}>{status.message}</div>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}