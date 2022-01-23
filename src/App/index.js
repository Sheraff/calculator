import { useEffect, useRef } from 'react'
import styles from './index.module.scss'
import Output from '../components/Output'
import NumPad from '../components/NumPad'
import History from '../components/History'

function App() {
	// change <Input> on interaction with <NumPad>
	const numPadRef = useRef(/** @type {HTMLDivElement} */(null))
	const outputControlsRef = useRef(/** @type {import('../components/Output').OutputControls} */(null))
	const historyControlsRef = useRef(/** @type {import('../components/History').HistoryControls} */(null))
	useEffect(() => {
		const onNumPadClick = ({detail}) => {
			if (detail === 'AC') {
				outputControlsRef.current.replace('')
			} else if (detail === '⌫') {
				outputControlsRef.current.delete()
			} else if (detail === '=') {
				const {asString, computed} = outputControlsRef.current.getParsed()
				historyControlsRef.current.add(asString, computed)
				outputControlsRef.current.replace(String(computed))
			} else {
				outputControlsRef.current.insert(detail)
			}
		}
		const {current} = numPadRef
		current.addEventListener('action', onNumPadClick)
		return () => {
			current.removeEventListener('action', onNumPadClick)
		}
	}, [])

	const onRewind = (text) => {
		outputControlsRef.current.replace(text)
	}

	return (
		<main className={styles.main}>
			<div className={styles.output}>
				<Output controlsRef={outputControlsRef} />
			</div>
			<div className={styles.numpad}>
				<NumPad ref={numPadRef} />
			</div>
			<div className={styles.history}>
				<History controlsRef={historyControlsRef} onRewind={onRewind} />
			</div>
		</main>
	)
}

export default App
