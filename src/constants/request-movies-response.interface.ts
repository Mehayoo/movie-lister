import { Movie } from './movie.interface'

export interface RequestMoviesResponse {
	results: Movie[]
	page: number
	total_pages: number
	total_results: number
}
