import { RootState, useAppSelector } from '../../store'
import {
	GetCategoriesResponse,
	MovieResult,
	RequestStatus,
} from '../../../constants/'

export const useMovieState = () => {
	const movies: MovieResult = useAppSelector(
		(state: RootState) => state.moviesReducer.movies
	)
	const movieIds: number[] = useAppSelector(
		(state: RootState) => state.moviesReducer.movieIds
	)
	const getMoviesRequestStatus: RequestStatus = useAppSelector(
		(state: RootState) => state.moviesReducer.getMoviesRequestStatus
	)
	const hasFetchedMovies: boolean = useAppSelector(
		(state: RootState) => state.moviesReducer.hasFetchedMovies
	)

	const favoriteMovies: MovieResult = useAppSelector(
		(state: RootState) => state.moviesReducer.favoriteMovies
	)
	const favoriteMovieIds: number[] = useAppSelector(
		(state: RootState) => state.moviesReducer.favoriteMovieIds
	)
	const getFavoriteMoviesStatus: RequestStatus = useAppSelector(
		(state: RootState) => state.moviesReducer.getFavoriteMoviesStatus
	)
	const toggleFavoriteRequestStatus: RequestStatus = useAppSelector(
		(state: RootState) => state.moviesReducer.toggleFavoriteRequestStatus
	)

	const currentCategoryId: number | undefined = useAppSelector(
		(state: RootState) => state.moviesReducer.currentCategoryId
	)
	const categories: GetCategoriesResponse = useAppSelector(
		(state: RootState) => state.moviesReducer.categories
	)
	const getCategoriesRequestStatus: RequestStatus = useAppSelector(
		(state: RootState) => state.moviesReducer.getCategoriesRequestStatus
	)

	const categoryMovies: MovieResult = useAppSelector(
		(state: RootState) => state.moviesReducer.categoryMovies
	)
	const categoryMovieIds: number[] = useAppSelector(
		(state: RootState) => state.moviesReducer.categoryMovieIds
	)

	const searchResults: MovieResult = useAppSelector(
		(state: RootState) => state.moviesReducer.searchResults
	)
	const searchResultIds: number[] = useAppSelector(
		(state: RootState) => state.moviesReducer.searchResultIds
	)
	const searchQuery: string = useAppSelector(
		(state: RootState) => state.moviesReducer.searchQuery
	)
	const getSearchResultsRequestStatus: RequestStatus = useAppSelector(
		(state: RootState) => state.moviesReducer.getSearchResultsRequestStatus
	)
	const pathContext: string = useAppSelector(
		(state: RootState) => state.moviesReducer.pathContext
	)
	const isSearching: boolean = useAppSelector(
		(state: RootState) => state.moviesReducer.isSearching
	)

	return {
		movies,
		movieIds,
		getMoviesRequestStatus,
		hasFetchedMovies,
		favoriteMovies,
		favoriteMovieIds,
		getFavoriteMoviesStatus,
		toggleFavoriteRequestStatus,
		currentCategoryId,
		categories,
		getCategoriesRequestStatus,
		categoryMovies,
		categoryMovieIds,
		searchResults,
		searchResultIds,
		searchQuery,
		getSearchResultsRequestStatus,
		pathContext,
		isSearching,
	}
}
