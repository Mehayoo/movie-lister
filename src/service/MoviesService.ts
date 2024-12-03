import axios from 'axios'
import { handleError } from '../utils/handleError'
import {
	ToggleFavorites,
	GetMoviesParams,
	RequestMoviesResponse,
	TmdbResponse,
	GetCategoriesResponse,
} from '../constants'

class MoviesService {
	public async getMovies(
		params: GetMoviesParams
	): Promise<RequestMoviesResponse> {
		const { page, categoryId } = params

		try {
			const response = await axios.get<RequestMoviesResponse>(
				`${process.env.REACT_APP_TMDB_DISCOVER_MOVIE}`,
				{
					params: {
						page,
						...(categoryId && { with_genres: categoryId }),
					},
					headers: {
						Accept: 'application/json',
						Authorization: `Bearer ${process.env.REACT_APP_API_READ_ACCESS_TOKEN}`,
					},
				}
			)
			return response.data
		} catch (error) {
			return handleError({
				error,
				defaultMsg: 'Error getting list of movies',
			})
		}
	}

	public async getFavorites(
		params: GetMoviesParams
	): Promise<RequestMoviesResponse> {
		const { page } = params
		try {
			const response = await axios.get<RequestMoviesResponse>(
				`${process.env.REACT_APP_API_BASE_URL}/account/${process.env.REACT_APP_ACCOUNT_ID}/favorite/movies`,
				{
					headers: {
						Accept: 'application/json',
						Authorization: `Bearer ${process.env.REACT_APP_API_READ_ACCESS_TOKEN}`,
					},
					params: { language: 'en-US', page },
				}
			)
			return response.data
		} catch (error) {
			return handleError({
				error,
				defaultMsg: 'Error getting list of favorite movies',
			})
		}
	}

	public async toggleFavorite(
		params: ToggleFavorites
	): Promise<TmdbResponse> {
		const { movieId, sessionId, favorite } = params

		try {
			const response = await axios.post<TmdbResponse>(
				`${process.env.REACT_APP_API_BASE_URL}/account/${process.env.REACT_APP_ACCOUNT_ID}/favorite`,
				{
					media_type: 'movie',
					media_id: movieId,
					favorite,
				},
				{
					headers: {
						Accept: 'application/json',
						Authorization: `Bearer ${process.env.REACT_APP_API_READ_ACCESS_TOKEN}`,
					},
					params: { session_id: sessionId },
				}
			)

			return response.data
		} catch (error) {
			return handleError({
				error,
				defaultMsg: 'Error adding movie to favorites',
			})
		}
	}

	public async searchMovies(
		params: GetMoviesParams
	): Promise<RequestMoviesResponse> {
		const { categoryId, page, query } = params

		try {
			const response = await axios.get<RequestMoviesResponse>(
				`${process.env.REACT_APP_API_BASE_URL}/search/movie`,
				{
					params: {
						api_key: process.env.REACT_APP_API_KEY,
						page,
						query,
						...(categoryId && { with_genres: categoryId }),
					},
					headers: {
						Accept: 'application/json',
						Authorization: `Bearer ${process.env.REACT_APP_API_READ_ACCESS_TOKEN}`,
					},
				}
			)
			return response.data
		} catch (error) {
			return handleError({
				error,
				defaultMsg: 'Error getting list of movies',
			})
		}
	}

	public async getCategories(): Promise<GetCategoriesResponse> {
		try {
			const response = await axios.get<GetCategoriesResponse>(
				`${process.env.REACT_APP_API_BASE_URL}/genre/movie/list`,
				{
					headers: {
						Accept: 'application/json',
						Authorization: `Bearer ${process.env.REACT_APP_API_READ_ACCESS_TOKEN}`,
					},
					params: {
						api_key: process.env.REACT_APP_API_KEY,
						language: 'en-US',
					},
				}
			)

			return response.data
		} catch (error) {
			return handleError({
				error,
				defaultMsg: 'Error getting list of movies',
			})
		}
	}
}

const moviesService = new MoviesService()
export default moviesService
