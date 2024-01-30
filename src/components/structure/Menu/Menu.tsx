import { useState } from 'react'
import { Link } from 'react-router-dom'
import { IconX } from '@tabler/icons-react'
import { Categories } from '../..'
import { MenuProps } from './types'
import cn from '../../../utils/classNames'

import './style.scss'
const bem = cn('menu')

const Menu = ({ categories, menuOpen, toggleMenu }: MenuProps) => {
	const [openMobileDropdown, setOpenMobileDropdown] = useState<boolean>(false)
	const onMoviesMobileClick = (): void => {
		setOpenMobileDropdown(!openMobileDropdown)
	}

	return (
		<nav className={bem('', { open: menuOpen })}>
			<header className={bem('title')}>
				<h2>Menu</h2>
				<IconX aria-label="Close menu" onClick={toggleMenu} />
			</header>

			<div className={bem('body')}>
				<div className={bem('links')}>
					<Link onClick={onMoviesMobileClick} to="">
						movies
					</Link>

					<Categories
						categories={categories}
						className={bem('categories-dropdown', {
							open: openMobileDropdown,
						})}
						toggleMenu={toggleMenu}
					/>

					<Link onClick={toggleMenu} to="/favorites">
						favorites
					</Link>
					<Link onClick={toggleMenu} to="/about">
						about
					</Link>
				</div>
			</div>
		</nav>
	)
}

export default Menu
