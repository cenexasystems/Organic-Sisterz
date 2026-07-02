import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Lenis from "lenis";
import Navbar from "./components/layout/Navbar";
import Hero from "./components/sections/Hero";
import ProductCatalog from "./components/sections/ProductCatalog";
import BotanicalHealing from "./components/sections/BotanicalHealing";
import BlendCustomizer from "./components/sections/BlendCustomizer";
import Herbarium from "./components/sections/Herbarium";
import Testimonials from "./components/sections/Testimonials";
import LocationMap from "./components/sections/LocationMap";
import FaqAccordion from "./components/ui/FaqAccordion";
import Footer from "./components/layout/Footer";
import Preloader from "./components/layout/Preloader";
import ConsultationQuiz from "./components/sections/ConsultationQuiz";
import AdminPortal from "./pages/AdminPortal";
import GiftCustomization from "./pages/GiftCustomization";
import Login from "./pages/Login";
import CustomerProfile from "./pages/CustomerProfile";
import CartPage from "./pages/CartPage";
import InvoicePage from "./pages/InvoicePage";

function Storefront() {
  const navigate = useNavigate();
  const [isQuizOpen, setIsQuizOpen] = useState(false);

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
        onGiftClick={() => { window.scrollTo(0, 0); navigate("/gift"); }}
      />

      <main>
        <Hero />
        <ProductCatalog />
        <BotanicalHealing />
        <BlendCustomizer />
        <Herbarium />
        <Testimonials />
        <LocationMap />
        <FaqAccordion />
      </main>

      <Footer />

      <ConsultationQuiz isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
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
              <Route path="/profile" element={<CustomerProfile />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/invoice/:id" element={<InvoicePage />} />
            </Routes>
          </BrowserRouter>
        )}
      </AnimatePresence>
    </>
  );
}
