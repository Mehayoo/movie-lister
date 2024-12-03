import { RequestMoviesResponse } from './request-movies-response.interface'

export interface SyncFavoritesParams extends RequestMoviesResponse {
	favoriteMovieIds: number[]
}
