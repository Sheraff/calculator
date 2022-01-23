import { useCallback, useEffect, useRef, useState } from 'react'
import { unstable_batchedUpdates } from 'react-dom'

/**
 * @typedef {import('../../assets/scripts/MathParser/classes/Node').default} Node
 * @typedef {[number, number]} Caret
 */

/**
 * @param {Object} params
 * @param {React.MutableRefObject<HTMLInputElement>} params.inputRef
 * @param {(el: HTMLElement) => void} params.onParsed
 */
export default function useMathParserWorker({
	inputRef,
	onParsed,
}) {
	const [parsed, setParsed] = useState(/** @type {Node | {}} */({}))
	const [caret, setCaret] = useState(/** @type {Caret | null} */(null))
	const worker = useRef(/** @type {Worker} */(null))

	useEffect(() => {
		worker.current = new Worker(new URL('../../assets/scripts/MathParser/index.worker.js', import.meta.url))
		worker.current.onmessage = ({ data }) => {
			unstable_batchedUpdates(() => {
				const parsed = (/** @type {Node | {}} */(data.parsed))
				const caret = (/** @type {Caret | null} */(data.caret))
				if (parsed) {
					setParsed(parsed)
					// console.log(parsed)
					onParsed(inputRef.current)
				}
				if (caret !== undefined) {
					setCaret(caret)
					// console.log(caret)
				}
			})
		}
		worker.current.postMessage({ value: inputRef.current.value })
	}, [inputRef, onParsed])

	const onChange = useCallback(({ target: { value } }, caret) => {
		worker.current.postMessage({ value, caret })
	}, [])

	const onCaret = useCallback((caret) => {
		worker.current.postMessage({ caret })
	}, [])

	return {
		parsed,
		caret,
		onChange,
		onCaret,
	}
}