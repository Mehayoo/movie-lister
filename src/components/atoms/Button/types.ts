import { ReactNode } from 'react'

export interface ButtonProps {
	readonly children?: ReactNode | ReactNode[]
	readonly className?: string
	readonly disabled?: boolean
	readonly headIcon?: ReactNode
	readonly label?: string
	readonly onClick?: (event?: React.MouseEvent<Element>) => void
	readonly tailIcon?: ReactNode
}
