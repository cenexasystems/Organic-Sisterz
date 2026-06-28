import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCatalog from './components/ProductCatalog';
import BeforeAfter from './components/BeforeAfter';
import Herbarium from './components/Herbarium';
import ComparisonTable from './components/ComparisonTable';
import Sourcing from './components/Sourcing';
import Efficacy from './components/Efficacy';
import Testimonials from './components/Testimonials';
import FaqAccordion from './components/FaqAccordion';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import ConsultationQuiz from './components/ConsultationQuiz';
import AdminPortal from './components/AdminPortal';

function Storefront() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="min-h-screen bg-background text-on-background selection:bg-secondary-container selection:text-on-secondary-container font-body antialiased"
    >
      <Navbar 
        onConsultationClick={() => setIsQuizOpen(true)} 
        onAdminClick={() => navigate('/admin')}
      />
      
      <main>
        <Hero onConsultationClick={() => setIsQuizOpen(true)} />
        <ProductCatalog />
        <BeforeAfter />
        <Herbarium />
        <ComparisonTable />
        <Sourcing />
        <Efficacy />
        <Testimonials />
        <FaqAccordion />
      </main>
      
      <Footer onAdminClick={() => navigate('/admin')} />

      {/* Diagnostic consultation quiz overlay */}
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
            </Routes>
          </BrowserRouter>
        )}
      </AnimatePresence>
    </>
  );
}
