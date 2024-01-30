import { GetCategoriesResponse } from '../../../constants'

export interface MenuProps {
	readonly categories: GetCategoriesResponse
	readonly menuOpen: boolean
	readonly toggleMenu: () => void
}
