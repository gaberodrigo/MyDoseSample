'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useLenis } from '@/hooks/useLenis'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { easeOutExpo } from '@/animations/easings'
import { cn } from '@/lib/utils'
import { GameBoyShell } from './GameBoyShell'
import type { PacmanControls } from './PacmanGame'

const PacmanGame = dynamic(() => import('./PacmanGame'), {
  ssr: false,
  loading: () => (
    <div
      className="absolute inset-0 flex items-center justify-center text-center"
      style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '8px',
        color: '#2f3a16',
        letterSpacing: '0.08em',
      }}
    >
      LOADING…
    </div>
  ),
})

const DISCOUNT_CODE = 'DOSE10'

let autoOpenConsumed = false

interface DiscountGameModalProps {
  triggerClassName?: string
  triggerVariant?: 'default' | 'outline' | 'secondary' | 'ghost'
  triggerSize?: 'default' | 'sm' | 'lg'
  fullWidthTrigger?: boolean
  /** Open automatically once per page load after this many ms. Only pass on one instance. */
  autoOpenDelay?: number
}

export function DiscountGameModal({
  triggerClassName,
  triggerVariant = 'outline',
  triggerSize = 'sm',
  fullWidthTrigger = false,
  autoOpenDelay,
}: DiscountGameModalProps) {
  const [open, setOpen] = useState(false)
  const [won, setWon] = useState(false)
  const [muted, setMuted] = useState(false)
  const lenis = useLenis()
  const prefersReducedMotion = useReducedMotion()
  const restoreRef = useRef<{ overflow: string; paddingRight: string } | null>(null)
  const skipAutoOpenRef = useRef(false)

  // Lock all background scrolling (Lenis runs its own RAF, so stop it explicitly).
  useEffect(() => {
    if (open) {
      lenis?.stop()
      const body = document.body
      const sbw = window.innerWidth - document.documentElement.clientWidth
      restoreRef.current = {
        overflow: body.style.overflow,
        paddingRight: body.style.paddingRight,
      }
      body.style.overflow = 'hidden'
      if (sbw > 0) body.style.paddingRight = `${sbw}px`
    } else {
      lenis?.start()
      if (restoreRef.current) {
        document.body.style.overflow = restoreRef.current.overflow
        document.body.style.paddingRight = restoreRef.current.paddingRight
        restoreRef.current = null
      }
    }
    return () => {
      if (!open) return
      lenis?.start()
      if (restoreRef.current) {
        document.body.style.overflow = restoreRef.current.overflow
        document.body.style.paddingRight = restoreRef.current.paddingRight
        restoreRef.current = null
      }
    }
  }, [open, lenis])

  const handleOpenChange = useCallback((next: boolean) => {
    if (!next) skipAutoOpenRef.current = true
    setOpen(next)
    setWon(false)
  }, [])

  useEffect(() => {
    if (autoOpenDelay == null || prefersReducedMotion || autoOpenConsumed) return
    autoOpenConsumed = true

    const id = setTimeout(() => {
      if (skipAutoOpenRef.current) return
      setOpen(true)
    }, autoOpenDelay)

    return () => {
      clearTimeout(id)
      autoOpenConsumed = false
    }
  }, [autoOpenDelay, prefersReducedMotion])

  const handleWin = useCallback(() => setWon(true), [])

  const controlsRef = useRef<PacmanControls | null>(null)
  const handleReady = useCallback((c: PacmanControls) => {
    controlsRef.current = c
  }, [])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            variant={triggerVariant}
            size={triggerSize}
            className={cn(
              'rounded-full',
              fullWidthTrigger && 'w-full',
              triggerClassName
            )}
          />
        }
      >
        Get Discount
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[480px] max-h-[92vh] overflow-y-auto"
        aria-describedby="discount-game-desc"
      >
        <div className="flex items-start justify-between gap-4 pr-8">
          <div>
            <DialogTitle className="text-base">Collect every token, get 10% off</DialogTitle>
            <DialogDescription id="discount-game-desc" className="mt-1">
              Use the D-pad,{' '}
              <kbd className="px-1 rounded bg-muted text-foreground text-[11px]">W A S D</kbd>{' '}
              or arrow keys to move. Clear the maze without getting caught — press
              START to retry.
            </DialogDescription>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? 'Unmute game sound' : 'Mute game sound'}
            className="shrink-0 -mt-1"
          >
            {muted ? <VolumeX /> : <Volume2 />}
          </Button>
        </div>

        <div className="relative mt-2 flex justify-center">
          {open && (
            <GameBoyShell
              onDirection={(dir) => controlsRef.current?.setDirection(dir)}
              onStart={() => controlsRef.current?.restart()}
            >
              <PacmanGame
                onWin={handleWin}
                muted={muted}
                paused={won}
                embedded
                onReady={handleReady}
              />
            </GameBoyShell>
          )}

          <AnimatePresence>
            {won && (
              <motion.div
                key="win"
                className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-background/85 backdrop-blur-sm text-center px-6"
                initial={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.96 }
                }
                animate={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : { opacity: 1, scale: 1 }
                }
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: easeOutExpo }}
              >
                {!prefersReducedMotion && (
                  <motion.div
                    className="absolute w-56 h-56 rounded-full pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(circle, oklch(0.7 0.05 250 / 35%), transparent 70%)',
                    }}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: [0.4, 1.15, 1], opacity: [0, 0.8, 0.5] }}
                    transition={{ duration: 1.1, ease: easeOutExpo }}
                    aria-hidden="true"
                  />
                )}

                <motion.div
                  className="relative w-14 h-14 rounded-full bg-foreground text-background flex items-center justify-center text-2xl mb-5"
                  initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0, rotate: -20 }}
                  animate={prefersReducedMotion ? { opacity: 1 } : { scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.1,
                    type: prefersReducedMotion ? 'tween' : 'spring',
                    stiffness: 260,
                    damping: 16,
                  }}
                  aria-hidden="true"
                >
                  ✓
                </motion.div>

                <h3 className="relative text-2xl font-bold tracking-tight mb-2">
                  10% discount added
                </h3>
                <p className="relative text-sm text-muted-foreground mb-5 max-w-xs">
                  Nice run. Your code is applied at checkout — or copy it below.
                </p>
                <div className="relative flex items-center gap-3">
                  <code className="px-4 py-2 rounded-lg bg-muted ring-1 ring-border text-sm font-mono tracking-widest">
                    {DISCOUNT_CODE}
                  </code>
                  <Button
                    size="sm"
                    className="rounded-full"
                    onClick={() => {
                      navigator.clipboard?.writeText(DISCOUNT_CODE).catch(() => {})
                    }}
                  >
                    Copy code
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative mt-6 rounded-full"
                  onClick={() => handleOpenChange(false)}
                >
                  Done
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}
