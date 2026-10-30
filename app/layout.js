import "./styles/base.css";
import "./styles/hero.css";
import "./styles/about.css";
import "./styles/navigation.css";
import "./styles/animations.css";
import "./styles/responsive.css";
import "./styles/mini-heeta.css";
import "./styles/projects-modal.css";
import "./styles/projects.css";
import "./styles/research.css";
import "./styles/certificate-modal.css";
import "./components/PdfModal/PdfViewer.css";
import "./styles/contact.css";
import "./styles/footer.css";
import "./styles/loader.css";
import Loader from "./components/Loader";
import { PdfModalProvider } from "./components/PdfModal/PdfModalProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{__html: `try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}`,}}/>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />
      </head>
      <body>
        <Loader />
        <PdfModalProvider>{children}</PdfModalProvider>
      </body>
    </html>
  );
}

const SITE_URL = "https://your-site.vercel.app";

export const metadata = {
  metadataBase: new URL(SITE_URL),
    title: {
      default: "Heeta Bhanushali | Portfolio",
      template: "%s | Heeta Bhanushali",
    },
  description:
    "Currently studying Software Systems Engineering in RWTH Aachen, Heeta Bhanushali created this website to show her work, projects, and research. Learn more about her and get in touch with her through this portfolio website.",
  keywords: [
    "Heeta Bhanushali",
    "heeta bahnushali",
    "heeta",
    "Heeta Bhanushali portfolio",
    "Software Systems Engineering",
    "RWTH Aachen",
  ],
  authors: [{ name: "Heeta Bhanushali" }],
  robots: { index: true, follow: true },
};