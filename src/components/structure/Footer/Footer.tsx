import cn from '../../../utils/classNames'

import './style.scss'
const bem = cn('footer')

const Footer = () => {
	return (
		<footer className={bem('')}>
			<p>
				Designed &nbsp; by{' '}
				<a
					target="_blank"
					rel="noreferrer"
					href="https://github.com/mehayoo"
				>
					&nbsp; Sorin-Ionut Mihaiu
				</a>
			</p>
		</footer>
	)
}

export default Footer
