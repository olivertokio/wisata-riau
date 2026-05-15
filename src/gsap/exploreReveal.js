import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function shouldReduceMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function createExploreReveal(root) {
  if (!root) {
    return { revert() {} }
  }

  if (shouldReduceMotion()) {
    gsap.set(root.querySelectorAll('[data-explore-hero], [data-explore-filter], [data-explore-section], [data-explore-featured], [data-directory-card]'), {
      clearProps: 'all',
    })
    return { revert() {} }
  }

  return gsap.context(() => {
    gsap.from('[data-explore-hero]', {
      y: 28,
      opacity: 0,
      duration: 0.82,
      stagger: 0.08,
      ease: 'power3.out',
    })

    gsap.from('[data-explore-filter]', {
      y: 24,
      opacity: 0,
      duration: 0.82,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: root.querySelector('[data-explore-filter]'),
        start: 'top 88%',
        once: true,
      },
    })

    gsap.from('[data-explore-section]', {
      y: 28,
      opacity: 0,
      duration: 0.84,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: root.querySelector('[data-explore-section]'),
        start: 'top 80%',
        once: true,
      },
    })

    gsap.from('[data-explore-featured]', {
      y: 28,
      opacity: 0,
      duration: 0.84,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: root.querySelector('[data-explore-featured]'),
        start: 'top 82%',
        once: true,
      },
    })
  }, root)
}

export function animateExploreCards(root) {
  if (!root) {
    return { kill() {} }
  }

  const cards = root.querySelectorAll('[data-directory-card]')

  if (!cards.length || shouldReduceMotion()) {
    gsap.set(cards, { clearProps: 'all' })
    return { kill() {} }
  }

  return gsap.fromTo(
    cards,
    { y: 24, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.72,
      stagger: 0.08,
      ease: 'power3.out',
      overwrite: 'auto',
    },
  )
}
