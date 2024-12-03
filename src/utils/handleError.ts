import axios, { AxiosError } from 'axios'

export const handleError = <T>(params: {
	error: unknown
	defaultMsg: string
	extractErrorMessage?: (errorResponse: T | undefined) => string | undefined
}): never => {
	const { error, defaultMsg, extractErrorMessage } = params

	if (axios.isAxiosError<T>(error)) {
		const axiosError = error as AxiosError<T>

		const message: string | undefined = extractErrorMessage
			? extractErrorMessage(axiosError.response?.data)
			: axiosError.response?.statusText

		throw new Error(message ?? defaultMsg)
	} else {
		throw new Error('An unexpected error occurred')
	}
}
