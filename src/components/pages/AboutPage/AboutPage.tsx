import cn from '../../../utils/classNames'

import './style.scss'
const bem = cn('about-page')

const AboutPage = () => {
	return (
		<main className={bem('')}>
			<p>
				This is a small demo app showcasing the use of React,
				Typescript, and Redux Toolkit, as well as TMDB api.
			</p>

			<p className={bem('copyright')}>
				@Copyright Sorin-Ionut Mihaiu, 2024.
			</p>
		</main>
	)
}

export default AboutPage
