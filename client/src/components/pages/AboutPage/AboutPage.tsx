import { useState } from 'react'
import cn from '../../../utils/classNames'

import './style.scss'
const bem = cn('about-page')

const AboutPage = () => {
	const numbers = Array.from({ length: 15 }, (_, i) => i + 1)
	const itemsPerPage = 3
	const totalPages = Math.ceil(numbers.length / itemsPerPage)

	const [currentPage, setCurrentPage] = useState(1)

	const startIndex = (currentPage - 1) * itemsPerPage
	const endIndex = startIndex + itemsPerPage
	const currentItems = numbers.slice(startIndex, endIndex)

	const goToNextPage = () => {
		setCurrentPage((prevPage) =>
			prevPage < totalPages ? prevPage + 1 : prevPage
		)
	}

	const goToPrevPage = () => {
		setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage))
	}

	return (
		<main className={bem('')}>
			<p>
				This is a small demo app showcasing the use of React,
				Typescript, and Redux Toolkit, as well as TMDB api.
			</p>

			<p className={bem('copyright')}>
				@Copyright Sorin-Ionut Mihaiu, 2024.
			</p>

			<br />
			<br />
			<br />

			<div>
				<div>Current Page: {currentPage}</div>
				<div>
					{currentItems.map((item) => (
						<div key={item}>{item}</div>
					))}
				</div>
				<button onClick={goToPrevPage} disabled={currentPage === 1}>
					Prev
				</button>
				<button
					onClick={goToNextPage}
					disabled={currentPage === totalPages}
				>
					Next
				</button>
			</div>
		</main>
	)
}

export default AboutPage
