import { useEffect } from 'react'
import { addListener } from './queryListeners'

const SENSITIVITY = 10000

export default function useMinVh() {
	useEffect(() => {
		let rafId
		const mediaQueries = []

		function update() {
			rafId = requestAnimationFrame(() => {
				rafId = undefined
				const height = Math.round(SENSITIVITY / mediaQueries.lastIndexOf(true) * window.innerWidth)
				if (height !== window._minVh) {
					window._minVh = height
					document.body.style.setProperty('--min-vh', `${height}px`)
					window.dispatchEvent(new CustomEvent('resize'))
				}
			})
		}

		function onChange(event, i) {
			mediaQueries[i] = event.matches
			if (!rafId) {
				update()
			}
		}

		for (let i = 1; i <= SENSITIVITY * 3; i++) {
			const query = `(min-aspect-ratio: ${i} / ${SENSITIVITY})`
			const mql = window.matchMedia(query)
			mediaQueries[i] = mql.matches
			addListener(mql, (e) => onChange(e, i))
		}

		const hmin = window._minVh = window.innerHeight
		document.body.style.setProperty('--min-vh', `${hmin}px`)
	}, [])
}
