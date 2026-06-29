import { motion } from 'motion/react';
import { Leaf, ShieldCheck, Sparkles, Star } from 'lucide-react';
import React from 'react';

export default function BotanicalHealing() {
  return (
    <section id="before-after" className="py-24 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-24">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-8 bg-on-surface-variant/30" />
            <span className="font-body text-[10px] font-bold tracking-[0.25em] text-on-surface-variant uppercase">
              Mahizham By Organic Sisterz
            </span>
            <div className="h-px w-8 bg-on-surface-variant/30" />
          </div>
          <h2 className="font-display text-5xl md:text-6xl text-primary font-medium tracking-tight mb-6">
            The Art of <span className="italic font-light text-secondary">Botanical</span><br />
            Healing.
          </h2>
          <p className="font-body text-base text-on-surface-variant leading-relaxed max-w-2xl mx-auto">
            Handcrafted, chemical-free hair, skin, and wellness formulations. Revitalizing your hair growth, scalp health, and skin radiance naturally with up to 50 active traditional herbs.
          </p>
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
          
          {/* Left Column */}
          <div className="flex flex-col gap-6 order-2 lg:order-1">
            <FeatureCard 
              icon={<Leaf className="w-4 h-4 text-secondary" />}
              title="Active Rosemary"
              desc="Stimulates hair follicles, promotes thickness, and prevents dry scalp naturally."
              delay={0.1}
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-4 h-4 text-secondary" />}
              title="Chemical-Free"
              desc="Handcrafted formulation without sulfates, parabens, or synthetic fragrance."
              delay={0.2}
            />
          </div>

          {/* Center Column - Arched Product */}
          <div className="order-1 lg:order-2 flex justify-center relative px-8 py-4">
            {/* Soft Glow Behind Arch */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
            
            {/* Arch Container */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-[#FAF9F5] w-64 h-[350px] rounded-t-[140px] shadow-sm border border-outline-variant/30 flex flex-col items-center justify-end"
            >
              {/* Concentric subtle rings like in the design */}
              <div className="absolute inset-2 border border-outline-variant/10 rounded-t-[130px] pointer-events-none" />
              
              <img 
                src="/mahizham_hair_oil.png" 
                alt="Mahizham Hair Oil"
                className="w-52 absolute bottom-6 z-10 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />
              
              {/* Floating Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -bottom-6 w-[115%] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-outline-variant/15 p-4 text-center z-20"
              >
                <span className="block font-body text-[9px] font-extrabold tracking-widest text-secondary uppercase mb-1.5">
                  Flagship Product
                </span>
                <span className="block font-display text-[15px] font-bold text-primary">
                  Mahizham Hair Growth Elixir
                </span>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6 order-3 lg:order-3">
            <FeatureCard 
              icon={<Sparkles className="w-4 h-4 text-secondary" />}
              title="Herbal Actives"
              desc="Contains Amla, Bringaraj, and Hibiscus to maintain natural pigmentation and boost shine."
              delay={0.3}
            />
            <FeatureCard 
              icon={<Star className="w-4 h-4 text-secondary" />}
              title="Rapid Revitalization"
              desc="Clinically balanced formula designed to restore texture and soothe scalps rapidly."
              delay={0.4}
            />
          </div>

        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc, delay }: { icon: React.ReactNode, title: string, desc: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white p-6 rounded-[1.25rem] shadow-sm border border-outline-variant/20 flex flex-col gap-3 hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <h4 className="font-display text-lg font-bold text-primary">{title}</h4>
      </div>
      <p className="font-body text-[13px] text-on-surface-variant leading-relaxed opacity-90 pl-[52px]">
        {desc}
      </p>
    </motion.div>
  );
}
