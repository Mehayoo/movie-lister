import { TmdbResponse } from './tmdb-response.interface'

export interface TmdbErrorResponse extends TmdbResponse {
	success: boolean
	failure: boolean
}
