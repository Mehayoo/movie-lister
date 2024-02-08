import { Middleware } from 'redux'
import { Dispatch, MiddlewareAPI } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { setSyncFavoritesParams } from '../reducers/movies/slice'
import { getMoviesFulfilledType } from '../reducers/movies/actionCreators'
import moviesService from '../../service/MoviesService'
import {
	Movie,
	MoviesFetchedAction,
	RequestMoviesResponse,
} from '../../constants'

export const syncFavorites: Middleware<{}, RootState> =
	(store: MiddlewareAPI<Dispatch, RootState>) =>
	(next) =>
	async (action: any) => {
		const { type, payload } = action as MoviesFetchedAction
		const { moviesReducer } = store.getState()
		const {
			favoriteMovieIds,
			favoriteMoviesPage,
			favoriteMoviesTotalPages,
		} = moviesReducer

		const stateFavoriteMovieIdsSet: Set<number> = new Set(favoriteMovieIds)

		if (type === getMoviesFulfilledType) {
			try {
				if (
					!stateFavoriteMovieIdsSet.size ||
					favoriteMoviesPage < favoriteMoviesTotalPages
				) {
					const favoriteMoviesData: RequestMoviesResponse =
						await moviesService.getFavorites({
							page: favoriteMoviesPage + 1,
						})

					const { results, page, total_pages } = favoriteMoviesData

					const favoriteIds: number[] = results.map(
						(movie: Movie) => movie.id
					)
					const requestFavoriteIdsSet: Set<number> = new Set(
						favoriteIds
					)

					store.dispatch(
						setSyncFavoritesParams({
							favoriteMovieIds: favoriteIds,
							favoriteMoviesPage: page,
							favoriteMoviesTotalPages: total_pages,
						})
					)

					const updatedMovieResults: Movie[] = payload.results.map(
						(movie: Movie) => ({
							...movie,
							favorite:
								stateFavoriteMovieIdsSet.has(movie.id) ||
								requestFavoriteIdsSet.has(movie.id),
						})
					)

					next({
						...action,
						payload: { ...payload, results: updatedMovieResults },
					})
				} else {
					const updatedMovieResults: Movie[] = payload.results.map(
						(movie: Movie) => ({
							...movie,
							favorite: stateFavoriteMovieIdsSet.has(movie.id),
						})
					)

					next({
						...action,
						payload: { ...payload, results: updatedMovieResults },
					})
				}
			} catch (error) {
				// Treat error case
			}
		} else {
			next(action)
		}
	}
