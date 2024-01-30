import { ReactElement, useEffect, useMemo } from 'react'
import { useAppDispatch } from '../../../redux/store'
import {
	getFavorites,
	getMovies,
} from '../../../redux/reducers/movies/actionCreators'
import { useAuthState } from '../../../redux/reducers/auth/selectors'
import { useMovieState } from '../../../redux/reducers/movies/selectors'
import useDetectScrolledToBottom from '../../../hooks/useDetectScrolledToBottom'
import { Grid, MovieItem, Skeleton } from '../..'
import { RequestStatus } from '../../../constants'

const MoviesPage = () => {
	const dispatch = useAppDispatch()
	const {
		movies,
		movieIds,
		getMoviesRequestStatus,
		hasFetchedMovies,
		favoriteMovies,
		getFavoriteMoviesStatus,
		currentCategoryId,
	} = useMovieState()
	const { results, page, total_pages } = movies
	const {
		page: favouriteMoviesPage,
		total_pages: favouriteMoviesTotalPages,
	} = favoriteMovies

	const { isLoggedIn } = useAuthState()

	const { isBottom } = useDetectScrolledToBottom()

	useEffect(() => {
		if (isLoggedIn && !hasFetchedMovies) {
			dispatch(getMovies({}))
			// dispatch(getFavorites({}))
		}
	}, [isLoggedIn, hasFetchedMovies, dispatch])

	useEffect(() => {
		if (
			isBottom &&
			page < total_pages &&
			getMoviesRequestStatus !== RequestStatus.LOADING
		) {
			dispatch(
				getMovies({
					page: page + 1,
					...((currentCategoryId || currentCategoryId !== 0) && {
						categoryId: currentCategoryId,
					}),
				})
			)
		}

		// if (
		// 	isBottom &&
		// 	favouriteMoviesPage < favouriteMoviesTotalPages &&
		// 	getFavoriteMoviesStatus !== RequestStatus.LOADING
		// ) {
		// 	dispatch(getFavorites({ page: page + 1 }))
		// }
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isBottom])

	const loadingSkeletons: JSX.Element[] = useMemo(
		() =>
			Array.from({ length: 12 }).map((_, index) => (
				<Skeleton key={index} />
			)),
		[]
	)

	const movieItems = useMemo(() => {
		const items: ReactElement[] = []
		movieIds.forEach((movieId: number) => {
			items.push(<MovieItem key={movieId} {...results[movieId]} />)
		})
		return items
	}, [movieIds, results])

	if (
		getMoviesRequestStatus === RequestStatus.PENDING ||
		getMoviesRequestStatus === RequestStatus.LOADING
		// ||
		// getFavoriteMoviesStatus === RequestStatus.PENDING ||
		// getFavoriteMoviesStatus === RequestStatus.LOADING
	) {
		return <Grid>{loadingSkeletons}</Grid>
	}

	if (getMoviesRequestStatus === RequestStatus.ERROR) {
		console.log('Treat error case')
	}

	return <Grid>{movieItems}</Grid>
}

export default MoviesPage
