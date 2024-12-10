import { GetCategoriesResponse } from '../../../constants'

export interface CategoriesProps {
	readonly categories: GetCategoriesResponse
	readonly className?: string
	readonly toggleMenu?: () => void
}
