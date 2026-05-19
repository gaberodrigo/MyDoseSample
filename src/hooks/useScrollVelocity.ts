'use client'

import { useEffect, useRef, useState } from 'react'

interface ScrollVelocityState {
  velocity: number
  direction: 1 | -1
}

export function useScrollVelocity(smoothing = 0.1): ScrollVelocityState {
  const [state, setState] = useState<ScrollVelocityState>({ velocity: 0, direction: 1 })
  const lastScrollY = useRef(0)
  const lastTime = useRef(Date.now())
  const rafId = useRef<number | undefined>(undefined)
  const smoothedVelocity = useRef(0)

  useEffect(() => {
    const update = () => {
      const now = Date.now()
      const dt = now - lastTime.current
      const currentScrollY = window.scrollY

      if (dt > 0) {
        const rawVelocity = ((currentScrollY - lastScrollY.current) / dt) * 1000
        smoothedVelocity.current =
          smoothedVelocity.current * (1 - smoothing) + rawVelocity * smoothing

        setState({
          velocity: Math.abs(smoothedVelocity.current),
          direction: smoothedVelocity.current >= 0 ? 1 : -1,
        })
      }

      lastScrollY.current = currentScrollY
      lastTime.current = now
      rafId.current = requestAnimationFrame(update)
    }

    rafId.current = requestAnimationFrame(update)
    return () => {
      if (rafId.current !== undefined) cancelAnimationFrame(rafId.current)
    }
  }, [smoothing])

  return state
}
