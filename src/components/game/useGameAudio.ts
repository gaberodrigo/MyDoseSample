'use client'

import { useCallback, useEffect, useRef } from 'react'

type WindowWithWebkitAudio = Window &
  typeof globalThis & { webkitAudioContext?: typeof AudioContext }

/**
 * Tiny Web Audio synth for the token-run game.
 * No audio assets, no dependencies — just oscillators.
 * The AudioContext is created lazily on the first sound (which always
 * follows a user gesture: starting the game), satisfying autoplay policies.
 */
export function useGameAudio(muted: boolean) {
  const ctxRef = useRef<AudioContext | null>(null)

  const getCtx = useCallback((): AudioContext | null => {
    if (typeof window === 'undefined') return null
    if (!ctxRef.current) {
      const Ctor =
        window.AudioContext || (window as WindowWithWebkitAudio).webkitAudioContext
      if (!Ctor) return null
      ctxRef.current = new Ctor()
    }
    if (ctxRef.current.state === 'suspended') {
      void ctxRef.current.resume()
    }
    return ctxRef.current
  }, [])

  const tone = useCallback(
    (freq: number, duration: number, type: OscillatorType = 'square', gain = 0.04) => {
      if (muted) return
      const ctx = getCtx()
      if (!ctx) return
      const osc = ctx.createOscillator()
      const amp = ctx.createGain()
      osc.type = type
      osc.frequency.value = freq
      amp.gain.setValueAtTime(gain, ctx.currentTime)
      amp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
      osc.connect(amp).connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + duration)
    },
    [muted, getCtx]
  )

  const playCollect = useCallback(() => {
    tone(520 + Math.random() * 120, 0.07, 'square', 0.03)
  }, [tone])

  const playDeath = useCallback(() => {
    const ctx = getCtx()
    if (muted || !ctx) return
    const osc = ctx.createOscillator()
    const amp = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(440, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.45)
    amp.gain.setValueAtTime(0.05, ctx.currentTime)
    amp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45)
    osc.connect(amp).connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.45)
  }, [muted, getCtx])

  const playWin = useCallback(() => {
    if (muted) return
    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((f, i) => {
      window.setTimeout(() => tone(f, 0.18, 'triangle', 0.05), i * 130)
    })
  }, [muted, tone])

  useEffect(() => {
    return () => {
      if (ctxRef.current && ctxRef.current.state !== 'closed') {
        void ctxRef.current.close()
      }
      ctxRef.current = null
    }
  }, [])

  return { playCollect, playDeath, playWin }
}
