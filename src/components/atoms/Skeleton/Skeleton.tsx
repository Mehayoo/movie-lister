import { useState, useEffect } from 'react'
import cn from '../../../utils/classNames'

import './style.scss'
const bem = cn('skeleton')

const Skeleton = () => {
	const [width, setWidth] = useState<number>(0)

	const updateWidth = () => {
		let screenWidth = document.documentElement.offsetWidth

		const maxWidth = 1200
		screenWidth = Math.min(screenWidth, maxWidth)

		let columns = 4

		if (screenWidth <= 750) {
			columns = 3
		}
		if (screenWidth <= 600) {
			columns = 2
		}
		if (screenWidth <= 430) {
			columns = 1
		}

		const gridGap = 20
		const totalPadding = 38

		const calculatedWidth =
			(screenWidth - totalPadding - (columns - 1) * gridGap) / columns
		setWidth(calculatedWidth)
	}

	useEffect(() => {
		updateWidth()
		window.addEventListener('resize', updateWidth)

		return () => {
			window.removeEventListener('resize', updateWidth)
		}
	}, [])

	return (
		<div className={bem('item')} style={{ width }}>
			<div className={bem('item__img')} />
			<div className={bem('item__desc')} />
		</div>
	)
}

export default Skeleton
