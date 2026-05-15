import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function shouldReduceMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function createGalleryReveal(root) {
  if (!root) {
    return { revert() {} }
  }

  if (shouldReduceMotion()) {
    gsap.set(root.querySelectorAll('[data-gallery-heading], [data-gallery-card]'), { clearProps: 'all' })
    return { revert() {} }
  }

  return gsap.context(() => {
    const cards = gsap.utils.toArray('[data-gallery-card]')

    gsap.from('[data-gallery-heading]', {
      y: 28,
      opacity: 0,
      duration: 0.82,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: root,
        start: 'top 84%',
        once: true,
      },
    })

    gsap.from(cards, {
      y: 34,
      opacity: 0,
      scale: 0.96,
      duration: 0.9,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: root,
        start: 'top 80%',
        once: true,
      },
    })

    cards.forEach((card, index) => {
      const media = card.querySelector('img')

      if (!media) {
        return
      }

      gsap.fromTo(
        media,
        { yPercent: -4 + (index % 3) },
        {
          yPercent: 4 - (index % 3),
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.7,
          },
        },
      )
    })
  }, root)
}
