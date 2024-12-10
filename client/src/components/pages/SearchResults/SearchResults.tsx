import { ReactElement, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { Grid, MovieItem, NoResultsPage, Skeleton } from '../..'
import { useAppDispatch } from '../../../redux/store'
import { useAuthState } from '../../../redux/reducers/auth/selectors'
import { searchMovies } from '../../../redux/reducers/movies/actionCreators'
import { resetSearch } from '../../../redux/reducers/movies/slice'
import { useMovieState } from '../../../redux/reducers/movies/selectors'
import useDetectScrolledToBottom from '../../../hooks/useDetectScrolledToBottom'
import { RequestStatus } from '../../../constants'
import cn from '../../../utils/classNames'

import './style.scss'
const bem = cn('search-results-page')

const SearchResults = () => {
	const location = useLocation()

	const dispatch = useAppDispatch()
	const {
		searchResults,
		searchResultIds,
		searchQuery,
		getSearchResultsRequestStatus,
		isSearching,
		currentCategoryId,
	} = useMovieState()
	const { results, page, total_pages, total_results } = searchResults

	const { isLoggedIn } = useAuthState()

	const { isBottom } = useDetectScrolledToBottom()

	useEffect(() => {
		return () => {
			dispatch(resetSearch())
		}
	}, [location, dispatch])

	useEffect(() => {
		if (
			isBottom &&
			page < total_pages &&
			getSearchResultsRequestStatus !== RequestStatus.LOADING &&
			getSearchResultsRequestStatus !== RequestStatus.ERROR
		) {
			dispatch(
				searchMovies({
					query: searchQuery,
					page: page + 1,
					...(currentCategoryId && {
						categoryId: currentCategoryId,
					}),
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
		searchResultIds.forEach((movieId: number) => {
			items.push(<MovieItem key={movieId} {...results[movieId]} />)
		})
		return items
	}, [searchResultIds, results])

	if (
		getSearchResultsRequestStatus === RequestStatus.PENDING ||
		getSearchResultsRequestStatus === RequestStatus.LOADING
	) {
		return <Grid>{loadingSkeletons}</Grid>
	}

	if (getSearchResultsRequestStatus === RequestStatus.ERROR) {
		console.error('Treat error case')
	}

	if (!searchResultIds.length) {
		return (
			<NoResultsPage
				message={`No results to show for "${searchQuery}".`}
			/>
		)
	}

	return (
		<div className={bem('')}>
			<span className={bem('total-results')}>
				Search results for "{searchQuery}": {total_results} results
			</span>

			<Grid>{movieItems}</Grid>
		</div>
	)
}

export default SearchResults
