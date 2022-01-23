import { useCallback, useEffect, useRef } from 'react'

export default function useSyncScroll(refA, refB) {
	const rafId = useRef(null)
	const acceptScrollFromElement = useRef(/** @type {HTMLElement} */(null))

	useEffect(() => () => cancelAnimationFrame(rafId.current), [])
	const onFrame = useCallback((source) => {
		rafId.current = null

		const mirror = refA.current === source
			? refB.current
			: refA.current

		const sourceAvailableScroll = source.scrollWidth - source.clientWidth
		const mirrorAvailableScroll = mirror.scrollWidth - mirror.clientWidth
		const percentScroll = source.scrollLeft / sourceAvailableScroll
		mirror.scrollLeft = mirrorAvailableScroll * percentScroll

	}, [refA, refB])

	const onScroll = useCallback(({currentTarget}) => {
		if (
			rafId.current === null
			&& currentTarget === acceptScrollFromElement.current
		) {
			rafId.current = requestAnimationFrame(() => onFrame(currentTarget))
		}
	}, [onFrame])

	const onPointerEnter = useCallback((event) => {
		acceptScrollFromElement.current = event.currentTarget
	}, [])

	const refreshScrollFromElement = useCallback((element) => {
		acceptScrollFromElement.current = element
		onScroll({ currentTarget: element })
	}, [onScroll])

	return {
		onScroll,
		onPointerEnter,
		refreshScrollFromElement,
	}
}