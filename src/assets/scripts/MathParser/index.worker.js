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
import MathParser from '.'

/**
 * @typedef {import('./classes/Node').default} Node
 *
 * @typedef {[number, number]} Caret
 */

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
const parsedMap = /** @type {Map<String, Node | {}>} */(new Map([[lastValue, lastParsed]]))
/**
 * @param {Object} data
 * @param {string} value
 */
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
const caretMap = /** @type {Map<String, Caret | null>} */(new Map())
/**
 * @param {Object} data
 * @param {Caret | null} caret
 */
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
	const nullCount = Number(lastCaret === null) + Number(newCaret === null)
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
/**
 * @param {Node | {}} parsed
 * @param {Caret | null} caret
 * @returns {Caret | null}
 */
function mapCaretToOutput(parsed, caret) {
	if (!caret || !parsed.inputRange) {
		return null
	}
	if (caret[0] === caret[1] && parsed.inputRange[1] < caret[0]) {
		return null
	}
	return MathParser.locateCaret(parsed, caret)
}

onmessage = ({ data }) => {
	const message = {}
	const value = (/** @type {string | undefined} */(data.value))
	const caret = (/** @type {Caret | null | undefined} */(data.caret))
	if (typeof value === 'string') {
		const lowercaseValue = value.toLowerCase()
		handleParsing(message, lowercaseValue)
	}
	if (caret !== undefined) {
		handleCaret(message, caret)
	}
	postMessage(message)
}
