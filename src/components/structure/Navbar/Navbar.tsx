import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { IconMenu2, IconSearch } from '@tabler/icons-react'
import { useAppDispatch } from '../../../redux/store'
import { getCategories } from '../../../redux/reducers/movies/actionCreators'
import { useMovieState } from '../../../redux/reducers/movies/selectors'
import { Categories, Menu, Search } from '../../'
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
	const [searchOpen, setSearchOpen] = useState<boolean>(false)

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

	const toggleSearch = (): void => setSearchOpen(!searchOpen)

	const onLinkClick = (): void => window.scrollTo(0, 0)

	return (
		<nav className={bem('')}>
			<div className="container">
				<div className={bem('container', { sticky })}>
					<Link onClick={onLinkClick} to="/movies">
						<img
							alt="movie-lister-logo"
							className={bem('logo')}
							src={LogoImg1}
						/>
					</Link>
					<Search searchOpen={searchOpen} />
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
						<i onClick={toggleSearch}>
							<IconSearch aria-label="Open search" />
						</i>
						<i onClick={toggleMenu}>
							<IconMenu2 aria-label="Open menu" />
						</i>
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
