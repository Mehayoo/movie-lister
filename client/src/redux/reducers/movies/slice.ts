import {
	ActionReducerMapBuilder,
	createSlice,
	Draft,
	PayloadAction,
} from '@reduxjs/toolkit'
import {
	getCategories,
	getFavorites,
	getMovies,
	toggleFavorite,
	searchMovies,
} from './actionCreators'
import {
	ContextSearchEnum,
	GetCategoriesResponse,
	GetMoviesParams,
	Movie,
	MovieLookup,
	MovieResult,
	RequestMoviesResponse,
	RequestStatus,
	SyncFavoritesParams,
	TmdbResponse,
	ToggleFavorites,
} from '../../../constants'

export interface MoviesState {
	movies: MovieResult
	movieIds: number[]
	getMoviesRequestStatus: RequestStatus
	hasFetchedMovies: boolean

	favoriteMoviesPage: number
	favoriteMoviesTotalPages: number
	favoriteMovies: MovieResult
	favoriteMovieIds: number[]
	getFavoriteMoviesStatus: RequestStatus
	toggleFavoriteRequestStatus: RequestStatus

	currentCategoryId: number | undefined
	categories: GetCategoriesResponse
	getCategoriesRequestStatus: RequestStatus

	categoryMovies: MovieResult
	categoryMovieIds: number[]

	searchResults: MovieResult
	searchResultIds: number[]
	searchQuery: string
	getSearchResultsRequestStatus: RequestStatus
	pathContext: ContextSearchEnum | string
	isSearching: boolean
}

const initialState: MoviesState = {
	movies: {
		results: {} as MovieLookup,
		page: 1,
		total_pages: 0,
		total_results: 0,
	},
	movieIds: [],
	getMoviesRequestStatus: RequestStatus.PENDING,
	hasFetchedMovies: false, // Added because I want to always maintain state for the MoviesPage where I'm fetching all movies
	// and not reset it eveytime I navigate away and back. I only want this in here, not the other pages of FavoritesPage and CategoryPage

	favoriteMoviesPage: 0,
	favoriteMoviesTotalPages: 0,
	favoriteMovies: {
		results: {} as MovieLookup,
		page: 1,
		total_pages: 0,
		total_results: 0,
	},
	favoriteMovieIds: [],
	getFavoriteMoviesStatus: RequestStatus.PENDING,
	toggleFavoriteRequestStatus: RequestStatus.PENDING,

	currentCategoryId: undefined,
	categories: {} as GetCategoriesResponse,
	getCategoriesRequestStatus: RequestStatus.PENDING,

	categoryMovies: {
		results: {} as MovieLookup,
		page: 1,
		total_pages: 0,
		total_results: 0,
	},
	categoryMovieIds: [],

	searchResults: {
		results: {} as MovieLookup,
		page: 1,
		total_pages: 0,
		total_results: 0,
	},
	searchResultIds: [],
	searchQuery: '',
	getSearchResultsRequestStatus: RequestStatus.PENDING,
	pathContext: ContextSearchEnum.ALL,
	isSearching: false,
}

