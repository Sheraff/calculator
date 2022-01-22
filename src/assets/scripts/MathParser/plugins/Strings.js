import findSequence from '../utils/findSequence'
import Plugin from '../classes/Plugin'

class StringToken extends Plugin.token {}
class StringNode extends Plugin.node {}

export default class StringPlugin extends Plugin {
	static token = StringToken
	static node = StringNode

	static tokenize(context) {
		const {i, stack, item} = context
		if (/[^\s]/.test(item)) {
			const string = findSequence(i + 1, stack, (c) => ( /[a-zA-Z⁻¹]/.test(c) || c === '.'))
			const {length} = string
			context.i += length
			return new this.token({ value: [item, ...string].join(''), inputRange: [i, i + length] })
		}
	}

	static reduce({item}) {
		return new this.node({...item, type: 'string'})
	}
}