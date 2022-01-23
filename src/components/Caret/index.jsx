import classNames from 'classnames'
import styles from './index.module.scss'
import { useRef, createContext, useEffect, forwardRef, useImperativeHandle } from 'react'

export const CaretContext = createContext([])

function Caret({caret, children, minSpan}, _ref) {
	const ref = useRef(null)
	useImperativeHandle(_ref, () => ref.current)

	const lastCaretState = useRef(false)
	useEffect(() => {
		const flag = !!caret
		ref.current.classList.toggle(styles.freeze, lastCaretState.current !== flag)
		if (flag) {
			ref.current.style.setProperty('--left', caret[0])
			const width = caret[1] - caret[0] + minSpan
			ref.current.style.setProperty('--width', width)
			ref.current.classList.toggle(styles.blink, width === 0)
		}
		ref.current.style.setProperty('--show', Number(flag))
		lastCaretState.current = flag

	}, [caret, minSpan])
	
	return (
		<div className={styles.caretLine}>
			<div
				ref={ref}
				className={classNames(styles.caret, {
					[styles.animatable]: minSpan > 0
				})}
			/>
			<div className={styles.child}>
				<CaretContext.Provider value={caret}>
					{children}
				</CaretContext.Provider>
				<span className={styles.placeholder} />
			</div>
		</div>
	)
}

export default forwardRef(Caret)