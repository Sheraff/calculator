import styles from './index.module.scss'
import { useCallback, useEffect, useRef, useState } from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import Input from '../Input'
import Parsed from '../Parsed'
import Result from '../Result'

export default function Output({
	initial,
	inputControlsRef,
}) {
	const [parsed, setParsed] = useState({})
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
		worker.current.onmessage = ({ data: { parsed, caret } }) => {
			unstable_batchedUpdates(() => {
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
	}, [initial, onScroll])

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
				defaultValue={initial}
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
				parsed={parsed}
			/>
		</div>
	)
}