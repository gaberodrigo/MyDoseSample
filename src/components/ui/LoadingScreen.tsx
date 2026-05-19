'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function LoadingScreen() {
  const [visible, setVisible] = useState(true)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) {
      setVisible(false)
      return
    }

    const hide = () => {
      // Small delay after load so the fade feels intentional, not rushed
      setTimeout(() => setVisible(false), 180)
    }

    if (document.readyState === 'complete') {
      hide()
    } else {
      window.addEventListener('load', hide, { once: true })
      // Hard fallback — never block past 2.5s
      const fallback = setTimeout(() => setVisible(false), 2500)
      return () => {
        window.removeEventListener('load', hide)
        clearTimeout(fallback)
      }
    }
  }, [prefersReducedMotion])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
          aria-hidden="true"
        >
          {/* Animated mark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{
              opacity: [0, 1, 1, 1],
              scale: [0.88, 1, 1.05, 1],
            }}
            transition={{
              duration: 1.6,
              times: [0, 0.2, 0.6, 1],
              ease: 'easeInOut',
              repeat: Infinity,
              repeatType: 'reverse',
              repeatDelay: 0.1,
            }}
            className="w-7 h-7 rounded-[6px] bg-foreground"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
