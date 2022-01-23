import { useRef, useState } from 'react'
import styles from './index.module.scss'
import Output from '../components/Output'
import NumPad from '../components/NumPad'
import History from '../components/History'
import useMinVh from '../assets/hooks/useMinVh'

const UNLOCK_MODE_SEQUENCE = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
let sequencePointer = 0

function App() {
	// stable 100vh value
	useMinVh()

	// "unlock mode" easter egg
	const [unlocked, setUnlocked] = useState(false)

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
		if (value === UNLOCK_MODE_SEQUENCE[sequencePointer]) {
			sequencePointer++
			if (sequencePointer === UNLOCK_MODE_SEQUENCE.length) {
				setUnlocked(a => !a)
				sequencePointer = 0
				outputControlsRef.current.replace('')
			}
		}
	}

	// change <Input> on interaction with <History>
	const onRewind = (text) => {
		outputControlsRef.current.replace(text)
	}

	return (
		<main className={styles.main}>
			<div className={styles.output}>
				<Output controlsRef={outputControlsRef} unlocked={unlocked} />
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
