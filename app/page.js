import About from "./components/About";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import Research from "./components/Research";
import Contact from "./components/Contact";
import MiniHeeta from "./components/MiniHeeta";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Heeta Bhanushali",
  url: "https://your-site.vercel.app",
  jobTitle: "Software Engineer",
  description: "Computer engineer studying Software Systems Engineering at RWTH Aachen.",
  alumniOf: "RWTH Aachen University",
  sameAs: [
    "https://github.com/heetabhanushali",
    "https://www.linkedin.com/in/heetabhanushali",
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Research />
        <Contact />
      </main>
      <Footer />
      <MiniHeeta />
    </>
  );
}