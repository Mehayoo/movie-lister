import { ReactElement, useEffect, useMemo } from 'react'
import { useAppDispatch } from '../../../redux/store'
import { getMovies } from '../../../redux/reducers/movies/actionCreators'
import { useAuthState } from '../../../redux/reducers/auth/selectors'
import { useMovieState } from '../../../redux/reducers/movies/selectors'
import { Grid, MovieItem, Skeleton } from '../..'
import useDetectScrolledToBottom from '../../../hooks/useDetectScrolledToBottom'
import { RequestStatus } from '../../../constants'

const MoviesPage = () => {
	const dispatch = useAppDispatch()
	const { movies, movieIds, getMoviesRequestStatus, hasFetchedMovies } =
		useMovieState()
	const { results, page, total_pages } = movies

	const { isLoggedIn } = useAuthState()

	const { isBottom } = useDetectScrolledToBottom()

	useEffect(() => {
		if (isLoggedIn && !hasFetchedMovies) {
			dispatch(getMovies({}))
		}
	}, [isLoggedIn, hasFetchedMovies, dispatch])

	useEffect(() => {
		if (
			isBottom &&
			page < total_pages &&
			getMoviesRequestStatus !== RequestStatus.LOADING &&
			getMoviesRequestStatus !== RequestStatus.ERROR
		) {
			dispatch(
				getMovies({
					page: page + 1,
				})
			)
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isBottom])

	const loadingSkeletons: JSX.Element[] = useMemo(
		() =>
			Array.from({ length: 12 }).map((_, index) => (
				<Skeleton key={index} />
			)),
		[]
	)

	const movieItems: JSX.Element[] = useMemo(() => {
		const items: ReactElement[] = []
		movieIds.forEach((movieId: number) => {
			items.push(<MovieItem key={movieId} {...results[movieId]} />)
		})
		return items
	}, [movieIds, results])

	if (
		getMoviesRequestStatus === RequestStatus.PENDING ||
		getMoviesRequestStatus === RequestStatus.LOADING
	) {
		return <Grid>{loadingSkeletons}</Grid>
	}

	if (getMoviesRequestStatus === RequestStatus.ERROR) {
		console.log('Treat error case')
	}

	return <Grid>{movieItems}</Grid>
}

export default MoviesPage
