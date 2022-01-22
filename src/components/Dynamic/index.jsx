import Value from '../Value'
import { Fragment } from 'react'

function keyFromNode({type, inputRange = []}) {
	return `${type}-${inputRange[0]}`
}

function Exponent({nodes: [left, right], computed, inputRange, outputRange}) {
	return (
		<Value value={computed} inputRange={inputRange} outputRange={outputRange}>
			<Dynamic key={keyFromNode(left)} {...left}/>
			<sup>
				<Dynamic key={keyFromNode(right)} {...right}/>
			</sup>
		</Value>
	)
}

function Binary({nodes: [left, right], value, computed, inputRange, outputRange}) {
	return (
		<Value value={computed} inputRange={inputRange} outputRange={outputRange}>
			<Dynamic key={keyFromNode(left)} {...left}/>
			<code> {value} </code>
			<Dynamic key={keyFromNode(right)} {...right}/>
		</Value>
	)
}

function Unary({nodes: [child], value, computed, operatorPosition, inputRange, outputRange, addParenthesis}) {
	const left = operatorPosition === 'left'
	return (
		<Value value={computed} inputRange={inputRange} outputRange={outputRange}>
			{left && <code>{value}</code>}
			{addParenthesis && <code>(</code>}
			<Dynamic key={keyFromNode(child)} {...child}/>
			{addParenthesis && <code>)</code>}
			{!left && <code>{value}</code>}
		</Value>
	)
}

function Group({nodes, computed, inputRange, outputRange}) {
	const child = nodes && nodes[0]
	return (
		<Value value={computed} inputRange={inputRange} outputRange={outputRange}>
			<code>(</code>
			{child && (
				<Dynamic key={keyFromNode(child)} {...child}/>
			)}
			<code>)</code>
		</Value>
	)
}

function Partials({nodes, computed, inputRange, outputRange}) {
	return (
		<Value value={computed} inputRange={inputRange} outputRange={outputRange}>
			{nodes.map((node, i) => (
				<Fragment key={keyFromNode(node)}>
					{i > 0 && (
						<code> </code>
					)}
					<Dynamic {...node}/>
				</Fragment>
			))}
		</Value>
	)
}

function Default({asString, inputRange, outputRange, invalid}) {
	return (
		<Value inputRange={inputRange} outputRange={outputRange} invalid={invalid}>
			<code>{asString}</code>
		</Value>
	)
}

export default function Dynamic({type, ...props}) {
	switch (type) {
		case 'operation-exponent':
			return <Exponent key={keyFromNode(props)} {...props} />
		case 'operation-binary':
			return <Binary key={keyFromNode(props)} {...props} />
		case 'operation-unary':
			return <Unary key={keyFromNode(props)} {...props} />
		case 'group':
			return <Group key={keyFromNode(props)} {...props} />
		case 'partials':
			return <Partials key={keyFromNode(props)} {...props} />
		case 'number':
		case 'const':
			return <Default key={keyFromNode(props)} {...props} />
		default:
			return <Default key={keyFromNode(props)} {...props} invalid />
	}
}