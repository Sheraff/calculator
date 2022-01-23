import styles from './index.module.scss'

export default function Output({
	computed,
	htmlFor,
}) {
	return (
		<div className={styles.main}>
			<code> = </code>
			<output htmlFor={htmlFor}>
				{computed
					? String(computed)
					: '...'}
			</output>
		</div>
	)
}