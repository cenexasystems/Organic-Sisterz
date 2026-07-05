import { MapPin, Mail, Clock, Phone, Navigation } from 'lucide-react';

export default function LocationMap() {
  return (
    <section id="location" className="py-24 md:py-32 bg-[#f5f2eb] relative overflow-hidden border-t border-[#061b0e]/10">
      {/* Background organic grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#061b0e04_1px,transparent_1px),linear-gradient(to_bottom,#061b0e04_1px,transparent_1px)] bg-[size:4rem_4rem] -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-20">
          <span className="font-body text-xs font-semibold text-secondary tracking-[0.2em] uppercase flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4 animate-bounce text-secondary" /> Visit Our Store
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-primary font-medium tracking-tight">
            Our Headquarters & Lab
          </h2>
          <p className="font-body text-base text-on-surface-variant max-w-xl mx-auto">
            Experience our clinical formulation process, consult with our herbalists, and sample our fresh extractions.
          </p>
        </div>

        {/* Map Container with Responsive Layout */}
        <div className="flex flex-col md:relative w-full md:h-[600px] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-[0_24px_80px_rgba(6,27,14,0.08)] border border-[#061b0e]/10 bg-white">
          
          {/* Google Maps Iframe with custom organic tint */}
          <div className="w-full h-[320px] md:h-full md:absolute md:inset-0 order-2 md:order-1 relative">
            <iframe 
              src="https://maps.google.com/maps?q=13.117467,80.165820&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%" 
              height="100%" 
              style={{ 
                border: 0,
                filter: 'grayscale(25%) sepia(20%) brightness(98%) contrast(96%)'
              }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Organic Sisterz Location"
              className="w-full h-full absolute inset-0"
            ></iframe>

            {/* Central Pulsing Target / Indicator for Mobile and Desktop center */}
            <div className="absolute right-4 bottom-4 z-20">
              <a 
                href="https://maps.google.com/maps?q=13.117467,80.165820" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-[#061b0e]/95 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-widest px-4.5 py-2.5 rounded-full hover:bg-secondary hover:scale-105 transition-all duration-300 inline-flex items-center gap-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.2)] border border-white/10"
              >
                <MapPin className="w-3 h-3 animate-pulse text-secondary" /> Open Map
              </a>
            </div>
          </div>

          {/* Address Panel (Stacked on mobile, Floating on desktop) */}
          <div className="w-full md:absolute md:top-6 md:left-6 md:z-20 md:w-[380px] bg-white md:bg-white/90 md:backdrop-blur-xl border-b md:border border-outline-variant/20 md:border-white/50 p-6 sm:p-8 rounded-none md:rounded-[2rem] shadow-none md:shadow-[0_16px_40px_rgba(6,27,14,0.06)] flex flex-col space-y-5 order-1 md:order-2">
            <div>
              <span className="font-body text-[10px] text-secondary font-bold uppercase tracking-widest block mb-1">
                Chennai, Tamil Nadu
              </span>
              <h3 className="font-display text-2xl text-primary font-medium">
                The Botanical Lab
              </h3>
            </div>

            <div className="space-y-4 font-body text-xs text-on-surface-variant">
              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary shrink-0" />
                <p className="leading-relaxed">
                  No. 12, Herbarium Street, <br />
                  Ambattur Industrial Estate, <br />
                  Chennai - 600058
                </p>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-secondary shrink-0" />
                <div>
                  <p className="font-semibold text-primary">Store & Lab Hours</p>
                  <p className="mt-0.5">Monday – Saturday: 9:00 AM – 7:00 PM</p>
                  <p className="text-secondary font-medium">Sunday: Closed for Wildcrafting</p>
                </div>
              </div>

              {/* Phone & Contact */}
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-secondary shrink-0" />
                <div>
                  <p className="font-semibold text-primary">Formulation Consultation</p>
                  <a href="tel:+919500258080" className="mt-0.5 hover:underline block text-secondary font-semibold">
                    +91 9500258080

                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-secondary shrink-0" />
                <div>
                  <p className="font-semibold text-primary">Lab Enquiries</p>
                  <a href="mailto:organicsisterz@gmail.com" className="mt-0.5 hover:underline block text-secondary font-semibold">
                    organicsisterz@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Direct Navigation Button inside panel (visible always) */}
            <a 
              href="https://maps.google.com/maps?q=13.117467,80.165820" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full bg-[#061b0e] text-white text-xs font-bold uppercase tracking-widest py-3.5 rounded-xl hover:bg-secondary transition-all duration-300 flex items-center justify-center gap-2 shadow-md group"
            >
              <Navigation className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /> 
              Get Directions
            </a>
          </div>
          
        </div>
        
      </div>
    </section>
  );
}
