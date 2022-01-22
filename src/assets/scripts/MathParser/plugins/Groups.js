import ParentNode from '../classes/ParentNode'
import Plugin from '../classes/Plugin'
import Token from '../classes/Token'
import findSequence from '../utils/findSequence'
import StringPlugin from './Strings'

/**
 * @typedef {Object} GroupTokenConstructorAugment
 * @prop {number} depth
 * @prop {string} boundary
 */

class GroupToken extends Token {
	/** @param {GroupTokenConstructorAugment & Token} props */
	constructor({ depth, boundary, ...rest}) {
		super(rest)
		this.depth = depth
		this.boundary = boundary
	}
}

class GroupNode extends ParentNode {}

export default class GroupPlugin extends Plugin {
	static token = GroupToken
	static node = GroupNode

	static tokenize(context) {
		if (!('depth' in context)) {
			context.depth = 0
		}
		if (context.item === '(') {
			const {i, depth} = context
			context.depth++
			return new this.token({ value: context.item, inputRange: [i, i], depth, boundary: 'start' })
		}
		if (context.item === ')') {
			context.depth--
			const {i, depth} = context
			return new this.token({ value: context.item, inputRange: [i, i], depth, boundary: 'end' })
		}
	}

	/**
	 * @param {GroupToken} a
	 * @param {Token | GroupToken} b
	 */
	static matchTokenPair(a, b, parser) {
		const isGroupToken = this.isOwnToken(b, parser)
		if (!isGroupToken) {
			return false
		}
		const isEnd = (/** @type {GroupToken} */ (b)).boundary === 'end'
		return isEnd && a.depth === (/** @type {GroupToken} */ (b)).depth
	}

	static reduce(context, parser) {
		if (context.item.boundary === 'start') {
			const {i, item, stack} = context
			const subTokens = findSequence(i + 1, stack, (t) => !this.matchTokenPair(item, t, parser))
			if (subTokens.length) {
				const newIndex = context.i + subTokens.length + 1
				context.i = newIndex
				const inputRange = [item.inputRange[0]]
				if (stack[newIndex]) {
					inputRange[1] = stack[newIndex].inputRange[1]
				} else { // handle incomplete parentheses pair
					inputRange[1] = subTokens[subTokens.length - 1].inputRange[1]
				}
				return new this.node({ type: 'group', nodes: [parser.reduce(subTokens)], inputRange, value: '()' })
			} else if (!stack[i + 1] || this.matchTokenPair(item, stack[i + 1], parser)) { // handle empty parentheses pair
				const inputRange = [item.inputRange[0]]
				if (stack[i + 1]) {
					inputRange[1] = stack[i + 1].inputRange[1]
					context.i++
				} else { // handle incomplete parentheses pair
					inputRange[1] = item.inputRange[0]
				}
				return new this.node({ type: 'group', inputRange, nodes: null, value: '()' })
			}
		} else { // handle lone ')' closing parentheses
			const {item} = context
			return new StringPlugin.node({ type: 'string', value: item.value, inputRange: [item.inputRange[0], item.inputRange[0] + 1] })
		}
	}

	static resolve(node) {
		if (node.nodes) {
			return node.nodes[0].computed
		} else {
			return super.resolve(node)
		}
	}

	static stringify(node) {
		if (node.nodes) {
			return `(${node.nodes[0].asString})`
		} else {
			return '()'
		}
	}

	static hasIntrinsicValue(node) {
		return true
	}

	static mapRange(node, parser) {
		if (node.nodes) {
			const childLength = node.nodes[0].outputRange[1] - node.nodes[0].outputRange[0]
			const delta = node.nodes[0].inputRange[0] - (node.inputRange[0] + 1)
			parser.walk(node.nodes[0], [
				(node) => {
					node.outputRange[0] -= delta
					node.outputRange[1] -= delta
				}
			])
			return [node.inputRange[0], node.inputRange[0] + childLength + 2]
		} else {
			return super.mapRange(node, parser)
		}
	}
}