import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function createScrollReveal(
  root,
  {
    targets = '[data-reveal]',
    trigger = root,
    start = 'top 78%',
    y = 32,
    duration = 0.85,
    stagger = 0.08,
    delay = 0,
    once = true,
  } = {},
) {
  if (!root) {
    return { revert() {} }
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reduceMotion) {
    gsap.set(root.querySelectorAll(targets), { clearProps: 'all' })
    return { revert() {} }
  }

  return gsap.context(() => {
    gsap.from(targets, {
      y,
      opacity: 0,
      duration,
      stagger,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger,
        start,
        once,
      },
    })
  }, root)
}

export { ScrollTrigger }
