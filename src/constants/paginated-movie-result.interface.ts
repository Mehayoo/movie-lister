import { MovieResult } from './movie-result.interface'

export interface PaginatedMovieResult extends MovieResult {
	pages: {
		[page: string]: number[]
	}
}
