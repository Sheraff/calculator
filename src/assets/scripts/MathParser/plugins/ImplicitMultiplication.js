import Node from '../classes/Node'
import AndBinaryOperatorPlugin from './AndBinaryOps'
import GroupPlugin from './Groups'
import LeftUnaryOperatorPlugin from './LeftUnaryOps'
import RightUnaryOperatorPlugin from './RightUnaryOps'

export default class ImplicitMultiplicationPlugin extends AndBinaryOperatorPlugin {

	static tokenize = null

	static isOwnToken(token, parser) {
		return token instanceof Node && parser.hasIntrinsicValue(token)
	}

	static reduce(context, parser) {
		const {result, item} = context
		if (
			result.length > 0
			&& parser.hasIntrinsicValue(result[result.length - 1])
		) {
			const left = result.pop()
			const right = item

			const hasSpace = left.inputRange[1] + 1 < right.inputRange[0]
			if (
				hasSpace
				|| GroupPlugin.isOwnNode(left)
				|| GroupPlugin.isOwnNode(right)
				|| LeftUnaryOperatorPlugin.isOwnNode(right)
				|| RightUnaryOperatorPlugin.isOwnNode(left)
			) {
				const inputRange = [left.inputRange[0], right.inputRange[1]]
				return new this.node({ type: 'operation-binary', value: '×', nodes: [left, right], inputRange })
			}
		}
	}

	static isOwnNode(node) {
		return false
	}
}