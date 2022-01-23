import Token from './Token'
import Node from './Node'

/**
 * @typedef {import('../index').default} MathParser
 */

/**
 * @typedef {Object} TokenizeContext
 * @prop {string[]} stack
 * @prop {Token[]} tokens
 * @prop {number} i
 * @prop {string} item
 */

/**
 * @typedef {Object} ReduceContext
 * @prop {Array<Node | Token>} result
 * @prop {Array<Node | Token>} stack
 * @prop {number} i
 * @prop {Node | Token} item
 */

export default class Plugin {
	static token = Token
	static node = Node

	/** 
	 * @param {TokenizeContext} context
	 * @returns {Token | undefined}
	 */
	static tokenize(context) {
		return new this.token({ value: context.item, inputRange: [context.i, context.i] })
	}

	/** 
	 * @param {Token} token 
	 * @param {MathParser} parser
	 */
	static isOwnToken(token, parser) {
		return token instanceof this.token
	}

	/** 
	 * @param {ReduceContext} context 
	 * @param {MathParser} parser
	 */
	static reduce(context, parser) {
		return new this.node({type: 'node', ...context.item})
	}

	/** 
	 * @param {Node | Token} node 
	 * @param {MathParser} parser
	 */
	static isOwnNode(node, parser) {
		return node instanceof this.node
	}

	/** @param {Node} node */
	static resolve(node) {
		return NaN
	}

	/** @param {Node} node */
	static stringify(node) {
		return node.value
	}

	/** 
	 * @param {Node | Token} node 
	 * @param {MathParser} parser
	 */
	static hasIntrinsicValue(node, parser) {
		return false
	}

	/** 
	 * @param {Node} node 
	 * @param {MathParser} parser
	 */
	static mapRange(node, parser) {
		return [node.inputRange[0], node.inputRange[0] + node.asString.length - 1]
	}

}