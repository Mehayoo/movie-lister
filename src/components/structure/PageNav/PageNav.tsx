import { ReactElement, useMemo } from 'react'
import { Button } from '../..'
import { PageNavProps } from './types'
import { ButtonProps } from '../../atoms/Button/types'
import cn from '../../../utils/classNames'

import './style.scss'
const bem = cn('page-nav')

const PageNav = ({ changePage, currentPage, totalPages }: PageNavProps) => {
	const pageNumbers: number[] = Array.from(
		{ length: totalPages },
		(_, i) => i + 1
	)

	const paginationButtons: ReactElement<ButtonProps>[] = pageNumbers.map(
		(pageNumber: number) => (
			<Button
				key={pageNumber}
				className={bem('btn', {
					active: currentPage === pageNumber,
				})}
				onClick={() => changePage({ page: pageNumber })}
			>
				{pageNumber}
			</Button>
		)
	)

	const createEllipsis = (keySuffix: string): JSX.Element => (
		<div
			className={bem('elipsis')}
			key={`elipsis-${keySuffix}`}
			role="presentation"
		>
			. . .
		</div>
	)

	// const renderButtons = (): ReactElement<ButtonProps>[] => {
	// 	if (totalPages <= 4) {
	// 		return paginationButtons
	// 	}

	// 	const firstTwo: ReactElement<ButtonProps>[] = paginationButtons.slice(
	// 		0,
	// 		2
	// 	)
	// 	const lastTwo: ReactElement<ButtonProps>[] = paginationButtons.slice(
	// 		totalPages - 2,
	// 		totalPages
	// 	)
	// 	let inBetween: ReactElement<ButtonProps>[] = paginationButtons.slice(
	// 		firstTwo.length,
	// 		totalPages - lastTwo.length
	// 	)

	// 	const current: ReactElement<ButtonProps> =
	// 		paginationButtons[currentPage - 1]

	// 	if (inBetween.length > 1) {
	// 		if (
	// 			paginationButtons.indexOf(current) === 0 ||
	// 			paginationButtons.indexOf(current) === 1 ||
	// 			paginationButtons.indexOf(current) === totalPages - 2 ||
	// 			paginationButtons.indexOf(current) === totalPages - 1
	// 		) {
	// 			inBetween = [
	// 				<div
	// 					className={bem('elipsis')}
	// 					key="elipsis"
	// 					role="presentation"
	// 				>
	// 					. . .
	// 				</div>,
	// 			]
	// 		}

	// 		if (paginationButtons.indexOf(current) === 2) {
	// 			inBetween = [
	// 				current,
	// 				<div
	// 					className={bem('elipsis')}
	// 					key="elipsis"
	// 					role="presentation"
	// 				>
	// 					. . .
	// 				</div>,
	// 			]
	// 		}

	// 		if (
	// 			paginationButtons.indexOf(current) >= 3 &&
	// 			paginationButtons.indexOf(current) <= totalPages - 4
	// 		) {
	// 			inBetween = [
	// 				<div
	// 					className={bem('elipsis')}
	// 					key="elipsis-1"
	// 					role="presentation"
	// 				>
	// 					. . .
	// 				</div>,
	// 				current,
	// 				<div
	// 					className={bem('elipsis')}
	// 					key="elipsis-2"
	// 					role="presentation"
	// 				>
	// 					. . .
	// 				</div>,
	// 			]
	// 		}
	// 		if (paginationButtons.indexOf(current) === totalPages - 3) {
	// 			inBetween = [
	// 				<div
	// 					className={bem('elipsis')}
	// 					key="elipsis"
	// 					role="presentation"
	// 				>
	// 					. . .
	// 				</div>,
	// 				current,
	// 			]
	// 		}
	// 	}

	// 	return [...firstTwo, ...inBetween, ...lastTwo]
	// }

	const renderButtons = (): JSX.Element[] => {
		if (totalPages <= 4) {
			return paginationButtons
		}

		const buttons: JSX.Element[] = [...paginationButtons.slice(0, 2)]

		if (currentPage > 3) {
			buttons.push(createEllipsis('start'))
		}

		const rangeStart: number = Math.max(3, currentPage)
		const rangeEnd: number = Math.min(totalPages - 2, currentPage)

		for (let i = rangeStart; i <= rangeEnd; i++) {
			buttons.push(paginationButtons[i - 1])
		}

		if (currentPage < totalPages - 2) {
			buttons.push(createEllipsis('end'))
		}

		buttons.push(...paginationButtons.slice(-2))

		return buttons
	}

	return (
		<nav className={bem('')}>
			<Button
				className={bem('btn')}
				disabled={currentPage === 1}
				label="prev"
				onClick={() => changePage({ page: currentPage, increment: -1 })}
			/>

			{renderButtons()}

			<Button
				className={bem('btn')}
				disabled={currentPage === totalPages}
				label="next"
				onClick={() => changePage({ page: currentPage, increment: 1 })}
			/>
		</nav>
	)
}

export default PageNav
