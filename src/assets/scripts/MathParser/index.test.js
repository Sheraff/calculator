import ConstPlugin from './plugins/Constants'
import GroupPlugin from './plugins/Groups'
import MinusUnaryOperatorPlugin from './plugins/MinusUnaryOps'
import LeftUnaryOperatorPlugin from './plugins/LeftUnaryOps'
import RightUnaryOperatorPlugin from './plugins/RightUnaryOps'
import PowBinaryOperatorPlugin from './plugins/PowBinaryOps'
import AndBinaryOperatorPlugin from './plugins/AndBinaryOps'
import OrBinaryOperatorPlugin from './plugins/OrBinaryOps'
import ImplicitMultiplicationPlugin from './plugins/ImplicitMultiplication'
import NumberPlugin from './plugins/Numbers'
import StringPlugin from './plugins/Strings'
import PartialsPlugin from './plugins/Partials'
import MathParser from '.'

describe('StringPlugin', () => {
	it('should parse strings', () => {
		const parser = new MathParser([ StringPlugin ])
		const result = parser.parse('abc def ghi')
		expect(result.asString).toBe('abc')
		expect(result.computed).toBe(NaN)
		expect(result.inputRange).toEqual([0, 2])
		expect(result.outputRange).toEqual([0, 2])
	})
})

describe('PartialsPlugin', () => {
	const parser = new MathParser([
		ConstPlugin,
		StringPlugin,
		PartialsPlugin,
	])
	it('handles unknown tokens as "partial nodes"', () => {
		const result = parser.parse('1 2 3')
		expect(result.asString).toBe('1 2 3')
		expect(result.computed).toBe(NaN)
		expect(result.inputRange).toEqual([0, 4])
		expect(result.outputRange).toEqual([0, 4])
	})
	it('correctly offsets outputRange of its children', () => {
		const result = parser.parse('f   lo    or')
		expect(result.asString).toBe('f lo or')
		expect(result.inputRange).toEqual([0, 11])
		expect(result.nodes[0].outputRange).toEqual([0, 0])
		expect(result.nodes[1].outputRange).toEqual([2, 3])
		expect(result.nodes[2].outputRange).toEqual([5, 6])
		expect(result.outputRange).toEqual([0, 6])
	})
	it('...even if they change size', () => {
		const result = parser.parse('a   pi    b')
		expect(result.asString).toBe('a π b')
		expect(result.inputRange).toEqual([0, 10])
		expect(result.nodes[0].outputRange).toEqual([0, 0])
		expect(result.nodes[1].outputRange).toEqual([2, 2])
		expect(result.nodes[2].outputRange).toEqual([4, 4])
		expect(result.outputRange).toEqual([0, 4])
	})
})

describe('ConstPlugin', () => {
	it('should parse some strings as known values', () => {
		const parser = new MathParser([
			ConstPlugin,
			StringPlugin,
			PartialsPlugin
		])
		const result = parser.parse('pi')
		expect(result.asString).toBe('π')
		expect(result.computed).toBe(Math.PI)
		expect(result.inputRange).toEqual([0, 1])
		expect(result.outputRange).toEqual([0, 0])
		expect(parser.parse('e').computed).toBe(Math.E)
	})
})

describe('NumberPlugin', () => {
	it('should parse numbers', () => {
		const parser = new MathParser([ NumberPlugin ])
		const result = parser.parse('3789.39820')
		expect(result.asString).toBe('3789.39820')
		expect(result.computed).toBe(3789.39820)
		expect(result.inputRange).toEqual([0, 9])
		expect(result.outputRange).toEqual([0, 9])
	})
})

describe('OrBinaryOperatorPlugin', () => {
	const parser = new MathParser([
		OrBinaryOperatorPlugin,
		NumberPlugin,
	])
	it('should parse additions', () => {
		const result = parser.parse('2+2')
		expect(result.asString).toBe('2 + 2')
		expect(result.computed).toBe(4)
		expect(result.inputRange).toEqual([0, 2])
		expect(result.outputRange).toEqual([0, 4])
	})
	it('should parse subtractions', () => {
		expect(parser.parse('0.3 - 0.1').computed).toBe(0.2)
	})
})

