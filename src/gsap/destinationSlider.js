import gsap from 'gsap'
import { Observer } from 'gsap/Observer'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, Observer)

function shouldReduceMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function createDestinationSliderAnimation(root, { onNext, onPrev } = {}) {
  if (!root) {
    return { revert() {} }
  }

  const reduceMotion = shouldReduceMotion()

  const context = gsap.context(() => {
    if (reduceMotion) {
      gsap.set('.destination-shell, .destination-copy > *, .destination-nav-item', { clearProps: 'all' })
      return
    }

    gsap.from('.destination-shell', {
      y: 44,
      opacity: 0,
      scale: 0.96,
      duration: 1.05,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: root,
        start: 'top 72%',
        once: true,
      },
    })

    gsap.from('.destination-nav-item', {
      y: 22,
      opacity: 0,
      duration: 0.75,
      stagger: 0.06,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: root,
        start: 'top 62%',
        once: true,
      },
    })
  }, root)

  const observer = Observer.create({
    target: root,
    type: 'wheel,touch,pointer',
    tolerance: 28,
    lockAxis: true,
    onLeft: onNext,
    onUp: onNext,
    onRight: onPrev,
    onDown: onPrev,
  })

  return {
    revert() {
      observer.kill()
      context.revert()
    },
  }
}

export function animateDestinationSlide(root, progressElement, durationSeconds) {
  if (!root) {
    return { kill() {} }
  }

  const reduceMotion = shouldReduceMotion()
  const context = gsap.context(() => {
    if (reduceMotion) {
      gsap.set(progressElement, { scaleX: 1 })
      return
    }

    gsap.fromTo(
      '.destination-media-active',
      { scale: 1.1, opacity: 0.7 },
      { scale: 1, opacity: 1, duration: 1.15, ease: 'power3.out' },
    )

    gsap.fromTo(
      '.destination-overlay',
      { opacity: 0.82 },
      { opacity: 1, duration: 0.8, ease: 'power2.out' },
    )

    gsap.fromTo(
      '.destination-copy > *',
      { y: 28, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.86, stagger: 0.08, ease: 'power3.out' },
    )

    if (progressElement) {
      gsap.fromTo(
        progressElement,
        { scaleX: 0 },
        { scaleX: 1, duration: durationSeconds, ease: 'none' },
      )
    }
  }, root)

  return context
}
