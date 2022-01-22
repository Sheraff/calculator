import Node from './classes/Node';

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

	/** @param {string} code */
	tokenize(code) {
		const context = {
			stack: code.split(''),
			tokens: [],
		}
		for (context.i = 0; context.i < context.stack.length; context.i++) {
			context.item = context.stack[context.i]
			MathParser.tokenize.call(this, context, true)
		}
		return context.tokens
	}

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
		return context.stack[0]
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

	static {
		this.makeWalker('resolve', (node, result) => node.computed = result)
		this.makeWalker('stringify', (node, result) => node.asString = result)
		this.makeWalker('mapRange', (node, result) => node.outputRange = result)
		this.makeWalker('tokenize', (context, result) => context.tokens.push(result))
	}

	parse(code) {
		const tokens = this.tokenize(code)
		// console.log(tokens)
		const ast = this.reduce(tokens)
		// console.log(ast)
		const processed = MathParser.walk(ast, [
			MathParser.resolve.bind(this),
			MathParser.stringify.bind(this),
			MathParser.mapRange.bind(this),
		])
		// console.log(ast)
		// console.log(processed.asString + ' = ' + processed.computed)
		// console.log(JSON.stringify(processed))
		// console.log(processed)
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

	static walk(node, exit) {
		const clone = Node.clone(node)
		if (clone.nodes) {
			clone.nodes = clone.nodes.map(partial => MathParser.walk(partial, exit))
		}
		exit.forEach((fn) => fn(clone))
		return clone
	}

	static locateCaret(node, caret) {
		if (node.nodes) {
			for (let i = 0; i < node.nodes.length; i++) {
				const partial = node.nodes[i];
				if (MathParser.testNodeForCaret(partial, caret)) {
					return MathParser.locateCaret(partial, caret)
				}
			}
		}
		return node.outputRange
	}

	static testNodeForCaret(node, caret) {
		const [n1, n2] = node.inputRange
		const [c1, c2] = caret
		return n1 <= c1 && n2 + 1 >= c2
	}
}