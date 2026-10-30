"use client";
import { createContext, useContext, useState, useCallback } from "react";
import dynamic from "next/dynamic";

// The viewer loads only when first opened (and never on the server)
const PdfViewer = dynamic(() => import("./PdfViewer"), { ssr: false });

const PdfModalContext = createContext(null);

export function PdfModalProvider({ children }) {
  const [doc, setDoc] = useState(null); // null = closed, {title, subtitle, url} = open
  const close = useCallback(() => setDoc(null), []);

  return (
    <PdfModalContext.Provider value={{ openPdf: setDoc }}>
      {children}
      {doc && <PdfViewer doc={doc} onClose={close} />}
    </PdfModalContext.Provider>
  );
}

export function usePdfModal() {
  return useContext(PdfModalContext);
}