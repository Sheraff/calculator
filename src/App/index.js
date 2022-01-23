import { useRef } from 'react'
import styles from './index.module.scss'
import Output from '../components/Output'
import NumPad from '../components/NumPad'
import History from '../components/History'

function App() {
	// change <Input> on interaction with <NumPad>
	const numPadRef = useRef(/** @type {HTMLDivElement} */(null))
	const outputControlsRef = useRef(/** @type {import('../components/Output').OutputControls} */(null))
	const historyControlsRef = useRef(/** @type {import('../components/History').HistoryControls} */(null))
	const onNumPadDispatch = (value) => {
		if (value === 'AC') {
			outputControlsRef.current.replace('')
		} else if (value === '⌫') {
			outputControlsRef.current.delete()
		} else if (value === '=') {
			const {asString, computed} = outputControlsRef.current.getParsed()
			historyControlsRef.current.add(asString, computed)
			if (isNaN(computed)) {
				outputControlsRef.current.replace('')
			} else {
				outputControlsRef.current.replace(String(computed))
			}
		} else {
			outputControlsRef.current.insert(value)
		}
	}

	// change <Input> on interaction with <History>
	const onRewind = (text) => {
		outputControlsRef.current.replace(text)
	}

	return (
		<main className={styles.main}>
			<div className={styles.output}>
				<Output controlsRef={outputControlsRef} />
			</div>
			<div className={styles.numpad}>
				<NumPad ref={numPadRef} onDispatch={onNumPadDispatch} />
			</div>
			<div className={styles.history}>
				<History controlsRef={historyControlsRef} onRewind={onRewind} />
			</div>
		</main>
	)
}

export default App
