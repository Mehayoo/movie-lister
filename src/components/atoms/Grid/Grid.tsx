import { GridProps } from './types'
import cn from '../../../utils/classNames'

import './style.scss'
const bem = cn('grid')

const Grid = ({ children }: GridProps) => {
	return <div className={bem('')}>{children}</div>
}

export default Grid