describe('AndBinaryOperatorPlugin', () => {
	const parser = new MathParser([
		AndBinaryOperatorPlugin,
		NumberPlugin,
	])
	it('should parse multiplications', () => {
		const result = parser.parse('2 ×2')
		expect(result.asString).toBe('2 × 2')
		expect(result.computed).toBe(4)
		expect(result.inputRange).toEqual([0, 3])
		expect(result.outputRange).toEqual([0, 4])
		expect(parser.parse('3*3').computed).toBe(9)
	})
	it('should parse divisions', () => {
		expect(parser.parse('3÷3').computed).toBe(1)
		expect(parser.parse('12/2').computed).toBe(6)
	})
})

describe('ImplicitMultiplicationPlugin', () => {
	it('should default sibling values as a multiplication', () => {
		const parser = new MathParser([
			ImplicitMultiplicationPlugin,
			AndBinaryOperatorPlugin,
			NumberPlugin,
		])
		const result = parser.parse('2 2')
		expect(result.asString).toBe('2 × 2')
		expect(result.computed).toBe(4)
		expect(result.inputRange).toEqual([0, 2])
		expect(result.outputRange).toEqual([0, 4])
	})
})

describe('PowBinaryOperatorPlugin', () => {
	const parser = new MathParser([
		PowBinaryOperatorPlugin,
		NumberPlugin,
	])
	it('should parse inline exponent chevron notation', () => {
		const result = parser.parse('2  ^   3')
		expect(result.asString).toBe('2 ^ 3')
		expect(result.computed).toBe(8)
		expect(result.inputRange).toEqual([0, 7])
		expect(result.outputRange).toEqual([0, 4])
	})
})

describe('RightUnaryOperatorPlugin', () => {
	const parser = new MathParser([
		ConstPlugin,
		RightUnaryOperatorPlugin,
		NumberPlugin,
		StringPlugin,
	])
	it('should parse unary expressions w/ operators on the right', () => {
		const result = parser.parse('2 !')
		expect(result.asString).toBe('2!')
		expect(result.computed).toBe(2)
		expect(result.inputRange).toEqual([0, 2])
		expect(result.outputRange).toEqual([0, 1])
		expect(parser.parse('2²').computed).toBe(4)
		expect(parser.parse('2³').computed).toBe(8)
		expect(parser.parse('2%').computed).toBe(0.02)
	})
	it('correctly handles outputRange', () => {
		const result = parser.parse('pi   ²')
		expect(result.asString).toBe('π²')
		expect(result.inputRange).toEqual([0, 5])
		expect(result.outputRange).toEqual([0, 1])
	})
})

describe('LeftUnaryOperatorPlugin', () => {
	describe('should parse unary expressions w/ operators on the left', () => {
		const parser = new MathParser([
			LeftUnaryOperatorPlugin,
			NumberPlugin,
			StringPlugin,
		])
		it('works for strings', () => {
			const result = parser.parse('sin 2')
			expect(result.asString).toBe('sin(2)')
			expect(result.computed).toBe(Math.sin(2))
			expect(result.inputRange).toEqual([0, 4])
			expect(result.outputRange).toEqual([0, 5])
			expect(parser.parse('cos2').computed).toBe(Math.cos(2))
			expect(parser.parse('floor 2.5').computed).toBe(2)
			expect(parser.parse('sin⁻¹ 2').computed).toBe(Math.asin(2))
		})
		it('works for operators', () => {
			const result = parser.parse('√9')
			expect(result.asString).toBe('√9')
			expect(result.computed).toBe(3)
			expect(result.inputRange).toEqual([0, 1])
			expect(result.outputRange).toEqual([0, 1])
		})
	})
	describe('outputRange', () => {
		const parser = new MathParser([
			ConstPlugin,
			LeftUnaryOperatorPlugin,
			NumberPlugin,
			StringPlugin,
		])
		it('correctly offsets outputRange of its child', () => {
			const result = parser.parse('sin   2')
			expect(result.asString).toBe('sin(2)')
			expect(result.inputRange).toEqual([0, 6])
			expect(result.nodes[0].outputRange).toEqual([4, 4])
			expect(result.outputRange).toEqual([0, 5])
		})
		it('...even if they change size', () => {
			const result = parser.parse('sin   pi')
			expect(result.asString).toBe('sin(π)')
			expect(result.inputRange).toEqual([0, 7])
			expect(result.nodes[0].outputRange).toEqual([4, 4])
			expect(result.outputRange).toEqual([0, 5])
		})
	})
	describe('works with GroupPlugin', () => {
		const parser = new MathParser([
			GroupPlugin,
			LeftUnaryOperatorPlugin,
			NumberPlugin,
			StringPlugin,
		])
		it('works for a simple basic input', () => {
			const result = parser.parse('sin(2)')
			expect(result.asString).toBe('sin(2)')
			expect(result.computed).toBe(Math.sin(2))
			expect(result.inputRange).toEqual([0, 5])
			expect(result.outputRange).toEqual([0, 5])
			expect(result.nodes[0].outputRange).toEqual([3, 5])
		})
		it('correctly offsets outputRange of its child', () => {
			const result = parser.parse('sin   (  2)')
			expect(result.asString).toBe('sin(2)')
			expect(result.inputRange).toEqual([0, 10])
			expect(result.nodes[0].outputRange).toEqual([3, 5])
			expect(result.outputRange).toEqual([0, 5])
		})
	})
})

