import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconSearch, IconX } from '@tabler/icons-react'
import { Button } from '../..'
import { useAppDispatch } from '../../../redux/store'
import { setSearchQuery } from '../../../redux/reducers/movies/slice'
import { useMovieState } from '../../../redux/reducers/movies/selectors'
import { pathContextActionMapping } from '../../../utils/pathContextActionMapping'
import { createSearchUrl } from '../../../utils/createSearchUrl'
import { SearchProps } from './types'
import cn from '../../../utils/classNames'

import './style.scss'
import { useSearchContext } from '../../../hooks/useSearchContext'
const bem = cn('search')

const Search = ({ className }: SearchProps) => {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const { context, configureSearchContext } = useSearchContext()

	const { searchQuery, currentCategoryId, pathContext } = useMovieState()

	const [searchOpen, setSearchOpen] = useState<boolean>(false)
	const [showNotification, setShowNotification] = useState<boolean>(false)
	const [isNarrowScreen, setIsNarrowScreen] = useState<boolean>(
		window.innerWidth <= 600
	)
	const [searchTerm, setSearchTerm] = useState<string>(searchQuery)

	const classNames: string = [bem(''), className].join(' ').trim()

	useEffect(() => {
		const handleResize = (): void => {
			setIsNarrowScreen(window.innerWidth <= 600)
		}

		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	useEffect(() => {
		configureSearchContext()

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, context])

	// Synchronizing searchTerm with the global searchQuery state
	useEffect(() => {
		setSearchTerm(searchQuery || '')
	}, [searchQuery])

	const toggleSearch = (): void => setSearchOpen(!searchOpen)

	const performSearch = (): void => {
		const searchUrl: string = createSearchUrl(searchTerm, context)

		const currentPathAction = pathContextActionMapping(
			pathContext.context,
			{
				query: searchTerm,
				categoryId: currentCategoryId,
			}
		)

		if (currentPathAction) {
			dispatch(setSearchQuery(searchTerm))
			dispatch(currentPathAction)
			navigate(searchUrl)
		} else {
			console.error(
				'No valid action to dispatch for context:',
				pathContext.context
			)
		}
	}

	const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		showNotification && setShowNotification(false)
		setSearchTerm(e.target.value)
	}

	const onSearchSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault()
		performSearch()
	}

	const onSearchClick = (): void => {
		isNarrowScreen && !searchOpen && setSearchOpen(true)

		searchTerm && performSearch()
	}

	return (
		<div className={classNames}>
			<form
				className={bem('form', { open: searchOpen })}
				onSubmit={onSearchSubmit}
			>
				{isNarrowScreen && (
					<Button
						className={bem('close-search-btn')}
						onClick={toggleSearch}
						headIcon={<IconX aria-label="Close search" size={18} />}
					/>
				)}
				<input
					className={bem('input')}
					placeholder="Search..."
					onBlur={() => setShowNotification(false)}
					onChange={onSearchChange}
					onFocus={() => setShowNotification(true)}
					type="text"
					value={searchTerm}
				/>
			</form>

			{showNotification && (
				<div className={bem('toast')}>
					{`Searching in ${
						pathContext.dynamicValue || pathContext.context
					}`}
				</div>
			)}

			<Button
				className={bem('search-btn')}
				headIcon={<IconSearch aria-label="Open and start search" />}
				onClick={onSearchClick}
			/>
		</div>
	)
}

export default Search
