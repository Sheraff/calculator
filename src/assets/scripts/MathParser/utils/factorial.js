export default function factorial(n) {
	if (n === Infinity) {
		return Infinity
	}
	if (n < 0) {
		return NaN
	}
	return n < 2
		? 1 
		: factorial(n - 1) * n
}