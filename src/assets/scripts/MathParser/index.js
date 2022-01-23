import Node from './classes/Node'
import ParentNode from './classes/ParentNode'

/**
 * @typedef {import('./classes/Token').default} Token
 */

/**
 * @template T
 * @callback Walker
 * @param {T} node
 * @param {boolean?} bypass
 */

export default class MathParser {
	/** @type {Array<typeof import('./classes/Plugin').default>} */
	plugins = []

	constructor(plugins) {
		this.plugins = [...plugins]
		this.walk = MathParser.walk
	}

	/** @type {Walker<import('./classes/Plugin').TokenizeContext>} */
	static tokenize
	/** @type {Walker<Node>} */
	static resolve
	/** @type {Walker<Node>} */
	static stringify
	/** @type {Walker<Node>} */
	static mapRange

	/** 
	 * @param {string} code
	 * @returns {Token[]}
	 */
	tokenize(code) {
		const context = /** @type {import('./classes/Plugin').TokenizeContext} */ ({
			stack: code.split(''),
			tokens: [],
		})
		for (context.i = 0; context.i < context.stack.length; context.i++) {
			context.item = context.stack[context.i]
			MathParser.tokenize.call(this, context, true)
		}
		return context.tokens
	}

	/** 
	 * @param {Token[]} tokens
	 * @returns {Node}
	 */
	reduce(tokens) {
		const context = /** @type {import('./classes/Plugin').ReduceContext} */ ({
			result: [],
			stack: [...tokens]
		})
		for (const plugin of this.plugins) {
			if (plugin.reduce) {
				for (context.i = 0; context.i < context.stack.length; context.i++) {
					context.item = context.stack[context.i]
					if (plugin.isOwnToken(context.item, this)) {
						const match = plugin.reduce(context, this)
						if (match) {
							context.result.push(match)
						} else {
							context.result.push(context.item)
						}
					} else {
						context.result.push(context.item)
					}
				}
				context.stack = [...context.result]
				context.result = []
			}
		}
		return /** @type {Node} */(context.stack[0])
	}

	static makeWalker(method, callback) {
		this[method] = function (item, bypass = false) {
			for (const plugin of (/** @type {MathParser} */(this)).plugins) {
				if (plugin[method] && (bypass || plugin.isOwnNode(item, (/** @type {MathParser} */(this))))) {
					const match = plugin[method](item, this)
					if (match !== undefined) {
						callback(item, match)
						break
					}
				}
			}
		}
	}

	/**
	 * @param {string} code 
	 * @returns {Node}
	 */
	parse(code) {
		const tokens = this.tokenize(code)
		if (tokens.length === 0) {
			const emptyNode = new Node({type: 'string', inputRange: [0, 0], value: ''})
			emptyNode.outputRange = [0, 0]
			emptyNode.computed = 0
			emptyNode.asString = ''
			return emptyNode
		}
		const ast = this.reduce(tokens)
		const processed = MathParser.walk(ast, [
			MathParser.resolve.bind(this),
			MathParser.stringify.bind(this),
			MathParser.mapRange.bind(this),
		])
		return processed
	}

	hasIntrinsicValue(token) {
		for (const plugin of this.plugins) {
			if (plugin.hasIntrinsicValue && plugin.isOwnNode(token, this) && plugin.hasIntrinsicValue(token, this)) {
				return true
			}
		}
		return false
	}

	/**
	 * @template T
	 * @param {T} node
	 * @param {Array<(node: T) => void>} onExit
	 * @returns {T}
	 */
	static walk(node, onExit) {
		const clone = Node.clone(node)
		if (clone.nodes) {
			clone.nodes = clone.nodes.map(partial => MathParser.walk(partial, onExit))
		}
		onExit.forEach((fn) => fn(clone))
		return clone
	}

	/**
	 * @param {Node | ParentNode} node
	 * @param {[number, number]} caret
	 * @returns {[number, number] | []}
	 */
	static locateCaret(node, caret) {
		if (node instanceof ParentNode && node.nodes) {
			for (let i = 0; i < node.nodes.length; i++) {
				const partial = node.nodes[i]
				if (MathParser.testNodeForCaret(partial, caret)) {
					return MathParser.locateCaret(partial, caret)
				}
			}
		}
		return node.outputRange
	}

	/**
	 * @param {Node} node 
	 * @param {[number, number]} caret 
	 * @returns 
	 */
	static testNodeForCaret(node, caret) {
		const [n1, n2] = node.inputRange
		const [c1, c2] = caret
		return n1 <= c1 && n2 + 1 >= c2
	}
}

// TODO: this should be a class static block, but i don't think i can configure Jest's babel without ejecting from create-react-app
MathParser.makeWalker('resolve', (node, result) => node.computed = result)
MathParser.makeWalker('stringify', (node, result) => node.asString = result)
MathParser.makeWalker('mapRange', (node, result) => node.outputRange = result)
MathParser.makeWalker('tokenize', (context, result) => context.tokens.push(result))