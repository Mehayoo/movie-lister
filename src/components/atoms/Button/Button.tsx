import { ButtonProps } from './types'
import cn from '../../../utils/classNames'

import './style.scss'
const bem = cn('button')

const Button = ({
	children,
	className,
	disabled = false,
	headIcon,
	label,
	onClick,
	tailIcon,
}: ButtonProps) => {
	const classNames = [bem(''), className].join(' ').trim()

	return (
		<button
			className={classNames}
			disabled={disabled}
			onClick={onClick}
			type="button"
		>
			{headIcon && <i className={bem('icon-container')}>{headIcon}</i>}

			{label || children}

			{tailIcon && <i className={bem('icon-container')}>{tailIcon}</i>}
		</button>
	)
}

export default Button
