'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { navItemVariants, staggerContainerVariants } from '@/animations/motionVariants'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { DiscountGameModal } from '@/components/game/DiscountGameModal'

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Showcase', href: '#showcase' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Docs', href: '#docs' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-background/70 backdrop-blur-xl border-b border-border/50 shadow-[0_1px_0_0_oklch(1_0_0_/_6%)]'
          : 'bg-transparent'
      )}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
    >
      <nav
        className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 group" aria-label="MyDose home">
          <div className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
            <span className="text-background text-xs font-bold">M</span>
          </div>
          <span className="font-semibold text-sm tracking-tight">MyDose</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8" role="list">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              role="listitem"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-foreground after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Sign in
          </a>
          <DiscountGameModal
            autoOpenDelay={5000}
            triggerVariant="ghost"
            triggerClassName="px-4 text-sm font-medium text-muted-foreground hover:text-foreground"
          />
          <Button size="sm" className="rounded-full px-5 text-sm font-medium">
            Get started
          </Button>
        </div>

        {/* Mobile menu */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger
            render={
              <button
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                className="md:hidden p-2 -mr-2 rounded-lg hover:bg-muted/50 transition-colors"
              />
            }
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <motion.line
                x1="2" y1="5" x2="18" y2="5"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                style={{ originX: '50%', originY: '50%' }}
              />
              <motion.line
                x1="2" y1="10" x2="18" y2="10"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.line
                x1="2" y1="15" x2="18" y2="15"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                animate={menuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                style={{ originX: '50%', originY: '50%' }}
              />
            </svg>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-background/95 backdrop-blur-xl border-l border-border/50">
            <div className="flex flex-col h-full pt-8">
              <motion.nav
                variants={staggerContainerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-1"
                aria-label="Mobile navigation"
              >
                {NAV_LINKS.map((link) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    variants={navItemVariants}
                    onClick={() => setMenuOpen(false)}
                    className="text-lg font-medium py-3 px-4 rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </motion.nav>

              <div className="mt-auto pb-8 flex flex-col gap-3">
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-col gap-3"
                    >
                      <a href="#" className="text-sm text-center text-muted-foreground hover:text-foreground transition-colors py-2">
                        Sign in
                      </a>
                      <DiscountGameModal
                        triggerVariant="outline"
                        triggerSize="lg"
                        fullWidthTrigger
                      />
                      <Button className="w-full rounded-full">Get started</Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </motion.header>
  )
}
