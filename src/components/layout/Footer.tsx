interface FooterProps {
  onAdminClick?: () => void;
}

export default function Footer({ onAdminClick }: FooterProps) {
  return (
    <footer className="bg-primary pt-24 pb-12 px-6 lg:px-8 border-t border-primary-container">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
        <div className="col-span-1 md:col-span-6 lg:col-span-4 space-y-6">
          <div className="font-display text-3xl font-medium text-on-primary">
            Organic Sisterz
          </div>
          <p className="text-inverse-on-surface font-body text-base opacity-80 max-w-sm leading-relaxed">
            Clinical Botanical Excellence. Bridging the gap between earth and
            science.
          </p>
        </div>

        <div className="col-span-1 md:col-span-3 lg:col-span-2 lg:col-start-7 flex flex-col space-y-5">
          <h4 className="text-on-primary font-body text-xs font-semibold tracking-widest uppercase opacity-50 mb-2">
            Navigation
          </h4>
          <a
            href="/#hero"
            className="text-outline-variant hover:text-white font-body text-base hover:translate-x-1 transition-transform duration-300"
          >
            Home
          </a>
          <a
            href="/#products-catalog"
            className="text-outline-variant hover:text-white font-body text-base hover:translate-x-1 transition-transform duration-300"
          >
            Products
          </a>
          <a
            href="/#before-after"
            className="text-outline-variant hover:text-white font-body text-base hover:translate-x-1 transition-transform duration-300"
          >
            Results
          </a>
          <a
            href="/#herbarium"
            className="text-outline-variant hover:text-white font-body text-base hover:translate-x-1 transition-transform duration-300"
          >
            Story
          </a>
          <a
            href="/#testimonials"
            className="text-outline-variant hover:text-white font-body text-base hover:translate-x-1 transition-transform duration-300"
          >
            Reviews
          </a>
        </div>

        <div className="col-span-1 md:col-span-3 lg:col-span-4 lg:col-start-9 flex flex-col space-y-5">
          <h4 className="text-on-primary font-body text-xs font-semibold tracking-widest uppercase opacity-50 mb-2">
            Shop Details
          </h4>
          <div className="text-outline-variant font-body text-sm space-y-3">
            <p className="leading-relaxed">
              <strong className="text-on-primary opacity-80">Address:</strong>
              <br />
              Organic Sisterz, No. 42, Lotus Avenue, Greenways Road, Chennai - 600028
            </p>
            <p>
              <strong className="text-on-primary opacity-80">Email:</strong>
              <br />
              <a href="mailto:organicsisterz@gmail.com" className="hover:text-white transition-colors">
                organicsisterz@gmail.com
              </a>
            </p>
            <p>
              <strong className="text-on-primary opacity-80">Phone:</strong>
              <br />
              <a href="tel:+919876543210" className="hover:text-white transition-colors">
                +91 98765 43210
              </a>
            </p>
            <p>
              <strong className="text-on-primary opacity-80">Hours:</strong>
              <br />
              Mon - Sat: 9:00 AM - 8:00 PM
            </p>
          </div>
          {onAdminClick && (
            <button
              onClick={onAdminClick}
              className="text-left text-outline-variant hover:text-white font-body text-base hover:translate-x-1 transition-transform duration-300 cursor-pointer w-fit"
            >
              Admin Console
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-primary-container/50 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left text-inverse-on-surface font-body text-sm opacity-60">
        <div className="flex-1 text-left">
          © {new Date().getFullYear()} Organic Sisterz.
        </div>
        
        <div className="flex-1 flex justify-center items-center gap-1.5">
          <span>Powered by</span>
          <a
            href="https://cenexasystems.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-lg tracking-wide font-bold hover:text-white transition-colors"
            style={{ color: "#D4AF37" }}
          >
            Cenexa Systems
          </a>
        </div>
        
        <div 
          className="flex-1 text-right tracking-widest uppercase text-xs font-bold"
          style={{ color: "#D4AF37" }}
        >
          Pure • Organic • Proven
        </div>
      </div>
    </footer>
  );
}
