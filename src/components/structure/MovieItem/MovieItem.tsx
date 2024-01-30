// import { useEffect, useState, useRef } from 'react'
// import { Link } from 'react-router-dom'
// import { LazyLoadImage } from 'react-lazy-load-image-component'
// import { Skeleton } from '..'
// import { MovieItemProps } from './types'
// import cn from '../../utils/classNames'

// import 'react-lazy-load-image-component/src/effects/blur.css'
// import './style.scss'
// const bem = cn('movie-item')

// const MovieItem = ({
// 	id,
// 	original_title,
// 	poster_path,
// 	vote_average,
// }: MovieItemProps) => {
// 	const imageSrc = `${process.env.REACT_APP_TMDB_IMAGES_PATH}${poster_path}`

// 	// const [imageLoaded, setImageLoaded] = useState<boolean>(false)
// 	// const loadInitiated = useRef<boolean>(false)

// 	// useEffect(() => {
// 	// 	if (loadInitiated.current) {
// 	// 		return
// 	// 	}

// 	// 	const img = new Image()
// 	// 	img.src = imageSrc
// 	// 	img.onload = () => {
// 	// 		setImageLoaded(true)
// 	// 		loadInitiated.current = true
// 	// 	}

// 	// 	img.onerror = () => {
// 	// 		// Handle image load error
// 	// 	}
// 	// }, [imageSrc])

// 	return (
// 		// <>
// 		// 	{!imageLoaded ? (
// 		// 		<Skeleton />
// 		// 	) : (
// 		<Link to={`/movies/${id}`} className={bem('')}>
// 			<div className={bem('header')}>
// 				{/* <img alt={original_title} src={imageSrc} /> */}
// 				<LazyLoadImage
// 					alt={original_title}
// 					src={imageSrc}
// 					effect="blur"
// 				/>
// 			</div>
// 			<div className={bem('details')}>
// 				<p>{original_title}</p>
// 				<p className={bem('rating')}>{vote_average}</p>
// 			</div>
// 		</Link>
// 		// 	)}
// 		// </>
// 	)
// }

// export default MovieItem

import React from 'react'
import { Link } from 'react-router-dom'
import { IconHeartPlus } from '@tabler/icons-react'
import { RootState, useAppDispatch, useAppSelector } from '../../../redux/store'
import { toggleFavorite } from '../../../redux/reducers/movies/actionCreators'
import useLazyLoad from '../../../hooks/useLazyLoad'

import { MovieItemProps } from './types'
import cn from '../../../utils/classNames'

import './style.scss'
const bem = cn('movie-item')

const MovieItem = ({
	id,
	favorite,
	original_title,
	poster_path,
	release_date,
}: MovieItemProps) => {
	const imageSrc: string = `${process.env.REACT_APP_TMDB_IMAGES_PATH}${poster_path}`
	const { loaded, ref } = useLazyLoad()

	const dispatch = useAppDispatch()
	const sessionToken: string = useAppSelector(
		(state: RootState) => state.authReducer.sessionToken
	)

	const addMovieToFavorites = (
		event: React.MouseEvent<HTMLElement>
	): void => {
		event.preventDefault()
		event.stopPropagation()

		if (!sessionToken) {
			console.log('User is not logged in')
			return
		}

		dispatch(
			toggleFavorite({
				movieId: id,
				sessionId: sessionToken,
				favorite: favorite !== undefined ? !favorite : true,
			})
		)
	}

	return (
		<Link to={`/movies/${id}`} className={bem('')}>
			<div className={bem('lazy-load-wrapper', { loaded })} ref={ref}>
				{loaded && <img alt={original_title} src={imageSrc} />}
			</div>

			<div className={bem('container')}>
				<p>{original_title}</p>
				<div className={bem('details')}>
					<p className={bem('release')}>{release_date}</p>
					<i
						className={bem('favorite', { filled: favorite })}
						onClick={addMovieToFavorites}
					>
						<IconHeartPlus
							aria-label="Add to favorites"
							size={35}
						/>
					</i>
				</div>
			</div>
		</Link>
	)
}

export default React.memo(MovieItem)
