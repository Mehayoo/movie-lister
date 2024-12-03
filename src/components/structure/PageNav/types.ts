export interface PageNavProps {
	readonly changePage: (args: { page: number; increment?: number }) => void
	readonly currentPage: number
	readonly totalPages: number
}
