import { motion } from 'motion/react';
import { Beaker, Leaf, Droplets } from 'lucide-react';

export default function Efficacy() {
  const cards = [
    {
      icon: <Beaker className="w-6 h-6 text-on-secondary-container" />,
      iconBg: 'bg-secondary-container',
      title: 'Cellular Regeneration',
      description: 'Observed 42% increase in cellular turnover within the first 28 days of clinical application.',
      tags: ['Antioxidant', 'Peptides'],
      tagBg: 'bg-secondary-fixed text-on-secondary-fixed'
    },
    {
      icon: <Leaf className="w-6 h-6 text-on-tertiary-fixed" />,
      iconBg: 'bg-tertiary-fixed',
      title: 'Inflammation Reduction',
      description: 'Significant decrease in systemic inflammatory markers utilizing our proprietary sage extract complex.',
      tags: ['Anti-inflammatory', 'Adaptogen'],
      tagBg: 'bg-tertiary-fixed-dim text-on-tertiary-fixed-variant'
    },
    {
      icon: <Droplets className="w-6 h-6 text-on-primary-fixed" />,
      iconBg: 'bg-primary-fixed',
      title: 'Barrier Restoration',
      description: 'Lipid barrier recovery accelerated by 65%, locking in essential moisture and preventing transepidermal water loss.',
      tags: ['Hydration', 'Ceramides'],
      tagBg: 'bg-primary-fixed-dim text-on-primary-fixed-variant'
    }
  ];

  return (
    <section className="relative py-32 min-h-[90vh] flex items-center">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmR6ZxR3Rk33dWJrnZNHs_Ps-BKheStlNXJOleMO7HgQK_WIEv0anvpEf4Z6cAxXmUZHa4CCFkhMwhMHCdqqPRFWJ3wbDHvaqEANcjfmNBaUdRG-NSUD_8rqqsqEKXgjrDyeopAAkzNTVldIS-pI3D6X6xWIlsHqoEsiEpTsBW85VCgPizSem3SNjquufBNl645_zdOeCDhoFV9dR00iCy5v69m7NhnDmyOiI4CONSF_3XxcpHYg4Nxp8PrUGpRw9T_CYa6t0eZgw" 
          alt="Lush botanical greenhouse background" 
          className="w-full h-full object-cover mix-blend-multiply opacity-70"
        />
        <div className="absolute inset-0 bg-surface/90 backdrop-blur-[8px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-8 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto space-y-6 mb-20"
        >
          <span className="font-body text-xs font-semibold text-secondary tracking-[0.2em] uppercase">
            Clinical Results
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-primary font-medium tracking-tight">
            Proven Botanical Efficacy
          </h2>
          <p className="font-body text-base text-on-surface-variant leading-relaxed">
            Our formulations undergo rigorous independent clinical trials to ensure they deliver measurable results without the side effects of traditional synthetic interventions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="glass-panel p-10 rounded-2xl text-left hover:-translate-y-2 transition-transform duration-500 shadow-sm flex flex-col h-full"
            >
              <div className={`w-14 h-14 ${card.iconBg} rounded-full flex items-center justify-center mb-8 shrink-0`}>
                {card.icon}
              </div>
              <h3 className="font-display text-2xl text-primary font-medium mb-4">
                {card.title}
              </h3>
              <p className="font-body text-base text-on-surface-variant mb-8 leading-relaxed">
                {card.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-auto pt-4">
                {card.tags.map(tag => (
                  <span key={tag} className={`${card.tagBg} px-3 py-1.5 rounded-full font-body text-[11px] font-semibold tracking-wide uppercase`}>
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
