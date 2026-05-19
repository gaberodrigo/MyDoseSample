'use client'

import dynamic from 'next/dynamic'

const MarqueeSection = dynamic(
  () => import('@/components/sections/MarqueeSection').then((m) => ({ default: m.MarqueeSection })),
  { ssr: false, loading: () => <div className="h-24" /> }
)

const FeaturesSection = dynamic(
  () => import('@/components/sections/FeaturesSection').then((m) => ({ default: m.FeaturesSection })),
  { ssr: false, loading: () => <div className="min-h-[60vh]" /> }
)

const FloatingCardsSection = dynamic(
  () =>
    import('@/components/sections/FloatingCardsSection').then((m) => ({
      default: m.FloatingCardsSection,
    })),
  { ssr: false, loading: () => <div className="min-h-[140vh]" /> }
)

const DeckCardsSection = dynamic(
  () =>
    import('@/components/sections/DeckCardsSection').then((m) => ({ default: m.DeckCardsSection })),
  { ssr: false, loading: () => <div className="min-h-screen" /> }
)

const CTASection = dynamic(
  () => import('@/components/sections/CTASection').then((m) => ({ default: m.CTASection })),
  { ssr: false, loading: () => <div className="h-64" /> }
)

export function ClientSections() {
  return (
    <>
      <MarqueeSection />
      <FeaturesSection />
      <FloatingCardsSection />
      <DeckCardsSection />
      <CTASection />
    </>
  )
}
