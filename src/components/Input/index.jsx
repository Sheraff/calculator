import styles from './index.module.scss'
import {
	useRef,
	useEffect,
	forwardRef,
	useImperativeHandle,
	useCallback,
	Fragment,
} from 'react'
import useStateAndRef from '../../assets/hooks/useStateAndRef'
import Caret from '../Caret'

/**
 * @typedef {Object} InputControls
 * @property {(text: string) => void} insert
 * @property {(text: string) => void} replace
 * @property {() => void} delete
 */

const INPUT_MAP = {
	'+': ' + ',
	'-': ' - ',
	'×': ' × ',
	'÷': ' ÷ ',
	'^': ' ^ ',
	'sin': 'sin(',
	'cos': 'cos(',
	'tan': 'tan(',
	'asin': 'asin(',
	'acos': 'acos(',
	'atan': 'atan(',
	'log': 'log(',
	'ln': 'ln(',
}

/**
 * @param {string} str
 * @param {number} pos
 */
function findWordAtPosition(str, pos) {
	const substring = str.slice(0, pos)
	let biggestMatch = 1
	for(const [a, b] of Object.entries(INPUT_MAP)) {
		if (substring.endsWith(a)) {
			biggestMatch = Math.max(a.length, biggestMatch)
		}
		if (substring.endsWith(b)) {
			biggestMatch = Math.max(b.length, biggestMatch)
		}
	}
	return biggestMatch
}

function Input({
	id,
	onChange,
	onCaret,
	onScroll,
	onPointerEnter,
	controlsRef,
	unlocked = false,
}, _ref) {
	const ref = useRef(null)
	const [caret, setCaret, caretRef] = useStateAndRef([])
	useImperativeHandle(_ref, () => ref.current)

	// keep caret state in sync w/ <input>
	const scrollCaretIntoView = useCallback(([a]) => {
		const caretPercent = a / ref.current.value.length
		const sourceAvailableScroll = ref.current.scrollWidth - ref.current.clientWidth
		const newScroll = caretPercent * sourceAvailableScroll
		const minVisibleCurrentScrollPercent = ref.current.scrollLeft / sourceAvailableScroll
		const maxVisibleCurrentScrollPercent = (ref.current.scrollLeft + ref.current.clientWidth) / sourceAvailableScroll
		const isCaretInView = newScroll > minVisibleCurrentScrollPercent && newScroll < maxVisibleCurrentScrollPercent
		if (!isCaretInView) {
			ref.current.scrollLeft = sourceAvailableScroll * caretPercent
		}
	}, [])

	const updateCaretRef = useCallback((callback) => {
		const {current} = ref
		if (document.activeElement === current) {
			const newCaret = [current.selectionStart, current.selectionEnd]
			if (newCaret[0] !== caretRef.current[0] || newCaret[1] !== caretRef.current[1]) {
				setCaret(newCaret)
				callback(caretRef.current)
			}
		}
	}, [setCaret, caretRef])

	useEffect(() => {
		const onSelect = () => {
			updateCaretRef(onCaret)
		}
		document.addEventListener('selectionchange', onSelect)
		return () => {
			document.removeEventListener('selectionchange', onSelect)
		}
	}, [updateCaretRef, onCaret])

	const onBlur = () => {
		onCaret(null)
	}

	const onInputChange = ({nativeEvent}) => {
		scrollCaretIntoView(caretRef.current)
		updateCaretRef(() => {
			onChange(nativeEvent, caretRef.current)
		})
	}

	// update caret when <input> value is changed
	const onProgrammaticChange = useCallback((value, [a, b]) => {
		ref.current.value = value
		setCaret([a, b])
		ref.current.setSelectionRange(a, b)
		onChange({target: ref.current}, caretRef.current)
		scrollCaretIntoView(caretRef.current)
	}, [setCaret, caretRef, onChange, scrollCaretIntoView])

	// auto insert parenthesis pair when text is selected
	const onKeyDown = (e) => {
		if (e.key === '(') {
			const [a, b] = caretRef.current
			if (a !== b && a !== undefined) {
				const {current} = ref
				const {value} = current
				const withParen = value.slice(0, a) + '(' + value.slice(a, b) + ')' + value.slice(b)
				e.preventDefault()
				onProgrammaticChange(withParen, [a, b + 2])
			}
		}
	}

	// allow parent to control the <input>
	useImperativeHandle(controlsRef, () => (/** @type {InputControls} */({
		insert: (text) => {
			const string = INPUT_MAP[text] || text
			const [a, b] = caretRef.current
			const {value} = ref.current
			const withText = value.slice(0, a) + string + value.slice(b)
			onProgrammaticChange(withText, [b + string.length, b + string.length])
		},
		replace: (text) => {
			onProgrammaticChange(text, [text.length, text.length])
		},
		delete: () => {
			const [a, b] = caretRef.current
			const {value} = ref.current
			if (!value) {
				return
			}
			if (a === b) {
				const deleteCharCount = findWordAtPosition(value, a)
				const text = value.slice(0, a - deleteCharCount) + value.slice(a)
				onProgrammaticChange(text, [a - deleteCharCount, a - deleteCharCount])
			} else {
				const text = value.slice(0, a) + value.slice(b)
				onProgrammaticChange(text, [a, a])
			}
		}
	})), [caretRef, onProgrammaticChange])

	// keep caret visible (but still allow TAB)
	useEffect(() => {
		const onClick = () => ref.current.focus()
		window.addEventListener('click', onClick, {passive: true})
		return () => {
			window.removeEventListener('click', onClick)
		}
	}, [])

	// keep caret state in sync w/ scroll
	const rafId = useRef(null)
	const caretElementRef = useRef(/** @type {HTMLElement} */(null))
	useEffect(() => () => cancelAnimationFrame(rafId.current), [])
	const onFrame = useCallback(() => {
		rafId.current = null
		if (caretElementRef.current) {
			caretElementRef.current.style.setProperty('--offset', String(ref.current.offsetLeft - ref.current.scrollLeft))
		}
	}, [])
	const _onScroll = useCallback((e) => {
		if (rafId.current === null) {
			rafId.current = requestAnimationFrame(() => onFrame())
		}
		onScroll(e)
	}, [onFrame, onScroll])
	useEffect(() => {
		if (!unlocked) {
			onFrame()
		}
	}, [onFrame, unlocked])

	// enable <Caret> only if native caret is disabled ("unlocked" mode)
	const CaretWrapper = unlocked ? Fragment : Caret
	const wrapperProps = unlocked
		? {}
		: {
			ref: caretElementRef,
			caret: caret,
			minSpan: 0,
		}

	return (
		<CaretWrapper {...wrapperProps}>
			<input
				className={styles.input}
				ref={ref}
				id={id}
				onChange={onInputChange}
				onKeyDown={onKeyDown}
				onBlur={onBlur}
				type="text"
				onScroll={_onScroll}
				onPointerEnter={onPointerEnter}
				readOnly={!unlocked}
				spellCheck="false"
				autoFocus
			/>
		</CaretWrapper>
	)
}

export default forwardRef(Input)