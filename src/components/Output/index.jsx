import styles from './index.module.scss'

export default function Output({
	parsed,
	htmlFor,
}) {
	return (
		<div className={styles.main}>
			<code> = </code>
			<output htmlFor={htmlFor}>
				{String(parsed.computed)}
			</output>
		</div>
	)
}