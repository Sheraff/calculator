import ConstPlugin from './plugins/Constants'
import GroupPlugin from './plugins/Groups'
import MinusUnaryOperatorPlugin from './plugins/MinusUnaryOps'
import LeftUnaryOperatorPlugin from './plugins/LeftUnaryOps'
import RightUnaryOperatorPlugin from './plugins/RightUnaryOps'
import PowBinaryOperatorPlugin from './plugins/PowBinaryOps'
import AndBinaryOperatorPlugin from './plugins/AndBinaryOps'
import OrBinaryOperatorPlugin from './plugins/OrBinaryOps'
import ImplicitMultiplicationPlugin from './plugins/ImplicitMultiplication'
import NumberPlugin from './plugins/Numbers'
import StringPlugin from './plugins/Strings'
import PartialsPlugin from './plugins/Partials'
import MathParser from '.';

const parser = new MathParser([
	ConstPlugin,
	GroupPlugin,
	LeftUnaryOperatorPlugin,
	RightUnaryOperatorPlugin,
	MinusUnaryOperatorPlugin,
	PowBinaryOperatorPlugin,
	AndBinaryOperatorPlugin,
	ImplicitMultiplicationPlugin,
	OrBinaryOperatorPlugin,
	NumberPlugin,
	StringPlugin,
	PartialsPlugin,
])

let lastParsed = {}
let lastValue = ''
const parsedMap = new Map()
function handleParsing(data, value) {
	if (parsedMap.has(value)) {
		lastParsed = parsedMap.get(value)
	} else {
		lastParsed = parser.parse(value)
		lastValue = value
		parsedMap.set(value, lastParsed)
	}
	data.parsed = lastParsed
}

let lastCaret = null
const caretMap = new Map()
function handleCaret(data, caret) {
	if (!caret) {
		lastCaret = null
		data.caret = null
		return
	}
	const caretKey = `${caret[0]}:::${caret[1]}:::${lastValue}`
	const exists = caretMap.has(caretKey)
	const newCaret = exists
		? caretMap.get(caretKey)
		: mapCaretToOutput(lastParsed, caret)
	const nullCount = (lastCaret === null) + (newCaret === null)
	if (nullCount === 1 || (
		nullCount === 0 && (lastCaret[0] !== newCaret[0] || lastCaret[1] !== newCaret[1])
	)) {
		lastCaret = newCaret
		data.caret = newCaret
	}
	if (!exists) {
		caretMap.set(caretKey, newCaret)
	}
}
function mapCaretToOutput(parsed, caret) {
	if (!caret || !parsed.inputRange) {
		return null
	}
	if (caret[0] === caret[1] && parsed.inputRange[1] < caret[0]) {
		return null
	}
	return MathParser.locateCaret(parsed, caret)
}

onmessage = ({ data: { value, caret } }) => {
	const data = {}
	if (value) {
		handleParsing(data, value)
	}
	if (caret !== undefined) {
		handleCaret(data, caret)
	}
	postMessage(data)
};
