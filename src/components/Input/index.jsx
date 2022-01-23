import styles from './index.module.scss'
import { useRef, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react'
import useMediaQuery from '../../assets/hooks/useMediaQuery'

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
	'sin⁻¹': 'sin⁻¹(',
	'cos⁻¹': 'cos⁻¹(',
	'tan⁻¹': 'tan⁻¹(',
	'log': 'log(',
	'ln': 'ln(',
}

/**
 * @param {string} str
 * @param {number} pos
 */
function findWordAtPosition(str, pos) {
	const substring = str.slice(0, pos)
	for(const [a, b] of Object.entries(INPUT_MAP)) {
		if (substring.endsWith(a)) {
			return a.length
		}
		if (substring.endsWith(b)) {
			return b.length
		}
	}
}

function Input({
	id,
	onChange,
	onCaret,
	onScroll,
	onPointerEnter,
	controlsRef,
}, _ref) {
	const ref = useRef(null)
	const caretRef = useRef([])
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
				caretRef.current = newCaret
				callback(caretRef.current)
			}
		}
	}, [])

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

	// prevent mobile keyboard from showing up
	const readOnly = useMediaQuery('(pointer: coarse)')

	// update caret when <input> value is changed
	const onProgrammaticChange = useCallback((value, [a, b]) => {
		ref.current.value = value
		caretRef.current = [a, b]
		ref.current.setSelectionRange(a, b)
		onChange({target: ref.current}, caretRef.current)
		scrollCaretIntoView(caretRef.current)
	}, [onChange, scrollCaretIntoView])

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
			if (a === b) {
				const deleteCharCount = findWordAtPosition(value, a) || 1
				const text = value.slice(0, a - deleteCharCount) + value.slice(a)
				onProgrammaticChange(text, [a - deleteCharCount, a - deleteCharCount])
			} else {
				const text = value.slice(0, a) + value.slice(b)
				onProgrammaticChange(text, [a, a])
			}
		}
	})), [onProgrammaticChange])

	// keep caret visible (but still allow TAB)
	useEffect(() => {
		const onClick = () => ref.current.focus()
		window.addEventListener('click', onClick, {passive: true})
		return () => {
			window.removeEventListener('click', onClick)
		}
	}, [])

	return (
		<input
			className={styles.input}
			ref={ref}
			id={id}
			onChange={onInputChange}
			onKeyDown={onKeyDown}
			onBlur={onBlur}
			type="text"
			onScroll={onScroll}
			onPointerEnter={onPointerEnter}
			readOnly={readOnly}
			spellCheck="false"
			autoFocus
		/>
	)
}

export default forwardRef(Input)