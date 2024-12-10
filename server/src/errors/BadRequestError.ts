import { CustomError } from './CustomError'

export default class BadRequestError extends CustomError {
	// Combining private and static means that _statusCode is a class-level detail that should not be externally visible or modifiable,
	// and it's consistent across all instances and does not have separate copies for each instance (static)
	// It's also an internal detail of the BadRequestError class (private), not meant to be accessed from outside the class
	private static readonly _statusCode = 400
	private readonly _logging: boolean

	constructor(params?: { message?: string; logging?: boolean }) {
		const { message, logging } = params || {}

		super(message || 'Bad request')
		this._logging = logging || false

		// Using Object.setPrototypeOf(this, Subclass.prototype) in the constructor of subclasses that extend custom classes
		// (which themselves extend built-in classes like Error) is a way to ensure that the prototype chain is correctly established:
		// - making instanceof checks behave as expected across different JavaScript environments
		// - making sure methods defined on BadRequestError (the Subclass) will be accessible on instances of it

		// 1.	Object.setPrototypeOf(this, CustomError.prototype) ensures that BadRequestError instances behave as CustomError instances
		// 2.	Object.setPrototypeOf(this, BadRequestError.prototype) ensures that BadRequestError instances are recognized as such and can access methods specific to the subclass
		Object.setPrototypeOf(this, BadRequestError.prototype)
	}

	get statusCode() {
		return BadRequestError._statusCode
	}

	get errors() {
		return [{ message: this.message }]
	}

	get logging() {
		return this._logging
	}
}
