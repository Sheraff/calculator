import {add, subtract} from '../utils/floatMath'
import BinaryOperatorPlugin from './BinaryOperators'

class OrBinaryOperatorToken extends BinaryOperatorPlugin.token {}
class OrBinaryOperatorNode extends BinaryOperatorPlugin.node {}

export default class OrBinaryOperatorPlugin extends BinaryOperatorPlugin {
	static token = OrBinaryOperatorToken
	static node = OrBinaryOperatorNode
	static operators = ['+', '-']

	static resolve(node) {
		const left = node.nodes[0].computed
		const right = node.nodes[1].computed
		switch (node.value) {
			case '+':
				return add(left, right)
			case '-':
				return subtract(left, right)
		}
	}
}