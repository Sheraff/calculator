import classNames from 'classnames'
import styles from './index.module.scss'
import { useState } from 'react'

export default function History() {
	const [drawer, setDrawer] = useState(false)
	return (
		<div
			className={classNames(styles.container, {
				[styles.open]: drawer
			})}
		>
			<div className={styles.drawer}>
				<div className={styles.history}>
					history
				</div>
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