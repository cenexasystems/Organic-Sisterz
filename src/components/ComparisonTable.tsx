import { motion } from 'motion/react';
import { Check, X, ShieldCheck } from 'lucide-react';

interface ComparisonFeature {
  feature: string;
  organicSistez: string | boolean;
  drugstoreOils: string | boolean;
  synthetics: string | boolean;
}

const comparisonData: ComparisonFeature[] = [
  {
    feature: "Active Bioavailability",
    organicSistez: "99% (Low Molecular Lipids)",
    drugstoreOils: "<15% (Heavy Surface Coating)",
    synthetics: "45% (Water Soluble Synthetic)"
  },
  {
    feature: "HPLC Purity Certified",
    organicSistez: true,
    drugstoreOils: false,
    synthetics: false
  },
  {
    feature: "Follicle-Clogging Fillers",
    organicSistez: "0% (Non-Comedogenic)",
    drugstoreOils: "High (Mineral Oils / Silicones)",
    synthetics: "Medium (Propylene Glycol / Alcohol)"
  },
  {
    feature: "Sourcing Transparency",
    organicSistez: "Regenerative Indian Cooperatives",
    drugstoreOils: "Mass Industrial Import",
    synthetics: "Chemical Laboratory Synthesis"
  },
  {
    feature: "Scalp irritation risk",
    organicSistez: "Extremely Low (Adaptogenic)",
    drugstoreOils: "Medium (Fragrances / Fillers)",
    synthetics: "High (Chemical shedding / Dryness)"
  }
];

export default function ComparisonTable() {
  return (
    <section className="py-24 md:py-32 bg-surface-container-low relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center space-y-4 mb-16">
          <span className="font-body text-xs font-semibold text-secondary tracking-[0.2em] uppercase flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-secondary" /> Comparative Studies
          </span>
          <h2 className="font-display text-4xl lg:text-5xl text-primary font-medium tracking-tight">
            Clinical Formulation Integrity
          </h2>
          <p className="font-body text-sm text-on-surface-variant leading-relaxed">
            See how our scientific botanical standards contrast against traditional drugstore solutions and synthetic alternatives.
          </p>
        </div>

        {/* Table Container */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="overflow-x-auto rounded-2xl border border-outline-variant/30 bg-white shadow-sm"
        >
          <table className="w-full min-w-[700px] border-collapse text-left">
            <thead>
              <tr className="bg-primary text-on-primary font-body text-xs font-semibold tracking-widest uppercase border-b border-primary-container">
                <th className="py-6 px-8">Formulation Criteria</th>
                <th className="py-6 px-8 bg-primary-container text-on-secondary-fixed">Organic Sistez</th>
                <th className="py-6 px-8 opacity-80">Drugstore Oils</th>
                <th className="py-6 px-8 opacity-80">Synthetic Treatments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 font-body text-sm text-on-surface-variant">
              {comparisonData.map((row, i) => (
                <tr key={i} className="hover:bg-surface-container-low/30 transition-colors">
                  {/* Criteria */}
                  <td className="py-5 px-8 font-medium text-primary">{row.feature}</td>
                  
                  {/* Organic Sistez */}
                  <td className="py-5 px-8 bg-primary-fixed-dim/20 font-semibold text-primary">
                    {typeof row.organicSistez === 'boolean' ? (
                      row.organicSistez ? (
                        <span className="flex items-center gap-2 text-secondary">
                          <Check className="w-4.5 h-4.5 stroke-[3px]" /> Yes (HPLC Verified)
                        </span>
                      ) : (
                        <X className="w-4.5 h-4.5 text-error" />
                      )
                    ) : (
                      row.organicSistez
                    )}
                  </td>

                  {/* Drugstore Oils */}
                  <td className="py-5 px-8">
                    {typeof row.drugstoreOils === 'boolean' ? (
                      row.drugstoreOils ? (
                        <Check className="w-4.5 h-4.5 text-secondary" />
                      ) : (
                        <span className="flex items-center gap-2 text-on-surface-variant/60">
                          <X className="w-4.5 h-4.5 text-on-surface-variant/40" /> No
                        </span>
                      )
                    ) : (
                      row.drugstoreOils
                    )}
                  </td>

                  {/* Synthetics */}
                  <td className="py-5 px-8">
                    {typeof row.synthetics === 'boolean' ? (
                      row.synthetics ? (
                        <Check className="w-4.5 h-4.5 text-secondary" />
                      ) : (
                        <span className="flex items-center gap-2 text-on-surface-variant/60">
                          <X className="w-4.5 h-4.5 text-on-surface-variant/40" /> No
                        </span>
                      )
                    ) : (
                      row.synthetics
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Footer note */}
        <p className="mt-6 text-center font-body text-[11px] text-on-surface-variant/70 italic">
          *Comparison data compiled from third-party chromatography (HPLC) tests and customer reports over 12 weeks of application.
        </p>

      </div>
    </section>
  );
}
