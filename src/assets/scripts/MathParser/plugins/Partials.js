import Plugin from '../classes/Plugin'
import ParentNode from '../classes/ParentNode'

class PartialsNode extends ParentNode {}

class PartialsPlugin extends Plugin {
	static token = null
	static node = PartialsNode

	static tokenize = null

	static isOwnToken() {
		return true
	}

	static reduce(context, parser) {
		if (context.stack.length > 1) {
			const {stack} = context
			const inputRange = [stack[0].inputRange[0], stack[stack.length - 1].inputRange[1]]
			context.i += stack.length - 1
			return new this.node({ type: 'partials', nodes: [...stack], inputRange, value: '' })
		}
	}

	static isOwnNode() {
		return true
	}

	static resolve(node) {
		if (node instanceof this.node) {
			const hasValue = node.nodes.filter(partial => !isNaN(partial.computed))
			if (hasValue.length === 1) {
				return hasValue[0].computed
			}
			return NaN
		}
	}

	static stringify(node) {
		if (node instanceof this.node) {
			return node.nodes
				.map(node => node.asString)
				.join(' ')
		}
		if (!node.asString) {
			return node.value
		}
	}

	static hasIntrinsicValue = null

	static getDefaultRange(node) {
		const delta = Math.max(0, node.value.length - 1)
		return [node.inputRange[0], node.inputRange[0] + delta]
	}

	static mapRange(node, parser) {
		if (node instanceof this.node) {
			for (let i = 1; i < node.nodes.length; i++) {
				const prevSibling = node.nodes[i - 1]
				const partial = node.nodes[i]
				const deltaFromSiblingOutput = prevSibling.inputRange[1] - prevSibling.outputRange[1]
				const deltaFromInputSpace = partial.inputRange[0] - prevSibling.inputRange[1] - 2
				const delta = deltaFromSiblingOutput + deltaFromInputSpace
				parser.walk(partial, [
					(child) => {
						if (!child.outputRange || !child.outputRange.length) {
							child.outputRange = this.getDefaultRange(child)
						}
						child.outputRange[0] -= delta
						child.outputRange[1] -= delta
					}
				])
			}
			return [node.nodes[0].outputRange[0], node.nodes[node.nodes.length - 1].outputRange[1]]
		}
		if (!node.outputRange || !node.outputRange.length) {
			return this.getDefaultRange(node)
		}
	}
}

export default PartialsPlugin