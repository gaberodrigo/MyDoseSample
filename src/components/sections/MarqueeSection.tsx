'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useScrollVelocity } from '@/hooks/useScrollVelocity'
import { useInView } from '@/hooks/useInView'
import { fadeUpVariants } from '@/animations/motionVariants'

const BASE_DURATION = 32
const MIN_DURATION = 26

const BRANDS = [
  { name: 'Vercel', symbol: '▲' },
  { name: 'Linear', symbol: '◆' },
  { name: 'Stripe', symbol: '◈' },
  { name: 'Figma', symbol: '◉' },
  { name: 'Notion', symbol: '◻' },
  { name: 'Arc', symbol: '◌' },
  { name: 'Loom', symbol: '◎' },
  { name: 'Raycast', symbol: '◈' },
]

function MarqueeTrack({
  reverse = false,
  trackRef,
}: {
  reverse?: boolean
  trackRef?: React.RefObject<HTMLDivElement | null>
}) {
  const items = [...BRANDS, ...BRANDS, ...BRANDS]

  return (
    <div
      ref={trackRef}
      className={reverse ? 'animate-marquee-reverse flex shrink-0' : 'animate-marquee flex shrink-0'}
      style={{ animationDuration: `${BASE_DURATION}s` }}
      aria-hidden="true"
    >
      {items.map((brand, i) => (
        <div
          key={`${brand.name}-${i}`}
          className="flex items-center gap-3 px-8 shrink-0"
        >
          <span className="text-muted-foreground/40 text-sm" aria-hidden="true">
            {brand.symbol}
          </span>
          <span className="text-sm font-medium text-muted-foreground/50 whitespace-nowrap tracking-wide">
            {brand.name}
          </span>
        </div>
      ))}
    </div>
  )
}

export function MarqueeSection() {
  const { velocity } = useScrollVelocity(0.03)
  const track1Ref = useRef<HTMLDivElement>(null)
  const track2Ref = useRef<HTMLDivElement>(null)
  const { ref: sectionRef, inView } = useInView()
  const currentDuration = useRef(BASE_DURATION)
  const rafId = useRef<number | undefined>(undefined)

  useEffect(() => {
    const normalizedVelocity = Math.min(velocity / 8000, 1)
    const targetDuration = BASE_DURATION - (BASE_DURATION - MIN_DURATION) * normalizedVelocity

    const tick = () => {
      // Lerp smoothly toward target duration at 4% per frame
      currentDuration.current += (targetDuration - currentDuration.current) * 0.04

      if (track1Ref.current) {
        track1Ref.current.style.animationDuration = `${currentDuration.current}s`
      }
      if (track2Ref.current) {
        track2Ref.current.style.animationDuration = `${currentDuration.current}s`
      }

      // Continue ticking until we've converged (within 0.05s of target)
      if (Math.abs(currentDuration.current - targetDuration) > 0.05) {
        rafId.current = requestAnimationFrame(tick)
      }
    }

    if (rafId.current !== undefined) cancelAnimationFrame(rafId.current)
    rafId.current = requestAnimationFrame(tick)

    return () => {
      if (rafId.current !== undefined) cancelAnimationFrame(rafId.current)
    }
  }, [velocity])

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="py-24 overflow-hidden"
      aria-label="Trusted by leading companies"
    >
      {/* Section label */}
      <motion.p
        className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground/50 font-medium mb-12"
        variants={fadeUpVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        Trusted by modern teams at
      </motion.p>

      {/* Row 1 */}
      <div className="relative flex overflow-hidden mb-4">
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="flex overflow-hidden">
          <MarqueeTrack trackRef={track1Ref} />
          <MarqueeTrack aria-hidden="true" />
        </div>
      </div>

      {/* Row 2 (reversed) */}
      <div className="relative flex overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="flex overflow-hidden">
          <MarqueeTrack reverse trackRef={track2Ref} />
          <MarqueeTrack reverse aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
