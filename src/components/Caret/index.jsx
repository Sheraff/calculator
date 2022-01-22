import styles from './index.module.scss'
import { useRef, createContext, useEffect } from 'react'

export const CaretContext = createContext([]);

export default function Caret({caret, children}) {
	const ref = useRef(null)

	const lastCaretState = useRef(false)
	useEffect(() => {
		const flag = !!caret
		if (lastCaretState.current !== flag) {
			ref.current.classList.add(styles.freeze)
		} else {
			ref.current.classList.remove(styles.freeze)
		}
		if (flag) {
			ref.current.style.setProperty('--left', caret[0])
			ref.current.style.setProperty('--width', caret[1] - caret[0] + 1)
		}
		ref.current.style.setProperty('--show', Number(flag))
		lastCaretState.current = flag

	}, [caret])
	
	return (
		<div className={styles.caretLine}>
			<code
				ref={ref}
				className={styles.caret}
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