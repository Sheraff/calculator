/* eslint-disable no-undef -- bigint is undefined because TS isn't configured on this repo */

import BinaryOperatorPlugin from './BinaryOperators'

class OrBinaryOperatorToken extends BinaryOperatorPlugin.token {}
class OrBinaryOperatorNode extends BinaryOperatorPlugin.node {}

export default class OrBinaryOperatorPlugin extends BinaryOperatorPlugin {
	static token = OrBinaryOperatorToken
	static node = OrBinaryOperatorNode
	static operators = ['+', '-']

	/**
	 * Resolve the entire tree of nodes down to every node that is also an OrBinaryOperatorNode.
	 * This allows for Kahan summation to be performed on the entire tree.
	 * @see https://en.wikipedia.org/wiki/Kahan_summation_algorithm
	 * 
	 * for example, `1 + 10^100 - 10^100` will return `1` instead of `0`
	 *
	 * @param {OrBinaryOperatorNode} node
	 */
	static resolve(node) {
		// Collect all terms for Kahan summation
		/** @type {bigint[]} */
		const terms = []
		const signs = []

		/** @param {import('../classes/Node').default} node */
		function collectTerms(node, sign = 1) {
			if (node instanceof OrBinaryOperatorNode) {
				const left = node.nodes?.[0]
				const right = node.nodes?.[1]
				if (!left || !right) throw new Error('Cannot resolve node')
				if (node.value === '+') {
					collectTerms(left, sign)
					collectTerms(right, sign)
				} else if (node.value === '-') {
					collectTerms(left, sign)
					collectTerms(right, -sign)
				}
			} else {
				terms.push(BigInt(node.computed))
				signs.push(sign)
			}
		}

		// Start collection with the current operation
		collectTerms(node)

		// Perform Kahan summation
		let sum = BigInt(0)
		let compensation = BigInt(0) // Running compensation for lost low-order bits

		for (let i = 0; i < terms.length; i++) {
			const term = terms[i] * BigInt(signs[i])
			const y = (term - compensation)
			const t = (sum + y)
			compensation = t - sum - y
			sum = t
		}

		return Number(sum)
	}
}