import styles from './index.module.scss'
import { useImperativeHandle, useRef } from 'react'
import Input from '../Input'
import Parsed from '../Parsed'
import Result from '../Result'
import useSyncScroll from './useSyncScroll'
import useMathParserWorker from './useMathParserWorker'
import classNames from 'classnames'

/**
 * @typedef {import('../Input').InputControls} InputControls
 *
 * @typedef {Object} OutputControlsAugment
 * @property {() => Object} getParsed
 * 
 * @typedef {OutputControlsAugment & InputControls} OutputControls
 */

export default function Output({
	controlsRef,
	unlocked = false,
}) {
	const inputRef = useRef(/** @type {HTMLInputElement} */(null))
	const parsedRef = useRef(/** @type {HTMLElement} */(null))

	// sync scroll position of <Parsed> with <Input>
	const {
		onScroll,
		onPointerEnter,
		refreshScrollFromElement,
	} = useSyncScroll(parsedRef, inputRef)

	// off-thread AST parsing of math input
	const {
		parsed,
		caret,
		onChange,
		onCaret,
	} = useMathParserWorker({
		inputRef,
		onParsed: refreshScrollFromElement,
	})

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

	const showResult = parsed.asString && String(parsed.computed) !== parsed.asString

	return (
		<div className={classNames(styles.container, {
			[styles.unlocked]: unlocked
		})}>
			<Input
				ref={inputRef}
				controlsRef={inputControlsRef}
				id="input"
				onChange={onChange}
				onCaret={onCaret}
				onScroll={onScroll}
				onPointerEnter={onPointerEnter}
				unlocked={unlocked}
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
				computed={showResult ? parsed.computed : null}
			/>
		</div>
	)
}