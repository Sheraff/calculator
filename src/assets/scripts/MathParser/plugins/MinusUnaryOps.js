import OrBinaryOperatorPlugin from './OrBinaryOps'
import LeftUnaryOperatorPlugin from './LeftUnaryOps'

class MinusUnaryOperatorNode extends LeftUnaryOperatorPlugin.node {}

export default class MinusUnaryOperatorPlugin extends LeftUnaryOperatorPlugin {
	static node = MinusUnaryOperatorNode
	static operators = ['-']

	static tokenize = null

	static isOwnToken(token, parser) {
		return OrBinaryOperatorPlugin.isOwnToken(token, parser) && this.operators.includes(token.value)
	}

	static reduce(context, parser) {
		const {stack, result, item, i} = context
		if (
			i + 1 < stack.length
			&& parser.hasIntrinsicValue(stack[i + 1])
			&& (result.length === 0 || !parser.hasIntrinsicValue(result[result.length - 1]))
		) {
			const child = parser.reduce([stack[i + 1]])
			const inputRange = [item.inputRange[0], child.inputRange[1]]
			context.i++
			return new this.node({ type: 'operation-unary', value: item.value, nodes: [child], operatorPosition: 'left', inputRange, addParenthesis: false })
		}
	}

	static resolve(node) {
		return -node.nodes[0].computed
	}
}