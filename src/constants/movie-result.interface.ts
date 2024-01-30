import { MovieLookup } from './movie-lookup.interface'

export interface MovieResult {
	results: MovieLookup
	page: number
	total_pages: number
	total_results: number
}
