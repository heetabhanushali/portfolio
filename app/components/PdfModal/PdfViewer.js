"use client";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export default function PdfViewer({ doc, onClose }) {
  const dialogRef = useRef(null);
  const bodyRef = useRef(null);
  const [numPages, setNumPages] = useState(null);
  const [width, setWidth] = useState(600);

  // Open the native <dialog> as soon as this appears
  useEffect(() => {
    const d = dialogRef.current;
    if (d && !d.open) d.showModal();
  }, []);

  // Make pages fit the modal width
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setWidth(el.clientWidth - 32));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="pdf-dialog"
      onClose={onClose} // fires on Escape too
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose(); // backdrop click
      }}
    >
      <div className="pdf-header">
        <div className="pdf-title-block">
          <h3 className="pdf-title">{doc.title}</h3>
          <p className="pdf-meta">
            {doc.subtitle && <span>{doc.subtitle}</span>}
            {doc.subtitle && numPages && <span> · </span>}
            {numPages && <span>{numPages} {numPages === 1 ? "page" : "pages"}</span>}
          </p>
        </div>
        <div className="pdf-actions">
          <a href={doc.url} download className="pdf-icon-btn" title="Download">
            <i className="fas fa-download"></i>
          </a>
          <button className="pdf-icon-btn" onClick={onClose} title="Close">
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div className="pdf-body" ref={bodyRef}>
        <Document
          file={doc.url}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={<p className="pdf-status">Loading...</p>}
          error={<p className="pdf-status">Could not load this PDF.</p>}
          className="pdf-document"
        >
          {numPages &&
            Array.from({ length: numPages }, (_, i) => (
              <Page
                key={i}
                pageNumber={i + 1}
                width={Math.min(width, 800)}
                className="pdf-page"
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            ))}
        </Document>
      </div>
    </dialog>
  );
}