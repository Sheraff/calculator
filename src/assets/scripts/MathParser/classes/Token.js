export default class Token {
	constructor({
		value = '', 
		inputRange = [],
	}) {
		this.value = value
		this.inputRange = inputRange
	}
}