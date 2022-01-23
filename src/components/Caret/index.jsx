import classNames from 'classnames'
import styles from './index.module.scss'
import { useRef, createContext, useEffect } from 'react'

export const CaretContext = createContext([])

export default function Caret({caret, children, minSpan}) {
	const ref = useRef(null)

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
			<code
				ref={ref}
				className={classNames(styles.caret, {
					[styles.animatable]: minSpan > 0
				})}
			/>
			<div>
				<CaretContext.Provider value={caret}>
					{children}
				</CaretContext.Provider>
				<span className={styles.placeholder} />
			</div>
		</div>
	)
}