import { NextFunction, Request, Response } from 'express'

import { CustomError, CustomErrorContent } from '../../errors/CustomError'

export const errorHandlerMiddleware = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction // Not used since the error is handled fully in this here
): Response<{ errors: CustomErrorContent[] }> => {
	if (err instanceof CustomError) {
		const { statusCode, errors, logging } = err

		if (logging) {
			console.error(
				JSON.stringify(
					{
						code: err.statusCode,
						errors,
						stack: err.stack,
					},
					null,
					2
				)
			)
		}

		return res.status(statusCode).send({ errors })
	}

	// Unhandled errors
	console.error(JSON.stringify(`DEFAULT ${err}`, null, 2))
	return res
		.status(500)
		.send({ errors: [{ message: 'Something went wrong' }] })
}
