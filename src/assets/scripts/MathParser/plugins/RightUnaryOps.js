import factorial from '../utils/factorial';
import { divide } from '../utils/floatMath';
import UnaryOperatorPlugin from './UnaryOperators'

class RightUnaryOperatorToken extends UnaryOperatorPlugin.token {}
class RightUnaryOperatorNode extends UnaryOperatorPlugin.node {}

export default class RightUnaryOperatorPlugin extends UnaryOperatorPlugin {
	static token = RightUnaryOperatorToken
	static node = RightUnaryOperatorNode
	static operators = ['!', '²', '³', '%']

	static reduce(context, parser) {
		const {result, item} = context
		if (
			result.length > 0
			&& parser.hasIntrinsicValue(result[result.length - 1])
		) {
			const child = parser.reduce([result.pop()])
			const inputRange = [child.inputRange[0], item.inputRange[1]]
			return new this.node({ type: 'operation-unary', value: item.value, nodes: [child], operatorPosition: 'right', inputRange, addParenthesis: false })
		}
	}

	static resolve(node) {
		const input = node.nodes[0].computed
		switch (node.value) {
			case '!':
				return factorial(input)
			case '²':
				return input**2
			case '³':
				return input**3
			case '%':
				return divide(input, 100)
		}
	}

	static stringify(node) {
		return `${node.nodes[0].asString}${node.value}`
	}

	static mapRange(node, parser) {
		return [node.nodes[0].outputRange[0], node.nodes[0].outputRange[1] + 1]
	}
}
