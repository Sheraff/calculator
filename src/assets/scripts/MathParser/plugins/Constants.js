import Plugin from '../classes/Plugin'
import StringPlugin from './Strings'

class ConstNode extends Plugin.node {}

export default class ConstPlugin extends Plugin {
	static token = StringPlugin.token
	static node = ConstNode
	static constants = ['π', 'pi', 'e', 'gold', 'phi', 'ɸ', 'tau', 'τ', 'infinity', '∞']

	static tokenize = null

	static reduce(context) {
		if (this.constants.includes(context.item.value)) {
			return new this.node({ type: 'const', value: context.item.value, inputRange: context.item.inputRange })
		}
	}

	static resolve(node) {
		switch (node.value) {
			case 'pi':
			case 'π':
				return Math.PI
			case 'e':
				return Math.E
			case 'gold':
			case 'phi':
			case 'ɸ':
				return 1.618033988749895
			case 'tau':
			case 'τ':
				return Math.PI * 2
			case 'infinity':
			case '∞':
				return Infinity
		}
	}

	static stringify(node) {
		switch (node.value) {
			case 'pi':
			case 'π':
				return 'π'
			case 'e':
				return 'e'
			case 'gold':
			case 'phi':
			case 'ɸ':
				return 'ɸ'
			case 'tau':
			case 'τ':
				return 'τ'
			case 'infinity':
			case '∞':
				return '∞'
		}
	}

	static hasIntrinsicValue(node) {
		return true
	}

	static mapRange(node) {
		switch (node.value) {
			case 'pi':
			case 'π':
			case 'e':
			case 'gold':
			case 'phi':
			case 'ɸ':
			case 'tau':
			case 'τ':
			case 'infinity':
			case '∞':
				return [node.inputRange[0], node.inputRange[0]]
		}
	}
}