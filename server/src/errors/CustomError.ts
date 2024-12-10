export type CustomErrorContent = {
	message: string
}

export abstract class CustomError extends Error {
	abstract readonly statusCode: number
	abstract readonly errors: CustomErrorContent[]
	abstract readonly logging: boolean

	constructor(message: string) {
		super(message)

		// Because the prototype chain may not be set up as expected when extending built-in objects like Error and we must ensure that
		Object.setPrototypeOf(this, CustomError.prototype)
	}
}

// Object.setPrototypeOf(this, CustomError.prototype)
// 1.	This Issue Only Happens with Built-In Classes
// -	Classes extending built-in classes (like Error, Array, etc.) need special handling because JavaScript doesn’t reliably set
// the prototype chain correctly.

// 2.	Prototype Fix for instanceof Checks
// -	To ensure instanceof checks work for both the class itself (e.g., BadRequestError) and its parent class (CustomError),
// we explicitly set the prototype using Object.setPrototypeOf.

// 3.	Prototype Fix for Method Access
// -	Without fixing the prototype chain, only the methods defined on the immediate class (BadRequestError) are accessible.
// Methods from the parent class (CustomError) become inaccessible.

// 4.	Future Proofing for Subclasses
// -	Fixing the prototype chain ensures that any further subclasses (e.g., AnotherError extending BadRequestError) inherit these
// benefits, including correct instanceof checks and access to both parent and grandparent methods.
