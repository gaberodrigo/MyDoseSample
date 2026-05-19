'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { DiscountGameModal } from '@/components/game/DiscountGameModal'
import { useInView } from '@/hooks/useInView'
import { fadeUpVariants, staggerContainerVariants } from '@/animations/motionVariants'
import { easeOutExpo } from '@/animations/easings'

export function CTASection() {
  const { ref, inView } = useInView()

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative py-40 px-6 overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 100%, oklch(0.4 0.04 250 / 12%), transparent)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-32"
        style={{ background: 'linear-gradient(to bottom, oklch(1 0 0 / 8%), transparent)' }}
        aria-hidden="true"
      />

      <motion.div
        className="relative z-10 max-w-3xl mx-auto text-center"
        variants={staggerContainerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        <motion.span
          className="text-xs uppercase tracking-[0.2em] text-muted-foreground/50 font-medium block mb-6"
          variants={fadeUpVariants}
        >
          Get started today
        </motion.span>

        <motion.h2
          id="cta-heading"
          className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 text-balance"
          variants={fadeUpVariants}
        >
          Ready to run
          <br />
          <span className="text-muted-foreground">protocols at scale?</span>
        </motion.h2>

        <motion.p
          className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto leading-relaxed text-balance"
          variants={fadeUpVariants}
        >
          Clinics running modern protocols. Patients seeking structure. One platform that
          connects intake, dosing, and pharmacy — ready from day one.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          variants={fadeUpVariants}
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <Button
              size="lg"
              className="relative overflow-hidden rounded-full px-10 h-13 text-base font-medium group shadow-[0_0_0_1px_oklch(1_0_0_/_20%),0_0_60px_oklch(0.5_0.04_250_/_20%)]"
            >
              <motion.span
                className="absolute inset-0 bg-white/10"
                initial={{ x: '-110%' }}
                whileHover={{ x: '110%' }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                aria-hidden="true"
              />
              Get started
              <span className="ml-2" aria-hidden="true">→</span>
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <Button
              size="lg"
              variant="ghost"
              className="rounded-full px-8 h-13 text-base text-muted-foreground hover:text-foreground"
            >
              Talk to sales
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <DiscountGameModal
              triggerVariant="ghost"
              triggerSize="lg"
              triggerClassName="px-8 h-13 text-base text-muted-foreground hover:text-foreground"
            />
          </motion.div>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground/40"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: easeOutExpo }}
        >
          {['HIPAA-secure', '503A pharmacy network', 'Audit trails', 'Licensed provider oversight'].map(
            (item, i) => (
              <span key={item} className="flex items-center gap-2">
                {i > 0 && (
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/20" aria-hidden="true" />
                )}
                {item}
              </span>
            )
          )}
        </motion.div>
      </motion.div>
    </section>
  )
}
