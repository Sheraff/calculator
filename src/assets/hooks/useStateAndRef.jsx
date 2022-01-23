import {
	useState,
	useRef,
	useCallback,
} from 'react'

/**
 * This hook allows you to access a state from within another
 * hook without having to pass it as a dependency (with `stateRef`)
 * while still using the state normally as well (`state, setState`)
 *
 * ⚠ the downside is that `setState` and `stateRef` need to be passed
 * as dependencies to other hooks (for the linter to be happy)
 * but they remain stable and don't trigger the effects
 * (same as a normal useState or useRef)
 *
 * @function
 * @template T
 * @param {T} initial
 * @returns {[
 * 	T,
 * 	React.Dispatch<React.SetStateAction<T>>,
 * 	React.MutableRefObject<T>
 * ]}
 */
export default function useStateAndRef(initial) {
	// handle visibility states without re-running useEffect
	const [state, internalSetState] = useState(initial)
	const stateRef = useRef(initial)
	const setState = useCallback((value) => {
		stateRef.current = value
		internalSetState(value)
	}, [])
	return [state, setState, stateRef]
}
