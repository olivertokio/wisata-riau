import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function reduceMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function createMapReveal(root) {
  if (!root || reduceMotion()) {
    return { revert() {} }
  }

  return gsap.context(() => {
    gsap.from('.map-reveal', {
      y: 36,
      opacity: 0,
      duration: 0.9,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: root,
        start: 'top 76%',
        once: true,
      },
    })

    gsap.from('.tourism-map-frame', {
      y: 56,
      opacity: 0,
      scale: 0.97,
      duration: 1.05,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: root,
        start: 'top 66%',
        once: true,
      },
    })
  }, root)
}

export function revealMarkers(elements) {
  if (!elements?.length || reduceMotion()) {
    return
  }

  gsap.fromTo(
    elements,
    { y: 18, scale: 0.4, opacity: 0 },
    {
      y: 0,
      scale: 1,
      opacity: 1,
      duration: 0.75,
      stagger: 0.08,
      ease: 'back.out(1.8)',
    },
  )

  gsap.to(elements, {
    y: -5,
    duration: 1.8,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    stagger: 0.16,
  })
}

export function animatePopup(element) {
  if (!element || reduceMotion()) {
    return
  }

  gsap.fromTo(
    element,
    { y: 16, opacity: 0, scale: 0.96 },
    { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out' },
  )
}
