import Plugin from '../classes/Plugin'
import findSequence from '../utils/findSequence'

class NumberNode extends Plugin.node {}

export default class NumberPlugin extends Plugin {
	static node = NumberNode

	static tokenize(context) {
		if (/[0-9.]/.test(context.item)) {
			const {i, stack} = context
			const number = findSequence(i, stack, (c) => (/[0-9.]/.test(c)))
			if (number.length > 1 || number[0] !== '.') {
				const length = number.length - 1
				context.i += length
				return new this.node({ type: 'number', value: number.join(''), inputRange: [i, i + length] })
			}
		}
	}

	static reduce = null

	static resolve(node) {
		return Number.parseFloat(node.value)
	}

	static hasIntrinsicValue(node) {
		return true
	}
}