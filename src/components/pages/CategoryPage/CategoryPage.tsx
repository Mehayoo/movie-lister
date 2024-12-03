import { ReactElement, useEffect, useMemo } from 'react'
import { Grid, MovieItem, SkeletonGrid } from '../..'
import { useAppDispatch } from '../../../redux/store'
import { getMovies } from '../../../redux/reducers/movies/actionCreators'
import { useMovieState } from '../../../redux/reducers/movies/selectors'
import useDetectScrolledToBottom from '../../../hooks/useDetectScrolledToBottom'
import { RequestStatus } from '../../../constants'

const CategoryPage = () => {
	const dispatch = useAppDispatch()
	const {
		categoryMovies,
		categoryMovieIds,
		getMoviesRequestStatus,
		currentCategoryId,
	} = useMovieState()
	const { results, page, total_pages } = categoryMovies

	const { isBottom } = useDetectScrolledToBottom()

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
					...((currentCategoryId || currentCategoryId !== 0) && {
						categoryId: currentCategoryId,
					}),
				})
			)
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isBottom])

	const movieItems: JSX.Element[] = useMemo(() => {
		const items: ReactElement[] = []
		categoryMovieIds.forEach((movieId: number) => {
			items.push(<MovieItem key={movieId} {...results[movieId]} />)
		})
		return items
	}, [categoryMovieIds, results])

	if (
		getMoviesRequestStatus === RequestStatus.PENDING ||
		getMoviesRequestStatus === RequestStatus.LOADING
	) {
		return <SkeletonGrid />
	}

	if (getMoviesRequestStatus === RequestStatus.ERROR) {
		console.error('Treat error case')
	}

	return <Grid>{movieItems}</Grid>
}

export default CategoryPage
