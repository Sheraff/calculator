import ParentNode from '../classes/ParentNode'
import Plugin from '../classes/Plugin'

class UnaryOperatorToken extends Plugin.token {}

/**
 * @typedef {Object} UnaryNodeConstructorAugment
 * @prop {'left' | 'right'} operatorPosition
 * @prop {boolean} addParenthesis
 */

class UnaryOperatorNode extends ParentNode {
	/** @param {UnaryNodeConstructorAugment & import('../classes/ParentNode').ParentNodeConstructor} props */
	constructor({ operatorPosition, addParenthesis, ...rest}) {
		super(rest)
		this.operatorPosition = operatorPosition
		this.addParenthesis = addParenthesis
	}
}

export default class UnaryOperatorPlugin extends Plugin {
	static token = UnaryOperatorToken
	static node = UnaryOperatorNode
	static operators = []

	static tokenize(context) {
		if (this.operators.includes(context.item)) {
			return new this.token({ value: context.item, inputRange: [context.i, context.i] })
		}
	}

	static hasIntrinsicValue(node) {
		return true
	}
}