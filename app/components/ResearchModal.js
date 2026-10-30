"use client";
import { useEffect, useState, Fragment } from "react";
import { STATUS, STAGES, CITABLE } from "../data/ResearchStatus";
import { StatusBadge, getYear } from "./Research";
import { usePdfModal } from "./PdfModal/PdfModalProvider";

function Lifecycle({ current }) {
  const currentIndex = STAGES.indexOf(current);

  return (
    <div className="lifecycle-track">
      {STAGES.map((key, i) => {
        const state = i < currentIndex ? "completed" : i === currentIndex ? "current" : "upcoming";
        const cfg = STATUS[key];

        return (
          <Fragment key={key}>
            {i > 0 && (
              <div className={i <= currentIndex ? "lifecycle-line completed" : "lifecycle-line"} />
            )}
            <div className={`lifecycle-step ${state}`}>
              <div className="lifecycle-dot" style={{ "--stage-color": cfg.color }}>
                {state === "completed" && <i className="fas fa-check"></i>}
                {state === "current" && <i className={cfg.icon}></i>}
              </div>
              <span className="lifecycle-label">{cfg.label}</span>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}

const LINKS = [
  { key: "paper",  icon: "fas fa-file-pdf", label: "Read Paper", primary: true },
  { key: "doi",    icon: "fas fa-link",     label: "DOI" },
  { key: "arxiv",  icon: "fas fa-archive",  label: "arXiv" },
  { key: "github", icon: "fab fa-github",   label: "Code" },
];

const isLocalPdf = (url) => url?.startsWith("/") && url.toLowerCase().endsWith(".pdf");

export default function ResearchModal({ item, onClose }) {
  const [visible, setVisible] = useState(false); // for the fade-in animation
  const [copied, setCopied] = useState(false);
  const { openPdf } = usePdfModal();

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (document.querySelector("dialog[open]")) return; // PDF modal is open: let it handle Escape
      onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const year = getYear(item);
  const links = item.links || {};
  const presUrl = links["presentation-certificate"] || links["presentation"];
  const hasLinks = LINKS.some((l) => links[l.key]) || presUrl;

  const citation = `${item.authors.join(", ")}. "${item.title}." ${item.bookName}${year ? `, ${year}` : ""}.`;

  const copyCitation = async () => {
    try {
      await navigator.clipboard.writeText(citation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: ignore */
    }
  };

  return (
    <div
      className={visible ? "research-modal-backdrop active" : "research-modal-backdrop"}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="research-modal-container">
        <button className="research-modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        <div className="research-modal-scroll">
          <StatusBadge status={item.status} />
          <h1 className="research-modal-title">{item.title}</h1>

          <div className="research-modal-authors">
            <i className="fas fa-users"></i>
            {item.authors.map((a, i) => (
              <Fragment key={a}>
                {i > 0 && <span className="research-modal-author-sep">,&nbsp;</span>}
                <span className={a.toLowerCase().includes("heeta") ? "research-modal-author-highlight" : undefined}>
                  {a}
                </span>
              </Fragment>
            ))}
          </div>

          <div className="research-modal-meta">
            <div className="research-modal-meta-item">
              <i className="fas fa-book-open"></i><span>{item.bookName}</span>
            </div>
            {item.series && (
              <div className="research-modal-meta-item">
                <i className="fas fa-layer-group"></i><span>{item.series}</span>
              </div>
            )}
            {year && (
              <div className="research-modal-meta-item">
                <i className="fas fa-calendar-alt"></i><span>{year}</span>
              </div>
            )}
            {item.license && (
              <div className="research-modal-meta-item">
                <i className="fas fa-copyright"></i><span>{item.license}</span>
              </div>
            )}
            {item.timeline && (
              <div className="research-modal-meta-item">
                <i className="fas fa-calendar-alt"></i><span>{item.timeline}</span>
              </div>
            )}
          </div>

          <hr className="research-modal-divider" />

          <div className="research-modal-section">
            <h3 className="research-modal-heading">Abstract</h3>
            <p className="research-modal-abstract">{item.abstract}</p>
          </div>

          <hr className="research-modal-divider" />

          <div className="research-modal-section">
            <h3 className="research-modal-heading">Keywords</h3>
            <div className="research-modal-keywords">
              {item.keywords.map((k) => (
                <span className="research-keyword" key={k}>{k}</span>
              ))}
            </div>
          </div>

          <hr className="research-modal-divider" />

          <div className="research-modal-section">
            <h3 className="research-modal-heading">Publication Lifecycle</h3>
            <Lifecycle current={item.status} />
          </div>

          <hr className="research-modal-divider" />

          <div className="research-modal-actions">
            {LINKS.filter((l) => links[l.key]).map((l) => {
              const cls = `research-modal-btn ${l.primary ? "primary" : "secondary"}`;

              // the paper opens in our PDF modal if it is a local PDF
              if (l.key === "paper" && isLocalPdf(links.paper)) {
                return (
                  <button key={l.key} className={cls}
                    onClick={() => openPdf({ title: item.title, subtitle: "Paper", url: links.paper })}>
                    <i className={l.icon}></i> {l.label}
                  </button>
                );
              }

              return (
                <a key={l.key} href={links[l.key]} target="_blank" rel="noopener noreferrer" className={cls}>
                  <i className={l.icon}></i> {l.label}
                </a>
              );
            })}

            {presUrl &&
              (isLocalPdf(presUrl) ? (
                <button className="research-modal-btn secondary"
                  onClick={() => openPdf({ title: "Presentation Certificate", subtitle: item.title, url: presUrl })}>
                  <i className="fas fa-certificate"></i> Presentation Certificate
                </button>
              ) : (
                <a href={presUrl} target="_blank" rel="noopener noreferrer" className="research-modal-btn secondary">
                  <i className="fas fa-certificate"></i> Presentation Certificate
                </a>
              ))}

            {!hasLinks && (
              <span className="research-coming-soon">
                <i className="fas fa-hourglass-half"></i> Links will be available once published
              </span>
            )}
          </div>

          {CITABLE.includes(item.status) && (
            <div className="research-modal-citation-section">
              <hr className="research-modal-divider" />
              <div className="research-modal-citation-header">
                <h3 className="research-modal-heading">Cite This Work</h3>
                <button
                  className={copied ? "research-modal-copy-btn copied" : "research-modal-copy-btn"}
                  onClick={copyCitation}
                >
                  <i className={copied ? "fas fa-check" : "fas fa-copy"}></i>{" "}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <pre className="research-modal-citation">{citation}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}