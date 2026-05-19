import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

gsap.config({
  force3D: true,
  nullTargetWarn: false,
})

export { gsap, ScrollTrigger }

export const GSAP_EASINGS = {
  smooth: 'power3.out',
  expo: 'expo.out',
  back: 'back.out(1.7)',
  elastic: 'elastic.out(1, 0.75)',
} as const
