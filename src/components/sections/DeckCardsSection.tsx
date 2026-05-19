'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import { fadeUpVariants } from '@/animations/motionVariants'

const DECK = [
  {
    id: 0,
    label: 'Design system',
    detail: 'Tokens, components, and guidelines in one place.',
    gradient: 'from-zinc-900 via-zinc-800 to-zinc-900',
    accent: 'oklch(0.7 0.04 250)',
  },
  {
    id: 1,
    label: 'Version control',
    detail: 'Branch, review, and merge with confidence.',
    gradient: 'from-zinc-800 via-zinc-700 to-zinc-800',
    accent: 'oklch(0.6 0.05 220)',
  },
  {
    id: 2,
    label: 'Live collaboration',
    detail: 'See cursors, edits, and comments in real time.',
    gradient: 'from-zinc-700 via-zinc-600 to-zinc-700',
    accent: 'oklch(0.65 0.04 280)',
  },
  {
    id: 3,
    label: 'Smart deploy',
    detail: 'Preview, validate, and ship to any environment.',
    gradient: 'from-zinc-600 via-zinc-500 to-zinc-600',
    accent: 'oklch(0.7 0.03 200)',
  },
  {
    id: 4,
    label: 'Observability',
    detail: 'Traces, logs, and metrics without the overhead.',
    gradient: 'from-zinc-500 via-zinc-400 to-zinc-500',
    accent: 'oklch(0.75 0.04 240)',
  },
]

// Container dimensions
const CONTAINER_W = 520
const CONTAINER_H = 320
const CARD_W = 180
const CARD_H = 260
// Horizontal offset between card centers
const CARD_SPREAD = 72
// Amount neighbors shift away from hovered card
const NEIGHBOR_PUSH = 28

export function DeckCardsSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const { ref, inView } = useInView()

  const cardBaseLeft = (CONTAINER_W - CARD_W) / 2
  const cardBaseTop = (CONTAINER_H - CARD_H) / 2

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-32 px-6"
      aria-labelledby="deck-heading"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Copy */}
        <div>
          <motion.span
            className="text-xs uppercase tracking-[0.2em] text-muted-foreground/50 font-medium block mb-4"
            variants={fadeUpVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            The platform
          </motion.span>
          <motion.h2
            id="deck-heading"
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-balance"
            variants={fadeUpVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            transition={{ delay: 0.1 }}
          >
            One surface for your entire workflow.
          </motion.h2>
          <motion.p
            className="text-muted-foreground leading-relaxed mb-8 text-balance"
            variants={fadeUpVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            transition={{ delay: 0.2 }}
          >
            From the first line of code to the last production deploy. Every tool your team needs,
            integrated seamlessly so context never leaves the room.
          </motion.p>

          {/* Feature list */}
          <motion.ul
            className="space-y-3"
            variants={fadeUpVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            transition={{ delay: 0.3 }}
          >
            {DECK.map((card) => (
              <li
                key={card.id}
                className="flex items-center gap-3 text-sm text-muted-foreground"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0 transition-transform duration-300"
                  style={{
                    background: hoveredIndex === card.id ? card.accent : 'oklch(0.556 0 0)',
                    transform: hoveredIndex === card.id ? 'scale(1.8)' : 'scale(1)',
                  }}
                  aria-hidden="true"
                />
                <span className={hoveredIndex === card.id ? 'text-foreground' : ''}
                  style={{ transition: 'color 0.2s' }}>
                  {card.label}
                </span>
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Deck of cards — desktop only */}
        <motion.div
          className="hidden lg:flex items-center justify-center"
          variants={fadeUpVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{ delay: 0.2 }}
        >
          <div
            className="relative"
            style={{ width: CONTAINER_W, height: CONTAINER_H }}
            role="list"
            aria-label="Feature cards"
          >
            {DECK.map((card, i) => {
              const isHovered = hoveredIndex === i
              const isLeft = hoveredIndex !== null && i < hoveredIndex
              const isRight = hoveredIndex !== null && i > hoveredIndex

              // Base fan position: symmetric X spread, slight arc on Y
              const baseX = (i - 2) * CARD_SPREAD
              const baseY = Math.abs(i - 2) * 6
              const baseRotate = (i - 2) * 5

              // Neighbor push: cards left of hovered slide further left, right slide right
              const neighborPushX = isLeft ? -NEIGHBOR_PUSH : isRight ? NEIGHBOR_PUSH : 0

              const targetX = baseX + neighborPushX
              const targetY = isHovered ? baseY - 20 : baseY
              const targetRotate = isHovered ? 0 : baseRotate
              const targetScale = isHovered ? 1.04 : hoveredIndex !== null ? 0.97 : 1

              return (
                <motion.div
                  key={card.id}
                  role="listitem"
                  tabIndex={0}
                  aria-label={card.label}
                  className={`absolute rounded-2xl bg-gradient-to-br ${card.gradient} cursor-pointer overflow-hidden`}
                  style={{
                    width: CARD_W,
                    height: CARD_H,
                    left: cardBaseLeft,
                    top: cardBaseTop,
                    zIndex: isHovered ? 100 : 5 - i,
                    willChange: 'transform',
                    originX: '50%',
                    originY: '80%',
                  }}
                  animate={{
                    x: targetX,
                    y: targetY,
                    rotate: targetRotate,
                    scale: targetScale,
                    boxShadow: isHovered
                      ? `0 32px 64px oklch(0 0 0 / 55%), 0 0 0 1px ${card.accent}30`
                      : `0 ${6 + i * 4}px ${16 + i * 10}px oklch(0 0 0 / ${0.2 + i * 0.06})`,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 220,
                    damping: 26,
                    mass: 0.9,
                  }}
                  onHoverStart={() => setHoveredIndex(i)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  onFocus={() => setHoveredIndex(i)}
                  onBlur={() => setHoveredIndex(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setHoveredIndex(i)
                  }}
                >
                  {/* Inner glow on hover */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 50% 30%, ${card.accent}18, transparent 70%)`,
                    }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.25 }}
                    aria-hidden="true"
                  />

                  {/* Top accent line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px opacity-20"
                    style={{ background: `linear-gradient(90deg, transparent, ${card.accent}, transparent)` }}
                    aria-hidden="true"
                  />

                  <div className="absolute inset-0 p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: `${card.accent}20` }}
                        aria-hidden="true"
                      >
                        <span className="text-xs" style={{ color: card.accent }}>◈</span>
                      </div>
                      <span className="text-[10px] text-white/30 font-medium">{String(i + 1).padStart(2, '0')}</span>
                    </div>

                    <div>
                      <h3 className="text-white font-semibold text-sm mb-1.5 leading-tight">
                        {card.label}
                      </h3>
                      <p className="text-white/50 text-[10px] leading-relaxed">{card.detail}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Mobile: simple vertical list */}
        <motion.div
          className="lg:hidden flex flex-col gap-3"
          variants={fadeUpVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{ delay: 0.3 }}
        >
          {DECK.map((card) => (
            <div
              key={card.id}
              className={`rounded-2xl bg-gradient-to-br ${card.gradient} p-5`}
            >
              <h3 className="text-white font-semibold text-sm mb-1">{card.label}</h3>
              <p className="text-white/50 text-xs leading-relaxed">{card.detail}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
