'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/animations/gsapConfig'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { easeOutExpo } from '@/animations/easings'

gsap.registerPlugin(ScrollTrigger)

const HEADLINE_WORDS = ['Protocol-based', 'care,', 'built', 'as', 'infrastructure.']

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null)
  const blobRefs = {
    b1: useRef<HTMLDivElement>(null),
    b2: useRef<HTMLDivElement>(null),
    b3: useRef<HTMLDivElement>(null),
  }
  const wordsRef = useRef<HTMLSpanElement[]>([])

  useGSAP(
    () => {
      // Text mask reveal — each word slides up from hidden overflow
      const tl = gsap.timeline({ delay: 0.5 })
      tl.from(wordsRef.current, {
        y: '110%',
        opacity: 0,
        duration: 0.9,
        stagger: 0.06,
        ease: 'power4.out',
      })

      // Parallax blobs on scroll
      gsap.to(blobRefs.b1.current, {
        y: '-25%',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.to(blobRefs.b2.current, {
        y: '20%',
        x: '-8%',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.to(blobRefs.b3.current, {
        y: '-15%',
        x: '6%',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 pt-16"
      aria-labelledby="hero-heading"
    >
      {/* Background gradient blobs */}
      <div
        ref={blobRefs.b1}
        className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] rounded-full will-change-transform pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, oklch(0.4 0.05 250 / 18%) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        aria-hidden="true"
      />
      <div
        ref={blobRefs.b2}
        className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full will-change-transform pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, oklch(0.5 0.03 200 / 14%) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        aria-hidden="true"
      />
      <div
        ref={blobRefs.b3}
        className="absolute top-[30%] right-[20%] w-[400px] h-[400px] rounded-full will-change-transform pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, oklch(0.6 0.04 280 / 10%) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        aria-hidden="true"
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(oklch(1 0 0) 1px, transparent 1px),
            linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.2 }}
        >
          <Badge
            variant="outline"
            className="mb-8 px-4 py-1.5 text-xs font-medium rounded-full border-border/60 bg-muted/30 backdrop-blur-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="mr-2 inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-[pulse-ring_2s_ease-in-out_infinite]" />
            Now onboarding clinics
          </Badge>
        </motion.div>

        {/* Headline — GSAP mask reveal per word */}
        <h1
          id="hero-heading"
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] text-balance mb-6"
        >
          {HEADLINE_WORDS.map((word, i) => (
            <span
              key={i}
              className="inline-block overflow-hidden mr-[0.3em] last:mr-0"
              aria-hidden="true"
            >
              <span
                ref={(el) => {
                  if (el) wordsRef.current[i] = el
                }}
                className="inline-block will-change-transform"
              >
                {word}
              </span>
            </span>
          ))}
          <span className="sr-only">{HEADLINE_WORDS.join(' ')}</span>
        </h1>

        {/* Subheadline */}
        <motion.p
          className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-12 text-balance"
          initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: easeOutExpo, delay: 1.0 }}
        >
          Most telehealth platforms own your patients. MyDose doesn&apos;t. Intake, prescribing,
          dosing, and pharmacy — connected, compliant, and yours from day one.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOutExpo, delay: 1.2 }}
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <Button
              size="lg"
              className="relative overflow-hidden rounded-full px-8 h-12 text-sm font-medium shadow-[0_0_0_1px_oklch(1_0_0_/_20%)] group"
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
              className="rounded-full px-8 h-12 text-sm font-medium text-muted-foreground hover:text-foreground border border-border/50 hover:border-border"
            >
              Book a walkthrough
            </Button>
          </motion.div>
        </motion.div>

        {/* Social proof */}
        <motion.div
          className="mt-12 flex items-center gap-6 text-xs text-muted-foreground/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          <span>Trusted by modern clinics</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/40" aria-hidden="true" />
          <span>HIPAA-secure</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/40" aria-hidden="true" />
          <span>Full audit trails</span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.6, ease: easeOutExpo }}
        aria-hidden="true"
      >
        <div className="w-5 h-9 rounded-full border border-foreground/20 flex items-start justify-center p-1">
          <motion.div
            className="w-1 h-2 rounded-full bg-foreground/40"
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/40 font-medium">
          scroll
        </span>
      </motion.div>
    </section>
  )
}
