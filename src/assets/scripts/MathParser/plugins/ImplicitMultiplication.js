import Node from '../classes/Node'
import AndBinaryOperatorPlugin from './AndBinaryOps'
import GroupPlugin from './Groups'
import LeftUnaryOperatorPlugin from './LeftUnaryOps'
import RightUnaryOperatorPlugin from './RightUnaryOps'
import NumberPlugin from './Numbers'
import ConstPlugin from './Constants'

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
				|| GroupPlugin.isOwnNode(left, parser)
				|| GroupPlugin.isOwnNode(right, parser)
				|| LeftUnaryOperatorPlugin.isOwnNode(right, parser)
				|| RightUnaryOperatorPlugin.isOwnNode(left, parser)
				|| (NumberPlugin.isOwnNode(left, parser) && ConstPlugin.isOwnNode(right, parser))
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