import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Lenis from "lenis";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CinematicReveal from "./components/CinematicReveal";
import ProductCatalog from "./components/ProductCatalog";
import BotanicalHealing from "./components/BotanicalHealing";
import BlendCustomizer from "./components/BlendCustomizer";
import Herbarium from "./components/Herbarium";
import Sourcing from "./components/Sourcing";
import Efficacy from "./components/Efficacy";
import Testimonials from "./components/Testimonials";
import LocationMap from "./components/LocationMap";
import FaqAccordion from "./components/FaqAccordion";
import Footer from "./components/Footer";
import Preloader from "./components/Preloader";
import ConsultationQuiz from "./components/ConsultationQuiz";
import AdminPortal from "./components/AdminPortal";
import GiftCustomization from "./components/GiftCustomization";
import Login from "./components/Login";

function Storefront() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="min-h-screen bg-background text-on-background selection:bg-secondary-container selection:text-on-secondary-container font-body antialiased"
    >
      <Navbar
        onConsultationClick={() => setIsQuizOpen(true)}
        onAdminClick={() => navigate("/admin")}
        onGiftClick={() => window.scrollTo(0, 0) || navigate("/gift")}
      />

      <main>
        <Hero onConsultationClick={() => setIsQuizOpen(true)} />
        <ProductCatalog />
        <BotanicalHealing />
        <BlendCustomizer />
        <Herbarium />
        <Sourcing />
        <Efficacy />
        <Testimonials />
        <LocationMap />
        <FaqAccordion />
      </main>

      <Footer onAdminClick={() => navigate("/admin")} />

      {/* Diagnostic consultation quiz overlay */}
      <ConsultationQuiz
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
      />
    </motion.div>
  );
}

export default function App() {
  const [isPreloaderActive, setIsPreloaderActive] = useState(true);

  return (
    <>
      {/* Cinematic preloader on first entrance */}
      <Preloader onComplete={() => setIsPreloaderActive(false)} />

      <AnimatePresence>
        {!isPreloaderActive && (
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Storefront />} />
              <Route path="/admin" element={<AdminPortal />} />
              <Route path="/gift" element={<GiftCustomization />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </BrowserRouter>
        )}
      </AnimatePresence>
    </>
  );
}
