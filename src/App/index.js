import { useEffect, useRef } from 'react'
import styles from './index.module.scss'
import Output from '../components/Output'
import NumPad from '../components/NumPad'
import History from '../components/History'

/**
 * @typedef {Object} InputControls
 * @property {(text: string) => void} insert
 * @property {() => void} clear
 * @property {() => void} delete
 */

function App() {
	const initial = '(sin(10 +pi) * pi^2 + 3! * (-1 pi tau)'
	// const initial = 'pi 2 tau'

	// change <Input> on interaction with <NumPad>
	const inputControlsRef = useRef(/** @type {InputControls} */(null))
	const numPadRef = useRef(/** @type {HTMLDivElement} */(null))
	useEffect(() => {
		const onNumPadClick = ({detail}) => {
			if (detail === 'AC') {
				inputControlsRef.current.clear()
			} else if (detail === '⌫') {
				inputControlsRef.current.delete()
			} else {
				inputControlsRef.current.insert(detail)
			}
		}
		const {current} = numPadRef
		current.addEventListener('action', onNumPadClick)
		return () => {
			current.removeEventListener('action', onNumPadClick)
		}
	}, [])

	return (
		<main className={styles.main}>
			<div className={styles.output}>
				<Output
					initial={initial}
					inputControlsRef={inputControlsRef}
				/>
			</div>
			<div className={styles.numpad}>
				<NumPad ref={numPadRef} />
			</div>
			<div className={styles.history}>
				<History />
			</div>
		</main>
	)
}

export default App
