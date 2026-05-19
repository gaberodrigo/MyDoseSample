'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/animations/gsapConfig'
import { useInView } from '@/hooks/useInView'
import { fadeUpVariants, staggerContainerVariants } from '@/animations/motionVariants'

gsap.registerPlugin(ScrollTrigger)

const CARDS = [
  {
    id: 1,
    title: 'Real-time sync',
    body: 'Changes propagate in under 50ms across your entire team.',
    speed: 0.55,
    className: 'top-[8%] left-[4%] rotate-[-5deg]',
    shadow: 4,
  },
  {
    id: 2,
    title: 'Smart workflows',
    body: 'Automate repetitive tasks with no-code visual pipelines.',
    speed: 1.0,
    className: 'top-[22%] left-[28%]',
    shadow: 2,
  },
  {
    id: 3,
    title: 'Audit trail',
    body: 'Every action, logged. Full compliance out of the box.',
    speed: 0.75,
    className: 'top-[4%] right-[8%] rotate-[4deg]',
    shadow: 3,
  },
  {
    id: 4,
    title: 'Custom roles',
    body: 'Granular permissions so every team member sees what they need.',
    speed: 1.4,
    className: 'bottom-[18%] left-[12%] rotate-[5deg]',
    shadow: 1,
  },
  {
    id: 5,
    title: 'Analytics',
    body: 'Understand exactly where time goes with intelligent dashboards.',
    speed: 0.45,
    className: 'bottom-[12%] right-[6%] rotate-[-3deg]',
    shadow: 5,
  },
]

export function FloatingCardsSection() {
  const containerRef = useRef<HTMLElement>(null)
  const { ref: headingRef, inView } = useInView()

  useGSAP(
    () => {
      const cards = containerRef.current?.querySelectorAll('[data-speed]')
      cards?.forEach((card) => {
        const speed = parseFloat((card as HTMLElement).dataset.speed ?? '1')
        gsap.to(card, {
          y: () => (1 - speed) * 200,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        })
      })
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      className="relative py-32 min-h-[140vh] overflow-hidden"
      aria-labelledby="floating-heading"
    >
      {/* Section heading */}
      <div
        ref={headingRef as React.RefObject<HTMLDivElement>}
        className="relative z-10 text-center max-w-2xl mx-auto px-6 mb-0"
      >
        <motion.span
          className="text-xs uppercase tracking-[0.2em] text-muted-foreground/50 font-medium block mb-4"
          variants={fadeUpVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          What&apos;s inside
        </motion.span>
        <motion.h2
          id="floating-heading"
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance"
          variants={fadeUpVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{ delay: 0.1 }}
        >
          Everything you need,
          <br />
          <span className="text-muted-foreground">nothing you don&apos;t.</span>
        </motion.h2>
        <motion.p
          className="text-muted-foreground leading-relaxed text-balance"
          variants={fadeUpVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{ delay: 0.2 }}
        >
          Built for the way your team actually works. No configuration required.
        </motion.p>
      </div>

      {/* Floating cards arena */}
      <div className="relative mt-16 h-[80vh] max-w-6xl mx-auto px-6">
        {CARDS.map((card) => (
          <div
            key={card.id}
            data-speed={card.speed}
            className={`absolute w-[260px] will-change-transform ${card.className}`}
          >
            <div
              className="glass-dark rounded-2xl p-6"
              style={{
                boxShadow: `0 ${card.shadow * 8}px ${card.shadow * 20}px oklch(0 0 0 / ${0.12 + card.shadow * 0.04}), 0 1px 0 oklch(1 0 0 / 6%) inset`,
                filter: card.shadow >= 4 ? 'none' : `blur(${(4 - card.shadow) * 0.3}px)`,
              }}
            >
              <div className="w-8 h-8 rounded-lg bg-muted/50 mb-4 flex items-center justify-center">
                <span className="text-muted-foreground text-xs" aria-hidden="true">◈</span>
              </div>
              <h3 className="text-sm font-semibold mb-2">{card.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{card.body}</p>
            </div>
          </div>
        ))}

        {/* Center decorative element */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, oklch(0.5 0.04 250 / 12%) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
          aria-hidden="true"
        />
      </div>
    </section>
  )
}
