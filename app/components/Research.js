"use client";
import { useState, useRef } from "react";
import researchJson from "../data/research.json";
import { STATUS, SORT_ORDER } from "../data/ResearchStatus";
import useScrollReveal from "../hooks/useScrollReveal";
import ResearchModal from "./ResearchModal";

// visible only, sorted by status (runs once)
const items = researchJson.research
  .filter((r) => r.visible)
  .sort((a, b) => SORT_ORDER[a.status] - SORT_ORDER[b.status]);

export function getYear(item) {
  return item.year || item.timeline?.match(/\d{4}/)?.[0] || "";
}

export function StatusBadge({ status }) {
  const s = STATUS[status];
  return (
    <span className="research-status-badge" style={{ "--status-color": s.color }}>
      <i className={s.icon}></i> {s.label}
    </span>
  );
}

function ResearchCard({ item, onOpen }) {
  const authors =
    item.authors.length > 2 ? `${item.authors[0]} et al.` : item.authors.join(", ");

  return (
    <div className="research-card" data-status={item.status} onClick={() => onOpen(item)}>
      <div className="research-card-header">
        <StatusBadge status={item.status} />
        <span className="research-year">{getYear(item)}</span>
      </div>

      <div className="research-card-content">
        <h3 className="research-title">{item.title}</h3>
        <p className="research-authors">{authors}</p>
        <p className="research-venue">{item.bookNameShort}</p>
        <p className="research-tagline">{item.tagline}</p>
        <div className="research-keywords">
          {item.keywords.slice(0, 3).map((k) => (
            <span className="research-keyword" key={k}>{k}</span>
          ))}
        </div>
      </div>

      <div className="research-card-footer">
        <button className="btn btn-secondary research-details-btn">
          <i className="fas fa-expand-alt"></i> View Details
        </button>
      </div>
    </div>
  );
}

export default function Research() {
  const [selected, setSelected] = useState(null);
  const sectionRef = useRef(null);
  useScrollReveal(sectionRef);

  return (
    <section id="research" className="research-section" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title" data-aos="fade-up">Research &amp; Publications</h2>
        </div>

        <div className="research-grid">
          {items.map((item) => (
            <ResearchCard key={item.id} item={item} onOpen={setSelected} />
          ))}
        </div>
      </div>

      {selected && <ResearchModal item={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}