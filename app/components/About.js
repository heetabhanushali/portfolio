"use client";
import { useState, useRef } from "react";
import aboutData from "../data/about.json";
import useScrollReveal from "../hooks/useScrollReveal";
import { usePdfModal } from "./PdfModal/PdfModalProvider";

const TABS = [
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "experience", label: "Experience" },
  { id: "certificates", label: "Certificates" },
];

// "frameworks & tools" -> "Frameworks & Tools"
function formatCategoryName(key) {
  return key
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/* ---------- small components, one per tab ---------- */

function Skills({ skills }) {
  return (
    <div className="skills-grid">
      {Object.keys(skills).map((category) => (
        <div className="skill-category" key={category}>
          <h3>{formatCategoryName(category)}</h3>
          <div className="skill-tags">
            {skills[category].map((item) => (
              <span className="skill-tag" key={item}>{item}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Education({ education }) {
  return (
    <div className="education-list">
      {education.map((item, i) => (
        <div className="education-item" key={i}>
          <div className="education-header">
            <h3 className="education-degree">{item.degree}</h3>
            <span className="education-year">{item.year}</span>
          </div>
          <p className="education-institution">
            {item.link ? (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="education-institution-link"
              >
                {item.institution}
              </a>
            ) : (
              <span>{item.institution}</span>
            )}
          </p>
          <p className="education-location">{item.location}</p>
          <span className="education-score">{item.score}</span>
        </div>
      ))}
    </div>
  );
}

function ExperienceItem({ item }) {
  return (
    <div className="experience-item">
      <div className="experience-header">
        <h3 className="experience-position">{item.position}</h3>
        <span className="experience-year">{item.year}</span>
      </div>
      <p className="experience-organization">{item.organization}</p>

      {Array.isArray(item.description) ? (
        <ul className="experience-description-list">
          {item.description.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      ) : (
        item.description && <p className="experience-description">{item.description}</p>
      )}
    </div>
  );
}

function ExperienceGroup({ title, items }) {
  if (!items || items.length === 0) return null; // renders nothing
  return (
    <div className="experience-section">
      <h3 className="experience-section-title">{title}</h3>
      <div className="experience-list">
        {items.map((item, i) => (
          <ExperienceItem item={item} key={i} />
        ))}
      </div>
    </div>
  );
}

function Experience({ experience }) {
  return (
    <>
      <ExperienceGroup title="Internships" items={experience.internships} />
      <ExperienceGroup title="Positions of Responsibility" items={experience.positions} />
    </>
  );
}

function Certificates({ certificates, onOpen }) {
  return (
    <ul className="certificate-list">
      {certificates.map((cert) => (
        <li className="certificate-item" key={cert.name}>
          <a
            href="#"
            className="certificate-link"
            onClick={(e) => {
              e.preventDefault(); // replaces "return false"
              onOpen(cert);
            }}
          >
            <div className="certificate-info">
              <span className="certificate-name">{cert.name}</span>
              <span className="certificate-platform">{cert.platform}</span>
            </div>
            <i className="fas fa-arrow-right certificate-arrow"></i>
          </a>
        </li>
      ))}
    </ul>
  );
}

/* ---------- main component ---------- */

export default function About() {
  const [activeTab, setActiveTab] = useState("skills");
  const sectionRef = useRef(null);
  const { openPdf } = usePdfModal();

  useScrollReveal(sectionRef);

  return (
    <section id="about" className="about-section" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title" data-aos="fade-up">About Me</h2>
          <p className="section-subtitle" data-aos="fade-up">
            Turning ideas into code, one project at a time.
          </p>
        </div>

        <div className="about-content" data-aos="fade-up">
          {/* Tab Navigation */}
          <div className="tab-nav">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={activeTab === tab.id ? "tab-btn active" : "tab-btn"}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content: only the active pane exists */}
          <div className="tab-content">
            <div className="tab-pane active" key={activeTab}>
              {activeTab === "skills" && <Skills skills={aboutData.skills} />}
              {activeTab === "education" && <Education education={aboutData.education} />}
              {activeTab === "experience" && <Experience experience={aboutData.experience} />}
              {activeTab === "certificates" && (
                <Certificates certificates={aboutData.certificates} onOpen={(cert) => openPdf({ title: cert.name, subtitle: cert.platform, url: cert.link })}/>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}