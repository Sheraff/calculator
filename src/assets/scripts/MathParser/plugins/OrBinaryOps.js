/* eslint-disable no-undef -- bigint is undefined because TS isn't configured on this repo */

import BinaryOperatorPlugin from './BinaryOperators'

class OrBinaryOperatorToken extends BinaryOperatorPlugin.token { }
class OrBinaryOperatorNode extends BinaryOperatorPlugin.node { }

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
		/** @type {number[]} */
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
				terms.push(node.computed)
				signs.push(sign)
			}
		}

		// Start collection with the current operation
		collectTerms(node)

		if (terms.some(t => Number.isNaN(t)))
			return NaN
		if (terms.some(t => t === Infinity || t === -Infinity))
			return terms.reduce((acc, val, i) => {
				const sign = signs[i]
				if (val === Infinity) return acc + sign
				if (val === -Infinity) return acc - sign
				return acc
			}, 0) * Infinity

		// Perform Kahan summation
		let sum = BigInt(0)
		let compensation = BigInt(0) // Running compensation for lost low-order bits
		const multiplier = getMultiplier(...terms)

		for (let i = 0; i < terms.length; i++) {
			const term = Number.isInteger(terms[i])
				? BigInt(terms[i]) * BigInt(multiplier * signs[i])
				: BigInt(Math.trunc(terms[i] * multiplier * signs[i]))
			const y = (term - compensation)
			const t = (sum + y)
			compensation = t - sum - y
			sum = t
		}

		const max = BigInt(Number.MAX_SAFE_INTEGER)

		if (sum < max) {
			return Number(sum) / multiplier
		}

		let rest = multiplier
		const step = BigInt(10)
		while (sum > max && rest > 1) {
			sum /= step
			rest /= 10
		}

		return Number(sum) / rest
	}
}

/**
 * Return the smallest power of 10 that that can be multiplied by all terms to make them integers.
 * @param {number[]} terms
 * @returns {number}
 */
function getMultiplier(...terms) {
	let maxDecimals = 0

	for (const num of terms) {
		if (!Number.isFinite(num) || Number.isInteger(num)) continue

		// Convert to string and find decimal places
		const decimalStr = num.toString().split('.')[1]
		if (decimalStr) {
			// Remove trailing zeros
			const significantDecimals = decimalStr.replace(/0+$/, '')
			maxDecimals = Math.max(maxDecimals, significantDecimals.length)
		}
	}

	return Math.pow(10, maxDecimals)
}