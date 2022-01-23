import { useState, useEffect } from 'react'
import { addListener, removeListener } from './queryListeners'

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
