import { ReactElement, useEffect, useMemo } from 'react'
import { useAppDispatch } from '../../../redux/store'
import { getFavorites } from '../../../redux/reducers/movies/actionCreators'
import { useAuthState } from '../../../redux/reducers/auth/selectors'
import { useMovieState } from '../../../redux/reducers/movies/selectors'
import { Button, Grid, MovieItem, Skeleton } from '../..'
import useDetectScrolledToBottom from '../../../hooks/useDetectScrolledToBottom'
import { RequestStatus } from '../../../constants'
import cn from '../../../utils/classNames'

import './style.scss'
const bem = cn('favorites-page')

const FavoritesPage = () => {
	const dispatch = useAppDispatch()
	const { favoriteMovies, favoriteMovieIds, getFavoriteMoviesStatus } =
		useMovieState()
	const { results, page, total_pages } = favoriteMovies

	const { isLoggedIn } = useAuthState()

	const { isBottom } = useDetectScrolledToBottom()

	useEffect(() => {
		if (isLoggedIn) {
			dispatch(getFavorites({}))
		}
	}, [isLoggedIn, dispatch])

	useEffect(() => {
		if (
			isBottom &&
			page < total_pages &&
			getFavoriteMoviesStatus !== RequestStatus.LOADING &&
			getFavoriteMoviesStatus !== RequestStatus.ERROR
		) {
			dispatch(getFavorites({ page: page + 1 }))
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

	const favoriteMovieItems: JSX.Element[] = useMemo(() => {
		const items: ReactElement[] = []
		favoriteMovieIds.forEach((favoriteMovieId: number) => {
			items.push(
				<MovieItem
					key={favoriteMovieId}
					{...results[favoriteMovieId]}
				/>
			)
		})
		return items
	}, [favoriteMovieIds, results])

	if (
		getFavoriteMoviesStatus === RequestStatus.PENDING ||
		getFavoriteMoviesStatus === RequestStatus.LOADING
	) {
		return <Grid>{loadingSkeletons}</Grid>
	}

	if (getFavoriteMoviesStatus === RequestStatus.ERROR) {
		console.log('Treat error case')
	}

	if (!favoriteMovieIds.length) {
		return (
			<main className={bem('no-results')}>
				<p>No favorite movies to show. Go back and add some.</p>
				<Button />
			</main>
		)
	}

	return <Grid>{favoriteMovieItems}</Grid>
}

export default FavoritesPage
