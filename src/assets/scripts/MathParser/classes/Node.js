import Token from './Token'

/**
 * @typedef {Object} NodeConstructorAugment
 * @prop {string} type
 */

/**
 * @typedef {NodeConstructorAugment & Token} NodeConstructor
 */

export default class Node extends Token {
	/** @type {null | [] | [number, number]} */
	outputRange = []

	/** @type {number} */
	computed

	/** @type {string} */
	asString

	/** @type {Node} */
	parent = null

	/** @param {NodeConstructor} props */
	constructor({
		type = 'node',
		value,
		inputRange,
	}) {
		super({value, inputRange})
		this.type = type
	}

	static clone(node) {
		const clone = new node.constructor(node)
		clone.outputRange = node.outputRange
		clone.parent = node.parent
		return clone
	}
}