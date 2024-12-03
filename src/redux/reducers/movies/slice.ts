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
	ContextEnum,
	GetCategoriesResponse,
	GetMoviesParams,
	Movie,
	MovieLookup,
	MovieResult,
	PaginatedMovieResult,
	PathContext,
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
	favoriteMovies: PaginatedMovieResult
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
	pathContext: PathContext
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
		pages: {},
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
	pathContext: {
		context: ContextEnum.ALL,
		dynamicValue: undefined,
	},
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
				results,
				page,
				total_pages,
				total_results,
				favoriteMovieIds,
			} = action.payload

			console.log('@@page: ', page)
			state.favoriteMoviesPage = page
			state.favoriteMoviesTotalPages = total_pages

			state.favoriteMovies.pages[page] = favoriteMovieIds || []
			results.forEach((movie: Movie) => {
				state.favoriteMovies.results[movie.id] = movie
				state.favoriteMovies.results[movie.id].favorite = true
			})
			state.favoriteMovies.total_pages = total_pages
			state.favoriteMovies.total_results = total_results

			const favoriteMovieIdsSet: Set<number> = new Set([
				...state.favoriteMovieIds,
				...favoriteMovieIds,
			])
			state.favoriteMovieIds = Array.from(favoriteMovieIdsSet)
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
		resetSearchState: (state: Draft<MoviesState>): void => {
			state.searchResults = {
				results: {},
				page: 1,
				total_pages: 0,
				total_results: 0,
			}
			state.searchResultIds = []
			state.getSearchResultsRequestStatus = RequestStatus.PENDING
			state.isSearching = false
		},
		setPathContext: (
			state: Draft<MoviesState>,
			action: PayloadAction<PathContext>
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
					state.getFavoriteMoviesStatus = RequestStatus.LOADING
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

					const favoriteMovieIdsPageSet: Set<number> = new Set(
						state.favoriteMovies.pages[page]
					)
					const favoriteMovieIdsSet: Set<number> = new Set(
						state.favoriteMovieIds
					)
					results.forEach((movie: Movie) => {
						favoriteMovieIdsSet.add(movie.id)
						state.favoriteMovies.results[movie.id] = movie
						state.favoriteMovies.results[movie.id].favorite = true
						state.favoriteMovies.results[movie.id].page = page
						favoriteMovieIdsPageSet.add(movie.id)
					})
					state.favoriteMovies.pages[page] = Array.from(
						favoriteMovieIdsPageSet
					)

					state.favoriteMovieIds = Array.from(favoriteMovieIdsSet)

					state.favoriteMovies.page = page
					state.favoriteMovies.total_pages = total_pages
					state.favoriteMovies.total_results = total_results
				}
			)

			.addCase(
				toggleFavorite.pending,
				(state: Draft<MoviesState>): void => {
					state.toggleFavoriteRequestStatus = RequestStatus.LOADING
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

					const favoriteMovieIdsSet = new Set(state.favoriteMovieIds)

					if (favorite) {
						favoriteMovieIdsSet.add(movieId)
						if (!state.favoriteMovies.results[movieId]) {
							state.favoriteMovies.results[movieId] =
								state.movies.results[movieId]

							// const lastPageOfFavoriteMovies: number =
							// 	Object.keys(state.favoriteMovies.pages).length -
							// 	1
							// state.favoriteMovies.pages[
							// 	lastPageOfFavoriteMovies
							// ].push(movieId)
						}
					} else {
						favoriteMovieIdsSet.delete(movieId)

						const pageOfFavoriteMovie: number | undefined =
							state.favoriteMovies.results[movieId].page
						if (pageOfFavoriteMovie) {
							state.favoriteMovies.pages[pageOfFavoriteMovie] =
								state.favoriteMovies.pages[
									pageOfFavoriteMovie
								].filter((id: number) => id !== movieId)
						}

						delete state.favoriteMovies.results[movieId]
					}

					state.favoriteMovieIds = Array.from(favoriteMovieIdsSet)

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
				}
			)

			.addCase(
				getCategories.pending,
				(state: Draft<MoviesState>): void => {
					state.getCategoriesRequestStatus = RequestStatus.LOADING
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
					state.getSearchResultsRequestStatus = RequestStatus.LOADING
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
	resetSearchState,
	setPathContext,
} = slice.actions
export default slice.reducer
