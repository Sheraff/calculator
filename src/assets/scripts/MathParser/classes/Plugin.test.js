import Plugin from './Plugin'

test('tokenize', () => {
	const context = { item: '1', i: 0 }
	const token = Plugin.tokenize(context)
	expect(token).toEqual({ value: '1', inputRange: [0, 0] })
	expect(token instanceof Plugin.token).toEqual(true)
})

test('isOwnToken', () => {
	const context = { item: '1', i: 0 }
	const token = Plugin.tokenize(context)
	expect(Plugin.isOwnToken(token)).toEqual(true)
	expect(Plugin.isOwnToken({ value: '1', inputRange: [0, 0] })).toEqual(false)
})

test('reduce', () => {
	const context = { item: new Plugin.token({ value: '1', inputRange: [0, 0] }) }
	const node = Plugin.reduce(context)
	expect(node).toEqual({ type: 'node', value: '1', inputRange: [0, 0], outputRange: [] })
	expect(node instanceof Plugin.node).toEqual(true)
})

test('isOwnNode', () => {
	const node = new Plugin.node({ type: 'test', value: '1', inputRange: [0, 0] })
	expect(Plugin.isOwnNode(node)).toEqual(true)
	expect(Plugin.isOwnNode({ type: 'test', value: '1', inputRange: [0, 0] })).toEqual(false)
})

test('resolve', () => {
	expect(Plugin.resolve()).toEqual(NaN)
})

test('stringify', () => {
	const node = new Plugin.node({ type: 'token', value: '1', inputRange: [0, 0] })
	expect(Plugin.stringify(node)).toEqual('1')
})

test('hasIntrinsicValue', () => {
	expect(Plugin.hasIntrinsicValue()).toEqual(false)
})

test('mapRange', () => {
	expect(Plugin.mapRange({ type: 'token', value: '1', asString: '1', inputRange: [0, 0] })).toEqual([0, 0])
	expect(Plugin.mapRange({ type: 'token', value: 'abc', asString: 'abc', inputRange: [0, 2] })).toEqual([0, 2])
})