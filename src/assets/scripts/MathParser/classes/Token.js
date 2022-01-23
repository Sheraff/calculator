/**
 * @typedef {Object} TokenConstructor
 * @prop {string} value
 * @prop {[number, number]} inputRange
 */

export default class Token {

	/** @param {TokenConstructor} props */
	constructor({
		value = '',
		inputRange,
	}) {
		this.value = value
		this.inputRange = inputRange
	}
}