'use client'

import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import { fadeUpVariants, staggerContainerVariants } from '@/animations/motionVariants'

const FEATURES = [
  {
    icon: '🧬',
    title: 'Protocols, built in',
    description: 'Multi-step programs with timelines and conditional logic — not PDFs and spreadsheets.',
    stat: 'Native',
  },
  {
    icon: '🩺',
    title: 'One unified platform',
    description: 'Clinic operations and the patient experience in a single connected system.',
    stat: 'Clinic + patient',
  },
  {
    icon: '💊',
    title: 'Integrated telehealth',
    description: 'Consult, prescribe, and route to pharmacy without ever leaving the platform.',
    stat: '503A network',
  },
  {
    icon: '🛡️',
    title: 'Compliance infrastructure',
    description: 'HIPAA-secure by design with timestamped audit trails on every action.',
    stat: 'HIPAA',
  },
  {
    icon: '📈',
    title: 'Dosing & lab tracking',
    description: 'Dose reminders, symptom logs, and biomarker trends in one longitudinal view.',
    stat: 'Longitudinal',
  },
  {
    icon: '⚡',
    title: 'Live from day one',
    description: 'Go live today and migrate existing patients so they start earning immediately.',
    stat: 'Day one',
  },
]

const BENTO = [
  {
    title: 'From intake to pharmacy, one system runs it all',
    description: 'No chaos. No guessing. Just structure that works across the entire care pathway.',
    className: 'col-span-2 row-span-1',
    accent: true,
  },
  {
    title: 'Compliance is the infrastructure',
    description: 'Not a feature bolted on later. Audit trails, provider oversight, and HIPAA-secure data — by default.',
    className: 'col-span-1 row-span-2',
    accent: false,
  },
  {
    title: 'Built for long-term plans',
    description: 'Designed for ongoing protocols, not one-off episodic visits.',
    className: 'col-span-1 row-span-1',
    accent: false,
  },
  {
    title: 'Your patients stay yours',
    description: 'You own the relationship, the data, and the pricing. Always.',
    className: 'col-span-1 row-span-1',
    accent: false,
  },
]

export function FeaturesSection() {
  const { ref, inView } = useInView()

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-32 px-6"
      aria-labelledby="features-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <motion.span
            className="text-xs uppercase tracking-[0.2em] text-muted-foreground/50 font-medium block mb-4"
            variants={fadeUpVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            Why clinics switch
          </motion.span>
          <motion.h2
            id="features-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance"
            variants={fadeUpVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            transition={{ delay: 0.1 }}
          >
            Built for protocols.
            <br />
            <span className="text-muted-foreground">Not one-off visits.</span>
          </motion.h2>
          <motion.p
            className="text-muted-foreground leading-relaxed text-balance"
            variants={fadeUpVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            transition={{ delay: 0.2 }}
          >
            Longevity care is moving mainstream. The tools haven&apos;t caught up.
            MyDose turns protocols into infrastructure — not afterthoughts.
          </motion.p>
        </div>

        {/* Feature grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/30 rounded-3xl overflow-hidden mb-8"
          variants={staggerContainerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeUpVariants}
              className="group relative bg-background p-8 hover:bg-muted/30 transition-colors duration-300"
            >
              {/* Hover border glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-none"
                style={{
                  boxShadow: 'inset 0 0 0 1px oklch(1 0 0 / 8%)',
                }}
                aria-hidden="true"
              />

              <div className="text-2xl mb-4" aria-hidden="true">{feature.icon}</div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-sm font-semibold">{feature.title}</h3>
                <span className="text-[10px] font-mono text-muted-foreground/50 shrink-0 mt-0.5 border border-border/50 rounded px-1.5 py-0.5">
                  {feature.stat}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bento grid */}
        <motion.div
          className="grid grid-cols-3 grid-rows-2 gap-4"
          variants={staggerContainerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {BENTO.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeUpVariants}
              className={`${item.className} glass-dark rounded-2xl p-8 min-h-[160px] relative overflow-hidden group cursor-default`}
              style={{
                background: item.accent
                  ? 'linear-gradient(135deg, oklch(0.2 0.03 250), oklch(0.15 0.02 280))'
                  : undefined,
              }}
            >
              {item.accent && (
                <div
                  className="absolute top-0 right-0 w-48 h-48 pointer-events-none opacity-20"
                  style={{
                    background: 'radial-gradient(circle at 100% 0%, oklch(0.6 0.06 250), transparent 70%)',
                  }}
                  aria-hidden="true"
                />
              )}
              <h3 className="text-base font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
