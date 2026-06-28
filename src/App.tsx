import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Sourcing from './components/Sourcing';
import Efficacy from './components/Efficacy';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-secondary-container selection:text-on-secondary-container font-body antialiased">
      <Navbar />
      <main>
        <Hero />
        <Sourcing />
        <Efficacy />
      </main>
      <Footer />
    </div>
  );
}
