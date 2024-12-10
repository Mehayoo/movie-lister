import { useNavigate } from 'react-router-dom'
import { IconArrowLeft } from '@tabler/icons-react'
import { Button } from '../..'
import { NoResultsPageProps } from './types'
import cn from '../../../utils/classNames'

import './style.scss'
const bem = cn('no-results-page')

const NoResultsPage = ({ message }: NoResultsPageProps) => {
	const navigate = useNavigate()

	const onBackButtonClick = (): void => {
		navigate('/movies')
	}

	return (
		<main className={bem('')}>
			<p>{message}</p>
			<Button
				className={bem('back-btn')}
				headIcon={<IconArrowLeft aria-label="Back to homepage" />}
				label="back"
				onClick={onBackButtonClick}
			/>
		</main>
	)
}

export default NoResultsPage
