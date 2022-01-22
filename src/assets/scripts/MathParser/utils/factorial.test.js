import factorial from './factorial'

it('works', () => {
	expect(factorial(1)).toEqual(1)
	expect(factorial(2)).toEqual(2)
	expect(factorial(3)).toEqual(6)
	expect(factorial(4)).toEqual(24)
	expect(factorial(0)).toEqual(1)
	expect(factorial(-1)).toEqual(1)
	expect(factorial(1000)).toEqual(Infinity)
});