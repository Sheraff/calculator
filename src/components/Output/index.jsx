export default function Output({
	parsed,
	htmlFor,
}) {
	return (
		<div>
			<code> = </code>
			<output htmlFor={htmlFor}>
				{String(parsed.computed)}
			</output>
		</div>
	)
}