const slice = createSlice({
	name: 'movies',
	initialState,
	reducers: {
		setSyncFavoritesParams: (
			state: Draft<MoviesState>,
			action: PayloadAction<SyncFavoritesParams>
		): void => {
			const {
				favoriteMovieIds,
				favoriteMoviesPage,
				favoriteMoviesTotalPages,
			} = action.payload

			const favoriteMovieIdsSet: Set<number> = new Set([
				...state.favoriteMovieIds,
				...favoriteMovieIds,
			])
			state.favoriteMovieIds = Array.from(favoriteMovieIdsSet)
			state.favoriteMoviesPage = favoriteMoviesPage
			state.favoriteMoviesTotalPages = favoriteMoviesTotalPages
		},
		setCurrentCategoryId: (
			state: Draft<MoviesState>,
			action: PayloadAction<number | undefined>
		): void => {
			state.currentCategoryId = action.payload
		},
		setSearchQuery: (
			state: Draft<MoviesState>,
			action: PayloadAction<string>
		): void => {
			state.searchQuery = action.payload
		},
		resetSearch: (state: Draft<MoviesState>): void => {
			state.searchResults = {
				results: {},
				page: 1,
				total_pages: 0,
				total_results: 0,
			}
			state.searchResultIds = []
			state.searchQuery = ''
			state.getSearchResultsRequestStatus = RequestStatus.PENDING
			state.isSearching = false
		},
		setPathContext: (
			state: Draft<MoviesState>,
			action: PayloadAction<ContextSearchEnum | string>
		): void => {
			state.pathContext = action.payload
		},
	},
	extraReducers: (builder: ActionReducerMapBuilder<MoviesState>): void => {
		builder
			.addCase(getMovies.pending, (state: Draft<MoviesState>): void => {
				state.getMoviesRequestStatus = RequestStatus.LOADING
			})
			.addCase(getMovies.rejected, (state: Draft<MoviesState>): void => {
				state.getMoviesRequestStatus = RequestStatus.ERROR
			})
			.addCase(
				getMovies.fulfilled,
				(
					state: Draft<MoviesState>,
					action: PayloadAction<
						RequestMoviesResponse,
						string,
						{ arg: GetMoviesParams }
					>
				): void => {
					const { page, results, total_pages, total_results } =
						action.payload
					const { categoryId } = action.meta.arg

					state.getMoviesRequestStatus = RequestStatus.SUCCESS

					if (categoryId) {
						if (page === 1) {
							state.categoryMovieIds = []
							state.categoryMovies.results = {}
						}

						// Had to convert categoryMovieIds to set because for certain categories, movies from the next page would include
						// some movies from the previous page and I got duplicated results
						const categoryMovieIdsSet: Set<number> = new Set(
							state.categoryMovieIds
						)
						results.forEach((movie: Movie) => {
							categoryMovieIdsSet.add(movie.id)
							state.categoryMovies.results[movie.id] = movie
						})

						state.categoryMovieIds = Array.from(categoryMovieIdsSet)

						state.currentCategoryId = categoryId
						state.categoryMovies.page = page
						state.categoryMovies.total_pages = total_pages
						state.categoryMovies.total_results = total_results
					} else {
						results.forEach((movie: Movie) => {
							state.movieIds.push(movie.id)
							state.movies.results[movie.id] = movie
						})

						state.movies.page = page
						state.movies.total_pages = total_pages
						state.movies.total_results = total_results
						state.hasFetchedMovies = true
					}
				}
			)

			.addCase(
				getFavorites.pending,
				(state: Draft<MoviesState>): void => {
					state.getFavoriteMoviesStatus = RequestStatus.PENDING
				}
			)
			.addCase(
				getFavorites.rejected,
				(state: Draft<MoviesState>): void => {
					state.getFavoriteMoviesStatus = RequestStatus.ERROR
				}
			)
			.addCase(
				getFavorites.fulfilled,
				(
					state: Draft<MoviesState>,
					action: PayloadAction<RequestMoviesResponse>
				): void => {
					const { page, results, total_pages, total_results } =
						action.payload

					state.getFavoriteMoviesStatus = RequestStatus.SUCCESS

					const favoriteMovieIdsSet: Set<number> = new Set(
						state.favoriteMovieIds
					)
					results.forEach((movie: Movie) => {
						favoriteMovieIdsSet.add(movie.id)
						state.favoriteMovies.results[movie.id] = movie
						state.favoriteMovies.results[movie.id].favorite = true
					})
					state.favoriteMovieIds = Array.from(favoriteMovieIdsSet)

					state.favoriteMovies.page = page
					state.favoriteMovies.total_pages = total_pages
					state.favoriteMovies.total_results = total_results
				}
			)

			.addCase(
				toggleFavorite.pending,
				(state: Draft<MoviesState>): void => {
					state.toggleFavoriteRequestStatus = RequestStatus.PENDING
				}
			)
			.addCase(
				toggleFavorite.rejected,
				(state: Draft<MoviesState>): void => {
					state.toggleFavoriteRequestStatus = RequestStatus.ERROR
				}
			)
			.addCase(
				toggleFavorite.fulfilled,
				(
					state: Draft<MoviesState>,
					action: PayloadAction<
						TmdbResponse,
						string,
						{ arg: ToggleFavorites }
					>
				): void => {
					state.toggleFavoriteRequestStatus = RequestStatus.SUCCESS
					const { movieId, favorite } = action.meta.arg

					if (state.movies.results[movieId]) {
						state.movies.results[movieId].favorite = favorite
					}

					if (state.favoriteMovies.results[movieId]) {
						state.favoriteMovies.results[movieId].favorite =
							favorite
					}

					if (state.categoryMovies.results[movieId]) {
						state.categoryMovies.results[movieId].favorite =
							favorite
					}

					const favoriteMovieIdsSet = new Set(state.favoriteMovieIds)

					if (favorite) {
						favoriteMovieIdsSet.add(movieId)
						if (!state.favoriteMovies.results[movieId]) {
							state.favoriteMovies.results[movieId] =
								state.movies.results[movieId]
						}
					} else {
						favoriteMovieIdsSet.delete(movieId)
						delete state.favoriteMovies.results[movieId]
					}

					state.favoriteMovieIds = Array.from(favoriteMovieIdsSet)
				}
			)

			.addCase(
				getCategories.pending,
				(state: Draft<MoviesState>): void => {
					state.getCategoriesRequestStatus = RequestStatus.PENDING
				}
			)
			.addCase(
				getCategories.rejected,
				(state: Draft<MoviesState>): void => {
					state.getCategoriesRequestStatus = RequestStatus.ERROR
				}
			)
			.addCase(
				getCategories.fulfilled,
				(
					state: Draft<MoviesState>,
					action: PayloadAction<GetCategoriesResponse>
				): void => {
					state.getCategoriesRequestStatus = RequestStatus.SUCCESS
					state.categories = action.payload
				}
			)

			.addCase(
				searchMovies.pending,
				(state: Draft<MoviesState>): void => {
					state.getSearchResultsRequestStatus = RequestStatus.PENDING
				}
			)
			.addCase(
				searchMovies.rejected,
				(state: Draft<MoviesState>): void => {
					state.getSearchResultsRequestStatus = RequestStatus.ERROR
				}
			)
			.addCase(
				searchMovies.fulfilled,
				(
					state: Draft<MoviesState>,
					action: PayloadAction<
						RequestMoviesResponse,
						string,
						{ arg: GetMoviesParams }
					>
				): void => {
					const { page, results, total_pages, total_results } =
						action.payload

					state.getSearchResultsRequestStatus = RequestStatus.SUCCESS

					results.forEach((movie: Movie) => {
						state.searchResultIds.push(movie.id)
						state.searchResults.results[movie.id] = movie
					})

					state.searchResults.page = page
					state.searchResults.total_pages = total_pages
					state.searchResults.total_results = total_results
				}
			)
	},
})

export const {
	setSyncFavoritesParams,
	setCurrentCategoryId,
	setSearchQuery,
	resetSearch,
	setPathContext,
} = slice.actions
export default slice.reducer
