import BinaryOperatorPlugin from './BinaryOperators'

class PowBinaryOperatorToken extends BinaryOperatorPlugin.token {}
class PowBinaryOperatorNode extends BinaryOperatorPlugin.node {}

export default class PowBinaryOperatorPlugin extends BinaryOperatorPlugin {
	static token = PowBinaryOperatorToken
	static node = PowBinaryOperatorNode
	static operators = ['^']

	static resolve(node) {
		const left = node.nodes[0].computed
		const right = node.nodes[1].computed
		return Math.pow(left, right)
	}
}