import findSequence from './findSequence'

it('finds a sequence in an array of chars', () => {
	const array = 'hello world'.split('')
	expect(findSequence(0, array, c => c === 'h')).toEqual(['h'])
	expect(findSequence(0, array, c => /[^\s]/.test(c))).toEqual(['h', 'e', 'l', 'l', 'o'])
	expect(findSequence(6, array, c => /[^\s]/.test(c))).toEqual(['w', 'o', 'r', 'l', 'd'])
})

it('finds a sequence in an array of objects', () => {
	const array = [
		{ type: 'foo', value: 0 },
		{ type: 'foo', value: 0 },
		{ type: 'bar', value: 0 },
		{ type: 'foo', value: 0 },
		{ type: 'bar', value: 1 },
		{ type: 'foo', value: 0 },
	]
	expect(findSequence(0, array, c => c.type !== 'bar')).toEqual([array[0], array[1]])
	expect(findSequence(0, array, c => c.type !== 'bar' || c.value !== 1)).toEqual([array[0], array[1], array[2], array[3]])
})