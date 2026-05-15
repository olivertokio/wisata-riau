import gsap from 'gsap'
import { Observer } from 'gsap/Observer'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, Observer)

function shouldReduceMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function createCategoryShowcaseAnimation(root) {
  if (!root || shouldReduceMotion()) {
    return { revert() {}, killObserver() {} }
  }

  const context = gsap.context(() => {
    gsap.from('.category-kicker, .category-heading, .category-lead', {
      y: 34,
      opacity: 0,
      duration: 0.9,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: root,
        start: 'top 72%',
        once: true,
      },
    })

    gsap.from('.category-showcase-card', {
      y: 56,
      opacity: 0,
      scale: 0.96,
      duration: 1,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.category-showcase-grid',
        start: 'top 78%',
        once: true,
      },
    })

    gsap.utils.toArray('.category-showcase-card').forEach((card) => {
      const media = card.querySelector('.category-media')

      if (media) {
        gsap.fromTo(
          media,
          { yPercent: -5, scale: 1.12 },
          {
            yPercent: 7,
            scale: 1.18,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      }
    })
  }, root)

  const observer = Observer.create({
    target: root,
    type: 'pointer,touch',
    onMove(self) {
      const rect = root.getBoundingClientRect()
      const x = (self.x - rect.left - rect.width / 2) / rect.width
      const y = (self.y - rect.top - rect.height / 2) / rect.height

      gsap.to(root.querySelectorAll('.category-showcase-card'), {
        x: (index) => x * (index % 2 === 0 ? 8 : -6),
        y: (index) => y * (index % 2 === 0 ? 5 : -5),
        duration: 0.7,
        ease: 'power3.out',
      })
    },
    onHoverEnd() {
      gsap.to(root.querySelectorAll('.category-showcase-card'), {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
    },
  })

  return {
    revert() {
      observer.kill()
      context.revert()
    },
    killObserver() {
      observer.kill()
    },
  }
}

export function animateCategoryHover(card) {
  if (!card || shouldReduceMotion()) {
    return
  }

  gsap.to(card.querySelector('.category-media'), {
    scale: 1.24,
    duration: 0.85,
    ease: 'power3.out',
  })
  gsap.to(card.querySelector('.category-content'), {
    y: -14,
    duration: 0.55,
    ease: 'power3.out',
  })
  gsap.to(card.querySelector('.category-shade'), {
    opacity: 0.92,
    duration: 0.45,
    ease: 'power2.out',
  })
}

export function animateCategoryLeave(card) {
  if (!card || shouldReduceMotion()) {
    return
  }

  gsap.to(card.querySelector('.category-media'), {
    scale: 1.14,
    duration: 0.85,
    ease: 'power3.out',
  })
  gsap.to(card.querySelector('.category-content'), {
    y: 0,
    duration: 0.55,
    ease: 'power3.out',
  })
  gsap.to(card.querySelector('.category-shade'), {
    opacity: 0.78,
    duration: 0.45,
    ease: 'power2.out',
  })
}
