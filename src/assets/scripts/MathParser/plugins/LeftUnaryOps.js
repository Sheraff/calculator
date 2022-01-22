import UnaryOperatorPlugin from './UnaryOperators'
import StringPlugin from './Strings'
import GroupPlugin from './Groups'

class LeftUnaryOperatorToken extends UnaryOperatorPlugin.token {}
class LeftUnaryOperatorNode extends UnaryOperatorPlugin.node {}

export default class LeftUnaryOperatorPlugin extends UnaryOperatorPlugin {
	static token = LeftUnaryOperatorToken
	static node = LeftUnaryOperatorNode
	static operators = ['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', '√', 'abs', 'floor', 'ceil', 'round', 'sin⁻¹', 'cos⁻¹', 'tan⁻¹', 'asin', 'acos', 'atan']

	static isOwnToken(token, parser) {
		return token instanceof this.token || (StringPlugin.isOwnToken(token, parser) && this.operators.includes(token.value))
	}

	static reduce(context, parser) {
		const {stack, item, i} = context
		if (
			i + 1 < stack.length
			&& parser.hasIntrinsicValue(stack[i + 1])
		) {
			const child = parser.reduce([stack[i + 1]])
			const inputRange = [item.inputRange[0], child.inputRange[1]]
			context.i++
			const addParenthesis = item.value !== '√' && !GroupPlugin.isOwnNode(child, parser)
			return new this.node({ type: 'operation-unary', value: item.value, nodes: [child], operatorPosition: 'left', inputRange, addParenthesis })
		}
	}

	static resolve(node) {
		const input = node.nodes[0].computed
		switch (node.value) {
			case 'sin':
				return Math.sin(input)
			case 'cos':
				return Math.cos(input)
			case 'tan':
				return Math.tan(input)
			case 'log':
				return Math.log10(input)
			case 'ln':
				return Math.log(input)
			case 'sqrt':
			case '√':
				return Math.sqrt(input)
			case 'abs':
				return Math.abs(input)
			case 'floor':
				return Math.floor(input)
			case 'ceil':
				return Math.ceil(input)
			case 'round':
				return Math.round(input)
			case 'sin⁻¹':
			case 'asin':
				return Math.asin(input)
			case 'cos⁻¹':
			case 'acos':
				return Math.acos(input)
			case 'tan⁻¹':
			case 'atan':
				return Math.atan(input)
		}
	}

	static stringify(node) {
		if (node.addParenthesis) {
			return `${node.value}(${node.nodes[0].asString})`
		} else {
			return `${node.value}${node.nodes[0].asString}`
		}
	}

	static mapRange(node, parser) {
		const lengthInInput = node.inputRange[1] - node.inputRange[0] + 1
		const rightOutputLength = node.nodes[0].outputRange[1] - node.nodes[0].outputRange[0] + 1
		const lengthInOutput = rightOutputLength + node.value.length
		const rightInputLength = node.nodes[0].inputRange[1] - node.nodes[0].inputRange[0] + 1
		const delta = lengthInInput - lengthInOutput
		const rightDelta = delta - (rightInputLength - rightOutputLength) - (node.addParenthesis ? 1 : 0)
		parser.walk(node.nodes[0], [
			(node) => {
				node.outputRange[0] -= rightDelta
				node.outputRange[1] -= rightDelta
			}
		])
		return [node.inputRange[0], node.inputRange[1] - delta + (node.addParenthesis ? 2 : 0)]
	}
}
