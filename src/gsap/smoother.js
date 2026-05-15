import Lenis from '@studio-freight/lenis'

export function createSmoothScroll(options = {}) {
  const lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
    ...options,
  })

  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }

  requestAnimationFrame(raf)

  return lenis
}

