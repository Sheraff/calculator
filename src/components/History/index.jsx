import styles from './index.module.scss'
import classNames from 'classnames'
import { useState, useImperativeHandle } from 'react'

/**
 * @typedef {Object} HistoryControls
 * @property {(text: string, result: number) => void} add
 */

export default function History({
	controlsRef,
	onRewind,
}) {
	const [drawer, setDrawer] = useState(false)
	const [history, setHistory] = useState([])

	useImperativeHandle(controlsRef, () => (/** @type {HistoryControls} */({
		add: (text, result) => {
			setHistory((current) => [[text, result], ...current])
		},
	})), [])

	const onClick = (text) => {
		setDrawer(false)
		onRewind(text)
	}

	return (
		<div
			className={classNames(styles.container, {
				[styles.open]: drawer,
				[styles.empty]: history.length === 0,
			})}
		>
			<div className={styles.drawer}>
				<ol className={styles.history}>
					{history.map(([text, result], i) => (
						<li key={i}>
							<button
								type="button"
								className={styles.line}
								onClick={() => onClick(text)}
							>
								<p>{text}</p>
								<p>= {result}</p>
							</button>
						</li>
					))}
				</ol>
				<button
					type="button"
					className={styles.toggle}
					onClick={() => setDrawer(a => !a)}
				>
					↓
				</button>
			</div>
		</div>
	)
}