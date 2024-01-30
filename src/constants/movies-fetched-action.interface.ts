import { RequestMoviesResponse } from './request-movies-response.interface'

export interface MoviesFetchedAction {
	type: string
	payload: RequestMoviesResponse
}
