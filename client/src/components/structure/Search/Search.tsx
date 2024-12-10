import { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { IconSearch, IconX } from '@tabler/icons-react'
import { Button } from '../..'
import { useAppDispatch } from '../../../redux/store'
import {
	setPathContext,
	setSearchQuery,
} from '../../../redux/reducers/movies/slice'
import { useMovieState } from '../../../redux/reducers/movies/selectors'
import { getContextFromPath } from '../../../utils/getContextFromPath'
import { pathContextActionMapping } from '../../../utils/pathContextActionMapping'
import { createSearchUrl } from '../../../utils/createSearchUrl'
import { SearchProps } from './types'
import { ContextSearchEnum } from '../../../constants'
import cn from '../../../utils/classNames'

import './style.scss'
const bem = cn('search')

const Search = ({ className }: SearchProps) => {
	const location = useLocation()
	const navigate = useNavigate()
	const dispatch = useAppDispatch()

	const { searchQuery, currentCategoryId, pathContext } = useMovieState()

	const [searchOpen, setSearchOpen] = useState<boolean>(false)
	const [showNotification, setShowNotification] = useState<boolean>(false)
	const [isNarrowScreen, setIsNarrowScreen] = useState<boolean>(
		window.innerWidth <= 600
	)
	const [searchTerm, setSearchTerm] = useState<string>(searchQuery)

	const classNames: string = [bem(''), className].join(' ').trim()
	const { context, dynamicValue } = useMemo(
		() => getContextFromPath(location.pathname),
		[location]
	)

	const setContext = (): void => {
		if (context !== ContextSearchEnum.SEARCH) {
			dispatch(setPathContext(dynamicValue || context))
		}
	}

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
		setContext()

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, context])

	useEffect(() => {
		setSearchTerm(searchQuery || '')
	}, [searchQuery])

	const toggleSearch = (): void => setSearchOpen(!searchOpen)

	const performSearch = (): void => {
		const searchUrl: string = createSearchUrl(searchTerm, context)
		const currentPathAction = pathContextActionMapping(context, {
			query: searchTerm,
			categoryId: currentCategoryId,
		})

		if (currentPathAction) {
			dispatch(setSearchQuery(searchTerm))
			dispatch(currentPathAction)
			navigate(searchUrl)
		} else {
			console.error('No valid action to dispatch for context:', context)
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
					{`Searching in ${dynamicValue || pathContext}`}
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
