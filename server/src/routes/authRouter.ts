import { NextFunction, Request, Response, Router } from 'express'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import InternalServerError from '../errors/InternalServerError'
import BadRequestError from '../errors/BadRequestError'
import { RequestTokenResponse, SessionResponse } from '../interfaces'

const authRouter: Router = Router()

authRouter.get(
	'/request-token',
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const response = await axios.get<RequestTokenResponse>(
				`${process.env.TMDB_API_BASE_URL}/authentication/token/new`,
				{
					headers: {
						Accept: 'application/json',
						Authorization: `Bearer ${process.env.TMDB_API_READ_ACCESS_TOKEN}`,
					},
				}
			)
			const requestToken: string = response.data.request_token

			const REDIRECT_URL: string = `${process.env.BACKEND_BASE_URL}/auth/handle-redirect`

			res.json({
				approvalUrl: `${process.env.TMDB_BASE_URL}/authenticate/${requestToken}?redirect_to=${REDIRECT_URL}`,
			})
		} catch (error) {
			next(
				new InternalServerError({
					message: `Failed to generate TMDB request token; ${error}`,
					logging: true,
				})
			)
		}
	}
)

authRouter.get(
	'/handle-redirect',
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const { request_token } = req.query

		if (!request_token) {
			next(
				new BadRequestError({
					message: 'Request token is missing.',
					logging: true,
				})
			)
		}

		try {
			// Exchange the approved request token for a session ID
			const response = await axios.post<SessionResponse>(
				`${process.env.TMDB_API_BASE_URL}/authentication/session/new`,
				{ request_token },
				{
					headers: {
						Accept: 'application/json',
						Authorization: `Bearer ${process.env.TMDB_API_READ_ACCESS_TOKEN}`,
					},
				}
			)

			const sessionId: string = response.data.session_id

			// Generate a JWT token with the session ID and possibly other user information
			const jwtToken: string = jwt.sign(
				{ sessionId },
				process.env.JWT_SECRET!,
				{
					expiresIn: '1h',
				}
			)
			const refreshToken: string = jwt.sign(
				{ sessionId },
				process.env.REFRESH_TOKEN_SECRET!,
				{ expiresIn: '7d' }
			)

			// Set the JWT in an HttpOnly, Secure, SameSite cookie
			res.cookie('jwt', jwtToken, {
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
			})
			res.cookie('refreshToken', refreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
			})

			res.redirect(`${process.env.FRONTEND_BASE_URL}/movies`)
		} catch (error) {
			next(
				new InternalServerError({
					message: `Error handling TMDB redirect; ${error}`,
					logging: true,
				})
			)
		}
	}
)

export default authRouter
