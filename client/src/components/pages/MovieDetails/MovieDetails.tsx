import { Link } from 'react-router-dom'
import { MovieDetailsProps } from './types'
import cn from '../../../utils/classNames'

import './style.scss'
const bem = cn('movie-details')

const MovieDetails = ({}: MovieDetailsProps) => {
	return (
		<div className={bem('')}>
			Lorem, ipsum dolor sit amet consectetur adipisicing elit. Autem
			magni iste possimus distinctio dolore numquam laudantium veniam
			placeat incidunt dolorum voluptates molestiae ullam, earum
			recusandae atque harum iusto molestias minima!
		</div>
	)
}

export default MovieDetails
