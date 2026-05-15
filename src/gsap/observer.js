import gsap from 'gsap'
import { Observer } from 'gsap/Observer'

gsap.registerPlugin(Observer)

export function createObserver(target, options = {}) {
  return Observer.create({
    target,
    type: 'wheel,touch,pointer',
    ...options,
  })
}

export { Observer }
