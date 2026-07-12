
export default function Footer() {
  return (
    <footer className="bg-primary pt-16 pb-8 px-6 lg:px-12 border-t border-primary-container">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-white font-body text-sm opacity-95 mb-16">
        <div className="max-w-sm">
          <h2 className="text-3xl font-display font-bold mb-4">Organic Sisterz</h2>
          <p className="opacity-90 leading-relaxed text-base">
            Clinical Botanical Excellence. Bridging the gap between earth and science.
          </p>
        </div>

        <div className="flex flex-col md:items-center">
          <h3 className="tracking-widest uppercase text-xs font-bold mb-6 text-inverse-primary">Navigation</h3>
          <ul className="space-y-4 opacity-90 font-medium">
            <li><a href="/" className="hover:text-inverse-primary transition-colors">Home</a></li>
            <li><a href="/#products" className="hover:text-inverse-primary transition-colors">Products</a></li>
            <li><a href="/#results" className="hover:text-inverse-primary transition-colors">Results</a></li>
            <li><a href="/#story" className="hover:text-inverse-primary transition-colors">Story</a></li>
            <li><a href="/#reviews" className="hover:text-inverse-primary transition-colors">Reviews</a></li>
            <li><a href="/privacy-policy" className="hover:text-inverse-primary transition-colors">Privacy Policy</a></li>
            <li><a href="/terms-and-conditions" className="hover:text-inverse-primary transition-colors">Terms & Conditions</a></li>
          </ul>
        </div>

        <div className="flex flex-col md:items-end">
          <h3 className="tracking-widest uppercase text-xs font-bold mb-6 text-inverse-primary">Shop Details</h3>
          <ul className="space-y-4 opacity-90 font-medium">
            <li className="flex flex-col">
              <span className="font-bold mb-1">Address:</span>
              <span>Organic Sisterz, No. 42, Lotus Avenue, Greenways Road,</span>
              <span>Chennai - 600028</span>
            </li>
            <li className="flex flex-col">
              <span className="font-bold mb-1">Email:</span>
              <a href="mailto:organicsisterz@gmail.com" className="hover:text-inverse-primary transition-colors">organicsisterz@gmail.com</a>
            </li>
            <li className="flex flex-col">
              <span className="font-bold mb-1">Phone:</span>
              <a href="tel:+919500258080" className="hover:text-inverse-primary transition-colors">+91 9500258080</a>
            </li>
            <li className="flex flex-col">
              <span className="font-bold mb-1">Hours:</span>
              <span>Mon - Sat: 9:00 AM - 8:00 PM</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center md:text-left text-white font-body text-sm opacity-95">
        <div className="opacity-90">
          © {new Date().getFullYear()} Organic Sisterz. All Rights Reserved
        </div>

        <div className="flex justify-center items-center gap-1.5 opacity-90">
          <span>Powered by</span>
          <a
            href="https://cenexasystems.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-lg tracking-wide font-bold hover:text-white transition-colors text-inverse-primary"
          >
            Cenexa Systems
          </a>{" "}
          © {new Date().getFullYear()}
        </div>


        <div className="md:text-right tracking-widest uppercase text-xs font-bold text-inverse-primary opacity-90">
          Pure • Organic • Proven
        </div>
      </div>
    </footer>
  );
}
