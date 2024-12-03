import { RequestMoviesResponse } from './request-movies-response.interface'

export interface MoviesFetchedAction {
	payload: RequestMoviesResponse
	type: string
}
