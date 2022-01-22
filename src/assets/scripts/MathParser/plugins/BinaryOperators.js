import ParentNode from '../classes/ParentNode'
import Plugin from '../classes/Plugin'

class BinaryOperatorToken extends Plugin.token {}
class BinaryOperatorNode extends ParentNode {}

export default class BinaryOperatorPlugin extends Plugin {
	static token = BinaryOperatorToken
	static node = BinaryOperatorNode
	static operators = []

	static tokenize(context) {
		if (this.operators.includes(context.item)) {
			return new this.token({ value: context.item, inputRange: [context.i, context.i] })
		}
	}

	static reduce(context, parser) {
		const {stack, result, item, i} = context
		if (
			result.length > 0
			&& i + 1 < stack.length
			&& parser.hasIntrinsicValue(result[result.length - 1])
			&& parser.hasIntrinsicValue(stack[i + 1])
		) {
			const left = parser.reduce([result.pop()])
			const right = parser.reduce([stack[i + 1]])
			const inputRange = [left.inputRange[0], right.inputRange[1]]
			context.i++
			return new this.node({ type: 'operation-binary', value: item.value, nodes: [left, right], inputRange })
		}
	}

	static stringify(node) {
		return `${node.nodes[0].asString} ${node.value} ${node.nodes[1].asString}`
	}

	static hasIntrinsicValue(node) {
		return true
	}

	static mapRange(node, parser) {
		const lengthInInput = node.inputRange[1] - node.inputRange[0] + 1
		const leftOutputLength = node.nodes[0].outputRange[1] - node.nodes[0].outputRange[0] + 1
		const rightOutputLength = node.nodes[1].outputRange[1] - node.nodes[1].outputRange[0] + 1
		const lengthInOutput = leftOutputLength + rightOutputLength + 3
		const rightInputLength = node.nodes[1].inputRange[1] - node.nodes[1].inputRange[0] + 1
		const delta = lengthInInput - lengthInOutput
		const rightDelta = delta - (rightInputLength - rightOutputLength)
		parser.walk(node.nodes[1], [
			(node) => {
				node.outputRange[0] -= rightDelta
				node.outputRange[1] -= rightDelta
			}
		])
		return [node.inputRange[0], node.inputRange[1] - delta]
	}
}