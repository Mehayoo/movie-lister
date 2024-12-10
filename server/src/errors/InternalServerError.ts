import { CustomError } from './CustomError'

export default class InternalServerError extends CustomError {
	private static readonly _statusCode = 500
	private readonly _logging: boolean

	constructor(params?: { message?: string; logging?: boolean }) {
		const { message, logging } = params || {}

		super(message || 'Internal server error')
		this._logging = logging || false

		Object.setPrototypeOf(this, InternalServerError.prototype)
	}

	get errors() {
		return [{ message: this.message }]
	}

	get logging() {
		return this._logging
	}

	get statusCode() {
		return InternalServerError._statusCode
	}
}
