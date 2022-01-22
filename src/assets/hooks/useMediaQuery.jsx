import { useState, useEffect } from 'react'

/**
 * we need to use legacy `addListener` for Safari <14.0
 * @param {MediaQueryList} mediaQuery
 * @param {Function} callback
 */
export function addListener(mediaQuery, callback) {
	if (mediaQuery.addEventListener) {
		mediaQuery.addEventListener('change', callback)
	} else {
		mediaQuery.addListener(callback)
	}
}

/**
 * we need to use legacy `removeListener` for Safari <14.0
 * @param {MediaQueryList} mediaQuery
 * @param {Function} callback
 */
export function removeListener(mediaQuery, callback) {
	if (mediaQuery.addEventListener) {
		mediaQuery.removeEventListener('change', callback)
	} else {
		mediaQuery.removeListener(callback)
	}
}


export default function useMediaQuery(query, initial = false) {
	const [match, setMatch] = useState(initial)

	useEffect(() => {
		const mediaQuery = matchMedia(query)

		if (mediaQuery.matches !== initial) {
			setMatch(mediaQuery.matches)
		}

		const onChange = () => {
			setMatch(mediaQuery.matches)
		}

		addListener(mediaQuery, onChange)
		return () => {
			removeListener(mediaQuery, onChange)
		}
	}, [initial, query])

	return match
}
