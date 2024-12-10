import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { IconMenu2 } from '@tabler/icons-react'
import { Button, Categories, Menu, Search } from '../..'
import { useAppDispatch } from '../../../redux/store'
import { getCategories } from '../../../redux/reducers/movies/actionCreators'
import { useMovieState } from '../../../redux/reducers/movies/selectors'
import LogoImg1 from '../../../assets/images/logo1.png'
import cn from '../../../utils/classNames'

import './style.scss'
const bem = cn('navbar')

const Navbar = () => {
	const location = useLocation()
	const dispatch = useAppDispatch()
	const { categories } = useMovieState()

	const [menuOpen, setMenuOpen] = useState<boolean>(false)
	const [sticky, setSticky] = useState<boolean>(false)

	const handleScroll = (): void => {
		setSticky((prevSticky: boolean) => {
			const shouldStick: boolean = window.scrollY > 10
			return prevSticky !== shouldStick ? shouldStick : prevSticky
		})
	}

	useEffect(() => {
		window.addEventListener('scroll', handleScroll)

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	useEffect(() => {
		dispatch(getCategories())
	}, [dispatch])

	const toggleMenu = (): void => setMenuOpen(!menuOpen)

	const onLinkClick = (): void => window.scrollTo(0, 0)

	return (
		<nav className={bem('')}>
			<div className="container">
				<div className={bem('container', { sticky })}>
					<Link
						className={bem('logo')}
						onClick={onLinkClick}
						to="/movies"
					>
						<img alt="movie-lister-logo" src={LogoImg1} />
					</Link>
					<Search className={bem('hide-search-for-mobile')} />
					<div className={bem('links')}>
						<div className={bem('dropdown')}>
							<Link
								className={bem('link', {
									selected: location.pathname === '/movies',
								})}
								onClick={onLinkClick}
								to="/movies"
							>
								movies
							</Link>

							<Categories categories={categories} />
						</div>
						<Link
							className={bem('link', {
								selected: location.pathname === '/favorites',
							})}
							onClick={onLinkClick}
							to="/favorites"
						>
							favorites
						</Link>
						<Link
							className={bem('link', {
								selected: location.pathname === '/about',
							})}
							onClick={onLinkClick}
							to="/about"
						>
							about
						</Link>
					</div>
					<div className={bem('menu-container')}>
						<Search />

						<Button
							className={bem('hamburger-menu')}
							onClick={toggleMenu}
							headIcon={<IconMenu2 aria-label="Open menu" />}
						/>
					</div>

					<Menu
						categories={categories}
						menuOpen={menuOpen}
						toggleMenu={toggleMenu}
					/>
				</div>
			</div>
		</nav>
	)
}

export default Navbar
