import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function refreshScrollTrigger() {
  ScrollTrigger.refresh()
}

export { ScrollTrigger }

