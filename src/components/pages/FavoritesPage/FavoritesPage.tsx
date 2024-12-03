import { useEffect, useState } from 'react'
import { Grid, MovieItem, NoResultsPage, PageNav, SkeletonGrid } from '../..'
import { useAppDispatch } from '../../../redux/store'
import { useAuthState } from '../../../redux/reducers/auth/selectors'
import { getFavorites } from '../../../redux/reducers/movies/actionCreators'
import { useMovieState } from '../../../redux/reducers/movies/selectors'
import moviesService from '../../../service/MoviesService'
import { setSyncFavoritesParams } from '../../../redux/reducers/movies/slice'
import { Movie, RequestMoviesResponse, RequestStatus } from '../../../constants'

const FavoritesPage = () => {
	const dispatch = useAppDispatch()
	const {
		favoriteMoviesPage,
		favoriteMoviesTotalPages,
		favoriteMovies,
		favoriteMovieIds,
		getFavoriteMoviesStatus,
	} = useMovieState()
	const { results, pages, total_pages } = favoriteMovies

	console.log('@@favoriteMovies: ', favoriteMovies)
	console.log('@@favoriteMoviesPage: ', favoriteMoviesPage)
	console.log('@@favoriteMoviesTotalPages: ', favoriteMoviesTotalPages)
	console.log('-------------------------------------------------------')

	const { isLoggedIn } = useAuthState()

	const [currentPage, setCurrentPage] = useState<number>(1)

	useEffect(() => {
		dispatch(getFavorites({ page: currentPage }))

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (!pages[currentPage]) {
			dispatch(getFavorites({ page: currentPage }))
		}
	}, [dispatch, currentPage, pages])

	// useEffect(() => {
	// 	if (
	// 		isLoggedIn &&
	// 		(!favoriteMovieIds.length ||
	// 			favoriteMoviesPage < favoriteMoviesTotalPages)
	// 	) {
	// 		const fetchFavoriteMovies = async (): Promise<void> => {
	// 			const favoriteMoviesData: RequestMoviesResponse =
	// 				await moviesService.getFavorites({
	// 					page: favoriteMoviesPage + 1,
	// 				})
	// 			const { results } = favoriteMoviesData
	// 			console.log('@@favoriteMoviesData: ', favoriteMoviesData)

	// 			const favoriteIds: number[] = results.map(
	// 				(movie: Movie) => movie.id
	// 			)
	// 			dispatch(
	// 				setSyncFavoritesParams({
	// 					...favoriteMoviesData,
	// 					favoriteMovieIds: favoriteIds,
	// 				})
	// 			)
	// 		}

	// 		fetchFavoriteMovies()
	// 	}

	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [dispatch])

	const changePage = (args: { page: number; increment?: number }): void => {
		const { page, increment } = args

		const newPage = page + (increment || 0)
		setCurrentPage(newPage)

		// if (!pages[page] || !pages[page].length) {
		// 	dispatch(
		// 		getFavorites({ page: increment ? page + increment : page })
		// 	)
		// } else {
		// 	setCurrentPage(increment ? page + increment : page)
		// }
	}

	const favoriteMovieItems: JSX.Element[] = pages[currentPage]?.map(
		(favoriteMovieId: number) => (
			<MovieItem key={favoriteMovieId} {...results[favoriteMovieId]} />
		)
	)

	if (!isLoggedIn) {
		console.error('FavoritesPage - Treat error case isLoggedIn')
	}

	if (getFavoriteMoviesStatus === RequestStatus.ERROR) {
		console.error('FavoritesPage - Treat error case RequestStatus.ERROR')
	}

	if (getFavoriteMoviesStatus === RequestStatus.LOADING) {
		return <SkeletonGrid />
	}

	if (
		!favoriteMovieIds.length &&
		getFavoriteMoviesStatus === RequestStatus.PENDING
	) {
		return (
			<NoResultsPage message="No favorite movies to show. Go back and add some." />
		)
	}

	return (
		<>
			<Grid>{favoriteMovieItems}</Grid>
			<PageNav
				changePage={changePage}
				currentPage={currentPage}
				totalPages={total_pages}
			/>
		</>
	)
}

export default FavoritesPage
