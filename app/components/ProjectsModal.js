"use client";
import { useEffect } from "react";
import TechBadge from "./TechBadge";

function isYouTubeURL(url) {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

function getYouTubeVideoId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export default function ProjectModal({ project, onClose }) {
  // Escape key + lock page scroll while open
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const videoId =
    project.videoDemo && isYouTubeURL(project.videoDemo)
      ? getYouTubeVideoId(project.videoDemo)
      : null;

  return (
    <div
      className="modal-backdrop active"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose(); // only the dark area
      }}
    >
      <div className="modal-container">
        <button className="modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        <div className="modal-scroll">
          <div className="modal-content">
            <div className="modal-image">
              <div>
                {videoId ? (
                  <div className="modal-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={project.title}
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <img src={project.image} alt={project.title} />
                )}
              </div>
            </div>

            <div className="modal-details">
              <div className="modal-header">
                <h2>{project.title}</h2>
                <p className="tagline">{project.tagline}</p>
              </div>

              <div className="modal-section">
                <h3><i className="fas fa-align-left"></i> About This Project</h3>
                <p>{project.description}</p>
              </div>

              {project.features?.length > 0 && (
                <div className="modal-section">
                  <h3><i className="fas fa-star"></i> Key Features</h3>
                  <ul className="features-list">
                    {project.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="modal-section">
                <h3><i className="fas fa-tools"></i> Tech Stack</h3>
                <div className="modal-tech-stack">
                  {project.techStack.map((tech) => (
                    <TechBadge tech={tech} key={tech} />
                  ))}
                </div>
              </div>

              <div className="project-meta">
                <div className="meta-item">
                  <i className="fas fa-calendar-alt"></i>
                  <span className="meta-value">{project.timeline}</span>
                </div>
              </div>

              <div className="modal-actions">
                {project.liveDemo && (
                  <a href={project.liveDemo} target="_blank" rel="noopener noreferrer"
                     className="modal-btn modal-btn-primary">
                    <i className="fas fa-external-link-alt"></i> View Live Demo
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer"
                     className="modal-btn modal-btn-secondary">
                    <i className="fab fa-github"></i> View Code
                  </a>
                )}
                {project.videoDemo && !isYouTubeURL(project.videoDemo) && (
                  <a href={project.videoDemo} target="_blank" rel="noopener noreferrer"
                     className="modal-btn modal-btn-secondary">
                    <i className="fas fa-video"></i> Watch Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}