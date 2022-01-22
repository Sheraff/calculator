import Plugin from './Plugin'
import MathParser from '..'
const parser = new MathParser([])
const token = new Plugin.token({ value: '1', inputRange: [0, 0] })
const node = new Plugin.node({ type: 'token', value: '1', inputRange: [0, 0] })
const completeNode = new Plugin.node({ type: 'token', value: '1', inputRange: [0, 0] })
completeNode.asString = '1'
completeNode.computed = 1
completeNode.outputRange = (/** @type {[number, number]} */([0, 0]))

test('tokenize', () => {
	const context = { item: '1', i: 0, stack: ['1'], tokens: [] }
	const token = Plugin.tokenize(context)
	expect(token).toEqual({ value: '1', inputRange: [0, 0] })
	expect(token instanceof Plugin.token).toEqual(true)
})

test('isOwnToken', () => {
	const context = { item: '1', i: 0, stack: ['1'], tokens: [] }
	const token = Plugin.tokenize(context)
	expect(Plugin.isOwnToken(token, parser)).toEqual(true)
	expect(Plugin.isOwnToken({ value: '1', inputRange: [0, 0] }, parser)).toEqual(false)
})

test('reduce', () => {
	const context = { item: token, result: [], stack: [token], i: 0 }
	const node = Plugin.reduce(context, parser)
	expect(node).toEqual({ type: 'node', value: '1', inputRange: [0, 0], outputRange: [], parent: null })
	expect(node instanceof Plugin.node).toEqual(true)
})

test('isOwnNode', () => {
	const node = new Plugin.node({ type: 'test', value: '1', inputRange: [0, 0] })
	expect(Plugin.isOwnNode(node, parser)).toEqual(true)
	// expect(Plugin.isOwnNode({ type: 'test', value: '1', inputRange: [0, 0] }, parser)).toEqual(false)
})

test('resolve', () => {
	expect(Plugin.resolve(node)).toEqual(NaN)
})

test('stringify', () => {
	const node = new Plugin.node({ type: 'token', value: '1', inputRange: [0, 0] })
	expect(Plugin.stringify(node)).toEqual('1')
})

test('hasIntrinsicValue', () => {
	expect(Plugin.hasIntrinsicValue(node, parser)).toEqual(false)
})

test('mapRange', () => {
	expect(Plugin.mapRange(completeNode, parser)).toEqual([0, 0])
	const otherNode = new Plugin.node({ type: 'token', value: 'abc', inputRange: [0, 2] })
	otherNode.asString = 'abc'
	expect(Plugin.mapRange(otherNode, parser)).toEqual([0, 2])
})