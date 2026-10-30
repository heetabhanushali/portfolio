"use client";
import { useState, useRef } from "react";
import projectsJson from "../data/projects.json";
import useScrollReveal from "../hooks/useScrollReveal";
import TechBadge from "./TechBadge";
import ProjectModal from "./ProjectsModal";

// visible only, featured first (runs once, not on every render)
const projects = projectsJson.projects
  .filter((p) => p.visible)
  .sort((a, b) => Number(!!b.featured) - Number(!!a.featured));

const stop = (e) => e.stopPropagation(); // clicks on links shouldn't open the modal

function ProjectCard({ project, index, onOpen }) {
  const hasLinks = project.liveDemo || project.github || project.videoDemo;

  return (
    <div
      className="project-card"
      data-category={project.category}
      data-aos="fade-up"
      data-aos-delay={(index % 3) * 100}
      onClick={() => onOpen(project)}
    >
      {project.featured && <span className="featured-badge">Featured</span>}

      <div className="project-image">
        <img src={project.image} alt={project.title} loading="lazy" />
        <div className="project-overlay">
          {hasLinks && (
            <div className="overlay-quick-links">
              {project.liveDemo && (
                <a href={project.liveDemo} target="_blank" rel="noopener noreferrer"
                   className="quick-link-btn" onClick={stop}>
                  <i className="fas fa-external-link-alt"></i> Live Demo
                </a>
              )}
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer"
                   className="quick-link-btn" onClick={stop}>
                  <i className="fab fa-github"></i> GitHub
                </a>
              )}
              {project.videoDemo && (
                <a href={project.videoDemo} target="_blank" rel="noopener noreferrer"
                   className="quick-link-btn" onClick={stop}>
                  <i className="fas fa-video"></i> Video
                </a>
              )}
            </div>
          )}
          <button className="view-details-btn">
            <i className="fas fa-info-circle"></i> View Details
          </button>
        </div>
      </div>

      <div className="project-content">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-tagline">{project.tagline}</p>
        <div className="project-tech">
          {project.techStack.slice(0, 4).map((tech) => (
            <TechBadge tech={tech} key={tech} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [selected, setSelected] = useState(null); // null = modal closed
  const sectionRef = useRef(null);

  useScrollReveal(sectionRef);

  return (
    <section id="projects" className="projects-section" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title" data-aos="fade-up">Projects</h2>
        </div>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} onOpen={setSelected} />
          ))}
        </div>
      </div>

      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}