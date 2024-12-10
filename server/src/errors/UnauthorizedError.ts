import { CustomError } from './CustomError'

export class UnauthorizedError extends CustomError {
	private static readonly _statusCode = 401
	private readonly _logging: boolean

	constructor(params?: { logging: boolean; message: string }) {
		const { logging, message } = params || {}

		super(message || 'Unauthorized error')
		this._logging = logging || false

		Object.setPrototypeOf(this, UnauthorizedError.prototype)
	}

	get errors() {
		return [{ message: this.message }]
	}

	get logging() {
		return this._logging
	}

	get statusCode() {
		return UnauthorizedError._statusCode
	}
}
