import axios from 'axios'
import { handleError } from '../utils/handleError'
import {
	RequestTokenResponse,
	SessionResponse,
	TmdbErrorResponse,
} from '../constants'

class AuthService {
	// Because of Strict Mode, doLogin would get called twice, generating two different tokens.
	// On first render, the call to doLogin generated a request token and redirected the user for approval. This token was valid and awaited user approval.
	// On second render, almost immediately, due to Strict Mode, doLogin was called again, creating a second request token.
	// This new token replaced the first one in terms of the redirect URL, but the user was still in the process of approving the first token.
	// The user approved the first token, but the app, due to the second render, was now expecting the second (unapproved) token.
	// Because of this, when it tried to create a session with this unapproved token, TMDB returned a 401 unauthorized error.
	// So I introduced the requestTokenInitiated flag which prevented the second unwanted token creation and ensures that
	// even if doLogin is called multiple times, the request token generation process only happens once.
	// Thus, the token that the user approves is the same token that the application expects when creating the session.

	requestTokenInitiated = false

	private async createRequestToken(): Promise<RequestTokenResponse> {
		try {
			const response = await axios.get<RequestTokenResponse>(
				`${process.env.REACT_APP_API_BASE_URL}/authentication/token/new`,
				{
					headers: {
						Accept: 'application/json',
						Authorization: `Bearer ${process.env.REACT_APP_API_READ_ACCESS_TOKEN}`,
					},
				}
			)
			return response.data
		} catch (error) {
			return handleError<TmdbErrorResponse>({
				error,
				defaultMsg: 'Error creating request token',
				extractErrorMessage: (errorResponse) =>
					errorResponse?.status_message,
			})
		}
	}

	private redirectToTmdbForApproval(requestToken: string): void {
		const redirectUrl = `${process.env.REACT_APP_TMDB_BASE_URL}/authenticate/${requestToken}?redirect_to=${window.location.origin}/approved`
		window.location.href = redirectUrl
	}

	async createSessionId(approvedToken: string): Promise<string> {
		try {
			const response = await axios.post<SessionResponse>(
				`${process.env.REACT_APP_API_BASE_URL}/authentication/session/new`,
				{ request_token: approvedToken },
				{
					headers: {
						Accept: 'application/json',
						Authorization: `Bearer ${process.env.REACT_APP_API_READ_ACCESS_TOKEN}`,
					},
				}
			)

			return response.data.session_id
		} catch (error) {
			return handleError<TmdbErrorResponse>({
				error,
				defaultMsg: 'Error creating session ID',
				extractErrorMessage: (errorResponse) =>
					errorResponse?.status_message,
			})
		}
	}

	public async doLogin() {
		if (!this.requestTokenInitiated) {
			this.requestTokenInitiated = true

			const tokenResponse: RequestTokenResponse =
				await this.createRequestToken()
			this.redirectToTmdbForApproval(tokenResponse.request_token)
		}
	}
}

const authService = new AuthService()
export default authService
