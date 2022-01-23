import styles from './index.module.scss'
import { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import Input from '../Input'
import Parsed from '../Parsed'
import Result from '../Result'

/**
 * @typedef {import('../../assets/scripts/MathParser/classes/Node').default} Node
 * @typedef {[number, number]} Caret
 * 
 * @typedef {import('../Input').InputControls} InputControls
 *
 * @typedef {Object} OutputControlsAugment
 * @property {() => Object} getParsed
 * 
 * @typedef {OutputControlsAugment & InputControls} OutputControls
 */

export default function Output({
	controlsRef,
}) {
	const [parsed, setParsed] = useState(/** @type {Node | {}} */({}))
	const [caret, setCaret] = useState(null)
	const inputRef = useRef(/** @type {HTMLInputElement} */(null))
	const parsedRef = useRef(/** @type {HTMLElement} */(null))

	// sync scroll position of <Parsed> with <Input>
	const rafId = useRef(null)
	const acceptScrollFromElement = useRef(/** @type {HTMLElement} */(null))
	useEffect(() => () => cancelAnimationFrame(rafId.current), [])
	const onFrame = useCallback((source) => {
		rafId.current = null

		const mirror = parsedRef.current === source
			? inputRef.current
			: parsedRef.current

		const sourceAvailableScroll = source.scrollWidth - source.clientWidth
		const mirrorAvailableScroll = mirror.scrollWidth - mirror.clientWidth
		const percentScroll = source.scrollLeft / sourceAvailableScroll
		mirror.scrollLeft = mirrorAvailableScroll * percentScroll

	}, [])

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

	// off-thread AST parsing of math input
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
					acceptScrollFromElement.current = inputRef.current
					onScroll({ currentTarget: inputRef.current })
				}
				if (caret !== undefined) {
					setCaret(caret)
					// console.log(caret)
				}
			})
		}
		worker.current.postMessage({ value: inputRef.current.value })
	}, [onScroll])

	const onChange = useCallback(({ target: { value } }, caret) => {
		worker.current.postMessage({ value, caret })
	}, [])

	const onCaret = useCallback((caret) => {
		worker.current.postMessage({ caret })
	}, [])

	// focus <Input> when clicking <Parsed>
	const onSetCaret = ({detail}) => {
		inputRef.current.focus()
		inputRef.current.setSelectionRange(detail[0], detail[1] + 1)
	}

	// allow parent to control component
	const inputControlsRef = useRef(/** @type {InputControls} */(null))
	useImperativeHandle(controlsRef, () => (/** @type {OutputControls} */({
		...inputControlsRef.current,
		getParsed: () => parsed,
	})))

	return (
		<div className={styles.container}>
			<Input
				ref={inputRef}
				controlsRef={inputControlsRef}
				id="input"
				onChange={onChange}
				onCaret={onCaret}
				onScroll={onScroll}
				onPointerEnter={onPointerEnter}
			/>
			<Parsed
				ref={parsedRef}
				parsed={parsed}
				caret={caret}
				onSetCaret={onSetCaret}
				onScroll={onScroll}
				onPointerEnter={onPointerEnter}
			/>
			<Result
				htmlFor="input"
				computed={parsed.computed}
			/>
		</div>
	)
}