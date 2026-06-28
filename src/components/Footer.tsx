export default function Footer() {
  return (
    <footer className="bg-primary pt-24 pb-12 px-6 lg:px-8 border-t border-primary-container">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
        
        <div className="col-span-1 md:col-span-6 lg:col-span-4 space-y-6">
          <div className="font-display text-3xl font-medium text-on-primary">
            Organic Sisterz
          </div>
          <p className="text-inverse-on-surface font-body text-base opacity-80 max-w-sm leading-relaxed">
            Clinical Botanical Excellence. Bridging the gap between earth and science.
          </p>
        </div>

        <div className="col-span-1 md:col-span-3 lg:col-span-2 lg:col-start-7 flex flex-col space-y-5">
          <h4 className="text-on-primary font-body text-xs font-semibold tracking-widest uppercase opacity-50 mb-2">
            Discovery
          </h4>
          <a href="#" className="text-secondary-fixed hover:text-white font-body text-base transition-colors">
            Sourcing Transparency
          </a>
          <a href="#" className="text-outline-variant hover:text-white font-body text-base hover:translate-x-1 transition-transform duration-300">
            Extraction Science
          </a>
          <a href="#" className="text-outline-variant hover:text-white font-body text-base hover:translate-x-1 transition-transform duration-300">
            Formulations
          </a>
        </div>

        <div className="col-span-1 md:col-span-3 lg:col-span-2 lg:col-start-10 flex flex-col space-y-5">
          <h4 className="text-on-primary font-body text-xs font-semibold tracking-widest uppercase opacity-50 mb-2">
            Support
          </h4>
          <a href="#" className="text-outline-variant hover:text-white font-body text-base hover:translate-x-1 transition-transform duration-300">
            Privacy Journal
          </a>
          <a href="#" className="text-outline-variant hover:text-white font-body text-base hover:translate-x-1 transition-transform duration-300">
            Member Portal
          </a>
          <a href="#" className="text-outline-variant hover:text-white font-body text-base hover:translate-x-1 transition-transform duration-300">
            Contact
          </a>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-primary-container/50">
        <p className="text-inverse-on-surface font-body text-sm opacity-50">
          © {new Date().getFullYear()} Organic Sisterz. Clinical Botanical Excellence.
        </p>
      </div>
    </footer>
  );
}
