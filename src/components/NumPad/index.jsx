import classNames from 'classnames'
import { forwardRef, useEffect, useState } from 'react'
import styles from './index.module.scss'

const NUM_KEYS = [
	['AC', '(', ')', '+'],
	[7, 8, 9, '-'],
	[4, 5, 6, '×'],
	[1, 2, 3, '÷'],
	[0, '.', '⌫', '='],
]

const EXTRA_KEYS = [
	['sin', 'cos', 'tan'],
	['asin', 'acos', 'atan'],
	['log', 'ln', 'e'],
	['√', '^', '%'],
	['π', '!', '⌫'],
]

function NumPad({
	onDispatch,
}, ref) {
	const [drawer, setDrawer] = useState(false)

	/** @type {React.MouseEventHandler<HTMLDivElement>} */
	const onClick = (e) => {
		if (e.target.dataset.action) {
			onDispatch(e.target.dataset.action)
		}
	}

	/** @type {React.PointerEventHandler<HTMLButtonElement>} */
	const noStealFocus = (e) => e.preventDefault()

	useEffect(() => {
		const onKeyDown = (e) => {
			if (e.key === 'Enter') {
				onDispatch('=')
				e.preventDefault()
			}
		}
		window.addEventListener('keydown', onKeyDown)
		return () => {
			window.removeEventListener('keydown', onKeyDown)
		}
	}, [onDispatch])

	return (
		<div
			ref={ref}
			className={styles.main}
			onClick={onClick}
		>
			<ol
				className={styles.num}
				aria-hidden={drawer ? 'true' : null}
			>
				{NUM_KEYS.map((row) => row.map((key) => (
					<li key={key}>
						<button
							type="button"
							data-action={key}
							tabIndex={drawer ? -1 : 0}
							onPointerDown={noStealFocus}
						>
							<span>{key}</span>
						</button>
					</li>
				)))}
			</ol>
			<ol
				className={classNames(styles.extras, {
					[styles.open]: drawer 
				})}
				aria-hidden={!drawer ? 'true' : null}
			>
				{EXTRA_KEYS.map((row) => row.map((key) => (
					<li key={key}>
						<button
							type="button"
							data-action={key}
							tabIndex={drawer ? 0 : -1}
							onPointerDown={noStealFocus}
						>
							<span>{key}</span>
						</button>
					</li>
				)))}
				<li className={styles.toggle}>
					<button type="button" onClick={() => setDrawer(a => !a)}>
						‹
					</button>
				</li>
			</ol>
		</div>
	)
}

export default forwardRef(NumPad)