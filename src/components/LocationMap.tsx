import { MapPin, Mail } from 'lucide-react';

export default function LocationMap() {
  return (
    <section className="py-24 bg-white relative overflow-hidden border-t border-outline-variant/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="font-body text-xs font-semibold text-secondary tracking-[0.2em] uppercase flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4" /> Visit Our Store
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-primary font-medium tracking-tight">
            Our Headquarters
          </h2>
          <div className="flex flex-col items-center justify-center gap-2 mt-4 text-on-surface-variant font-body">
            <p>13°07'02.9"N 80°09'57.0"E</p>
            <a href="mailto:organicsisterz@gmail.com" className="flex items-center gap-2 text-secondary hover:text-primary transition-colors font-semibold mt-2">
              <Mail className="w-4 h-4" /> organicsisterz@gmail.com
            </a>
          </div>
        </div>

        {/* Map Container */}
        <div className="w-full h-[500px] rounded-[2rem] overflow-hidden shadow-2xl border border-outline-variant/30 bg-surface-container-low relative">
          <iframe 
            src="https://maps.google.com/maps?q=13.117467,80.165820&t=&z=16&ie=UTF8&iwloc=&output=embed"
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Organic Sisterz Location"
            className="absolute inset-0 w-full h-full grayscale-[20%] contrast-[1.1] opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
          ></iframe>
        </div>
        
      </div>
    </section>
  );
}
