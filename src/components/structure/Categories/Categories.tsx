import { Link, useLocation } from 'react-router-dom'
import { useAppDispatch } from '../../../redux/store'
import { getMovies } from '../../../redux/reducers/movies/actionCreators'
import { setCurrentCategoryId } from '../../../redux/reducers/movies/slice'
import { useMovieState } from '../../../redux/reducers/movies/selectors'
import { CategoriesProps } from './types'
import { RequestStatus } from '../../../constants'
import cn from '../../../utils/classNames'

import './style.scss'
const bem = cn('categories')

const Categories = ({ categories, className, toggleMenu }: CategoriesProps) => {
	const classNames: string = [bem(''), className].join(' ').trim()
	const location = useLocation()

	const dispatch = useAppDispatch()
	const { getCategoriesRequestStatus } = useMovieState()

	const onAllClick = (): void => {
		toggleMenu && toggleMenu()
		window.scrollTo(0, 0)
		dispatch(setCurrentCategoryId(undefined))
	}

	const onCategoryClick = (id: number): void => {
		toggleMenu && toggleMenu()
		window.scrollTo(0, 0)
		dispatch(getMovies({ categoryId: id }))
	}

	return (
		<div className={classNames}>
			<Link
				className={bem('link', {
					selected: location.pathname === `/movies`,
				})}
				onClick={onAllClick}
				to="/movies"
			>
				all
			</Link>
			{getCategoriesRequestStatus === RequestStatus.SUCCESS &&
				categories.genres.map((category) => (
					<Link
						className={bem('link', {
							selected:
								location.pathname ===
								`/category/${category.name}`,
						})}
						key={category.id}
						onClick={() => onCategoryClick(category.id)}
						to={`/category/${category.name}`}
					>
						{category.name}
					</Link>
				))}
		</div>
	)
}

export default Categories
