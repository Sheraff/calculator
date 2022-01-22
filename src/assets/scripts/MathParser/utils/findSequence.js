/**
 * @template T
 * @param {number} i
 * @param {Array<T>} string
 * @param {(arg: T) => boolean} test
 * @returns {Array<T>}
 */
 export default function findSequence(i, string, test) {
	let sequence = []
	while (i < string.length && test(string[i])) {
		sequence.push(string[i])
		i++
	}
	return sequence
}