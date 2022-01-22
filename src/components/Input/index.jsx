import styles from './index.module.scss'
import { useRef, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react'

function Input({
	id,
	onChange,
	onCaret,
	defaultValue,
	onScroll,
	onPointerEnter,
}, _ref) {
	const ref = useRef(null)
	const caretRef = useRef([])
	useImperativeHandle(_ref, () => ref.current)

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

	const onKeyDown = (e) => {
		if (e.key === '(') {
			const [a, b] = caretRef.current
			if (a !== b && a !== undefined) {
				const {current} = ref
				const {value} = current
				const withParen = value.slice(0, a) + '(' + value.slice(a, b) + ')' + value.slice(b)
				current.value = withParen
				caretRef.current = [a, b + 2]
				current.setSelectionRange(...caretRef.current)
				e.preventDefault()
				onChange(e, caretRef.current)
			}
		}
	}

	const onInputChange = ({nativeEvent}) => {
		updateCaretRef(() => {
			onChange(nativeEvent, caretRef.current)
		})
	}

	return (
		<input
			className={styles.input}
			ref={ref}
			id={id}
			onChange={onInputChange}
			onKeyDown={onKeyDown}
			onBlur={onBlur}
			type="text"
			defaultValue={defaultValue}
			onScroll={onScroll}
			onPointerEnter={onPointerEnter}
			inputMode="decimal"
		/>
	)
}

export default forwardRef(Input)