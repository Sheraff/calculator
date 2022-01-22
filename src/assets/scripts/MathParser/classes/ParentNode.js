import Node from './Node'

/**
 * @typedef {Object} ParentNodeConstructorAugment
 * @prop {Node[]?} props.nodes
 */

/**
 * @typedef {ParentNodeConstructorAugment & import('./Node').NodeConstructor} ParentNodeConstructor
 */

export default class ParentNode extends Node {

	/** @param {ParentNodeConstructor} props */
	constructor({
		nodes,
		...rest
	}) {
		super(rest)
		this.nodes = nodes
		if (nodes) {
			for (const node of nodes) {
				node.parent = this
			}
		}
	}
}