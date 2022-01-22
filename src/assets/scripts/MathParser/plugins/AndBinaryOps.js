import {multiply, divide} from '../utils/floatMath'
import BinaryOperatorPlugin from './BinaryOperators'

class AndBinaryOperatorToken extends BinaryOperatorPlugin.token {}
class AndBinaryOperatorNode extends BinaryOperatorPlugin.node {}

export default class AndBinaryOperatorPlugin extends BinaryOperatorPlugin {
	static token = AndBinaryOperatorToken
	static node = AndBinaryOperatorNode
	static operators = ['*', '/', '×', '÷']

	static resolve(node) {
		const left = node.nodes[0].computed
		const right = node.nodes[1].computed
		switch (node.value) {
			case '*':
			case '×':
				return multiply(left, right)
			case '/':
			case '÷':
				return divide(left, right)
		}
	}
}