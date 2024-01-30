import { SearchProps } from './types'
import cn from '../../../utils/classNames'

import './style.scss'
const bem = cn('search')

const Search = ({ searchOpen }: SearchProps) => {
	return (
		<div className={bem('', { open: searchOpen })}>
			<input
				className={bem('input')}
				placeholder="Search..."
				type="text"
			/>
		</div>
	)
}

export default Search
