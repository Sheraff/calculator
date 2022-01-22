import Plugin from '../classes/Plugin'
import StringPlugin from './Strings'

class ConstNode extends Plugin.node {}

export default class ConstPlugin extends Plugin {
	static token = StringPlugin.token
	static node = ConstNode
	static constants = ['pi', 'e', 'gold', 'phi', 'tau']

	static tokenize = null

	static reduce(context) {
		if (this.constants.includes(context.item.value)) {
			return new this.node({ type: 'const', value: context.item.value, inputRange: context.item.inputRange })
		}
	}

	static resolve(node) {
		switch (node.value) {
			case 'pi':
				return Math.PI
			case 'e':
				return Math.E
			case 'gold':
			case 'phi':
				return 1.618033988749895
			case 'tau':
				return Math.PI * 2
		}
	}

	static stringify(node) {
		switch (node.value) {
			case 'pi':
				return 'π'
			case 'e':
				return 'e'
			case 'gold':
			case 'phi':
				return 'ɸ'
			case 'tau':
				return 'τ'
		}
	}

	static hasIntrinsicValue(node) {
		return true
	}

	static mapRange(node) {
		switch (node.value) {
			case 'pi':
			case 'e':
			case 'gold':
			case 'phi':
			case 'tau':
				return [node.inputRange[0], node.inputRange[0]]
		}
	}
}