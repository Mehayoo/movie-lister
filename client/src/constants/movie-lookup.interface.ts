import { Movie } from './movie.interface'

export interface MovieLookup {
	[id: string]: Movie
}