describe('MinusUnaryOperatorPlugin', () => {
	const parser = new MathParser([
		MinusUnaryOperatorPlugin,
		OrBinaryOperatorPlugin,
		NumberPlugin,
	])
	it('knows that a lone "-" is a unary expression, not a subtraction', () => {
		const result = parser.parse('-1 + 2')
		expect(result.asString).toBe('-1 + 2')
		expect(result.computed).toBe(1)
		expect(result.inputRange).toEqual([0, 5])
		expect(result.outputRange).toEqual([0, 5])
	})
})

describe('GroupPlugin', () => {
	const parser = new MathParser([
		GroupPlugin,
		NumberPlugin,
		StringPlugin,
	])
	it('finds matching pairs of parentheses', () => {
		const result = parser.parse('(a)')
		expect(result.asString).toBe('(a)')
		expect(result.computed).toBe(NaN)
		expect(result.inputRange).toEqual([0, 2])
		expect(result.outputRange).toEqual([0, 2])
	})
	it('handles empty pairs', () => {
		const result = parser.parse('( )')
		expect(result.asString).toBe('()')
		expect(result.computed).toBe(NaN)
		expect(result.inputRange).toEqual([0, 2])
		expect(result.outputRange).toEqual([0, 1])
	})
	it('handles incomplete pairs', () => {
		const result = parser.parse('(1')
		expect(result.asString).toBe('(1)')
		expect(result.computed).toBe(1)
		expect(result.inputRange).toEqual([0, 1])
		expect(result.outputRange).toEqual([0, 2])
	})
	it('handles empty AND incomplete pairs', () => {
		const result = parser.parse('(')
		expect(result.asString).toBe('()')
		expect(result.computed).toBe(NaN)
		expect(result.inputRange).toEqual([0, 0])
		expect(result.outputRange).toEqual([0, 1])
	})
	it('handles arbitrary depth', () => {
		const result = parser.parse('(((1))')
		expect(result.asString).toBe('(((1)))')
		expect(result.computed).toBe(1)
		expect(result.inputRange).toEqual([0, 5])
		expect(result.outputRange).toEqual([0, 6])
	})
	it('computes correct outputRange and offsets its child\'s', () => {
		const result = parser.parse('(   (  )  )')
		expect(result.asString).toBe('(())')
		expect(result.inputRange).toEqual([0, 10])
		expect(result.outputRange).toEqual([0, 3])
		expect(result.nodes[0].inputRange).toEqual([4, 7])
		expect(result.nodes[0].outputRange).toEqual([1, 2])
	})
})

