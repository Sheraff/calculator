import {
	multiply,
	divide,
	add,
	subtract,
} from './floatMath'

it('sums numbers', () => {
	expect(add(1, 2)).toEqual(3)
	expect(add(2, -2)).toEqual(0)
	expect(add(0.1, 0.2)).toEqual(0.3)
	expect(add(10000000000000, 0.00000000000001)).toEqual(10000000000000.00000000000001)
})

it('subtracts numbers', () => {
	expect(subtract(1, 2)).toEqual(-1)
	expect(subtract(1, 0.9)).toEqual(0.1)
	expect(subtract(0.3, 0.1)).toEqual(0.2)
	expect(subtract(0.1, 0.3)).toEqual(-0.2)
})

it('multiplies numbers', () => {
	expect(multiply(1, 2)).toEqual(2)
	expect(multiply(3, 0.3)).toEqual(0.9)
	expect(multiply(1e+100, 1e-100)).toEqual(1)
})

it('divides numbers', () => {
	expect(divide(2, 2)).toEqual(1)
	expect(divide(0.3, 3)).toEqual(0.1)
	expect(divide(1e+100, 1e-100)).toEqual(1e+200)
})

it('loses precision but doesn\'t fail', () => {
	expect(add(1e+100, 1e-100)).toEqual(1e+100)
	expect(subtract(1e+100, 1e-100)).toEqual(1e+100)
})