function getExponent(number) {
	if (Number.isInteger(number)) {
		return 0
	}
	const frac = number - Math.floor(number)
	return Math.floor(Math.log(frac) / Math.log(10))
}

function getMultiplier(a, b) {
	const exponent = -1 * Math.min(getExponent(a), getExponent(b))
	return Math.pow(10, Math.max(0, exponent))
}

export function multiply(a, b) {
	if (Math.abs(a) === Infinity || Math.abs(b) === Infinity) {
		return a * b
	}
	const m = getMultiplier(a, b)
	return (a * m) * (b * m) / (m * m)
}

export function divide(a, b) {
	if (Math.abs(a) === Infinity || Math.abs(b) === Infinity) {
		return a / b
	}
	const m = getMultiplier(a, b)
	return (a * m) / (b * m)
}

export function add(a, b) {
	if (Math.abs(a) === Infinity || Math.abs(b) === Infinity) {
		return a + b
	}
	const m = getMultiplier(a, b)
	return ((a * m) + (b * m)) / m
}

export function subtract(a, b) {
	if (Math.abs(a) === Infinity || Math.abs(b) === Infinity) {
		return a - b
	}
	const m = getMultiplier(a, b)
	return ((a * m) - (b * m)) / m
}