describe('plugins interactions', () => {
	it('should follow standard operation priorities', () => {
		const parser = new MathParser([
			PowBinaryOperatorPlugin,
			AndBinaryOperatorPlugin,
			OrBinaryOperatorPlugin,
			NumberPlugin,
		])
		expect(parser.parse('2 + 3 * 3').computed).toBe(11)
		expect(parser.parse('2 * 3 ^ 2').computed).toBe(18)
	})
	test('constants can be used as numbers', () => {
		const parser = new MathParser([
			ConstPlugin,
			PowBinaryOperatorPlugin,
			AndBinaryOperatorPlugin,
			ImplicitMultiplicationPlugin,
			OrBinaryOperatorPlugin,
			NumberPlugin,
			StringPlugin
		])
		expect(parser.parse('2 pi').computed).toBe(Math.PI * 2)
		expect(parser.parse('e ^ 2').computed).toBe(Math.E ** 2)
	})
	it('should revert to Partials if maths seem incomplete', () => {
		const parser = new MathParser([
			ConstPlugin,
			PowBinaryOperatorPlugin,
			AndBinaryOperatorPlugin,
			ImplicitMultiplicationPlugin,
			OrBinaryOperatorPlugin,
			NumberPlugin,
			StringPlugin,
			PartialsPlugin,
		])
		const result = parser.parse('abc 2 * 3')
		expect(result instanceof PartialsPlugin.node).toBe(true)
		expect(result.computed).toBe(6)
	})
	it('BinaryOperators correctly offset the outputRange of their children', () => {
		const parser = new MathParser([
			ConstPlugin,
			LeftUnaryOperatorPlugin,
			OrBinaryOperatorPlugin,
			NumberPlugin,
			StringPlugin,
		])
		{
			const result = parser.parse('sin2  +  pi')
			expect(result.asString).toBe('sin(2) + π')
			expect(result.outputRange).toEqual([0, 9])
			expect(result.nodes[0].outputRange).toEqual([0, 5])
			expect(result.nodes[1].outputRange).toEqual([9, 9])
		}
		{
			const result = parser.parse('pi+sin2')
			expect(result.asString).toBe('π + sin(2)')
			expect(result.outputRange).toEqual([0, 9])
			expect(result.nodes[0].outputRange).toEqual([0, 0])
			expect(result.nodes[1].outputRange).toEqual([4, 9])
		}
	})
	it('handles messy inputs', () => {
		const parser = new MathParser([
			ConstPlugin,
			GroupPlugin,
			LeftUnaryOperatorPlugin,
			RightUnaryOperatorPlugin,
			MinusUnaryOperatorPlugin,
			PowBinaryOperatorPlugin,
			AndBinaryOperatorPlugin,
			ImplicitMultiplicationPlugin,
			OrBinaryOperatorPlugin,
			NumberPlugin,
			StringPlugin,
			PartialsPlugin,
		])
		{
			const result = parser.parse(')p)2 + 3')
			expect(result.asString).toBe(') p ) 2 + 3')
			expect(result.computed).toEqual(5)
			expect(result.outputRange).toEqual([0, 10])
			expect(result.nodes[0].outputRange).toEqual([0, 0])
			expect(result.nodes[1].outputRange).toEqual([2, 2])
			expect(result.nodes[2].outputRange).toEqual([4, 4])
			expect(result.nodes[3].outputRange).toEqual([6, 10])
		}
		{
			const result = parser.parse(')p)2) + 3')
			expect(result.asString).toBe(') p ) 2 ) + 3')
			expect(result.computed).toEqual(NaN)
		}
	})
	it('handles full math formulas', () => {
		const parser = new MathParser([
			ConstPlugin,
			GroupPlugin,
			LeftUnaryOperatorPlugin,
			RightUnaryOperatorPlugin,
			MinusUnaryOperatorPlugin,
			PowBinaryOperatorPlugin,
			AndBinaryOperatorPlugin,
			ImplicitMultiplicationPlugin,
			OrBinaryOperatorPlugin,
			NumberPlugin,
			StringPlugin,
			PartialsPlugin,
		])
		const result = parser.parse('(sin(10 +pi) * pi^2 + 3! * (-1 pi tau)')
		expect(result.asString).toBe('(sin(10 + π) * π ^ 2 + 3! * (-1 × π × τ))')
		expect(result.computed).toEqual(-113.06597966275308)
	})
	it('has edge-cases to keep in the test suite', () => {
		const parser = new MathParser([
			ConstPlugin,
			GroupPlugin,
			LeftUnaryOperatorPlugin,
			RightUnaryOperatorPlugin,
			MinusUnaryOperatorPlugin,
			PowBinaryOperatorPlugin,
			AndBinaryOperatorPlugin,
			ImplicitMultiplicationPlugin,
			OrBinaryOperatorPlugin,
			NumberPlugin,
			StringPlugin,
			PartialsPlugin,
		])
		{
			const result = parser.parse('3! - sin(-1)')
			expect(result.asString).toBe('3! - sin(-1)') // 3! × -sin(-1)
		}
		{
			const result = parser.parse('√2 - π') // 'π' was not considered a Const (nor any other symbols)
			expect(result.type).toBe('operation-binary')
		}
	})
})