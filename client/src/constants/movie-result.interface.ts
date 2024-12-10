import { MovieLookup } from './movie-lookup.interface'

export interface MovieResult {
	page: number
	results: MovieLookup
	total_pages: number
	total_results: number
}
