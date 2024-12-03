import { RefObject, useCallback, useEffect, useState } from 'react'

const useDetectScrolledToBottom = (
	node?: RefObject<HTMLElement>
): { isBottom: boolean } => {
	const [isBottom, setIsBottom] = useState<boolean>(false)

	const handleScroll: () => void = useCallback(() => {
		let scrollTop: number, scrollHeight: number, clientHeight: number

		if (node && node.current) {
			;({ scrollTop, scrollHeight, clientHeight } = node.current)
		} else {
			scrollTop = window.scrollY
			clientHeight = window.innerHeight
			scrollHeight = document.documentElement.scrollHeight
		}

		if (scrollTop + clientHeight + 0.3 * clientHeight >= scrollHeight) {
			setIsBottom(true)
		} else {
			setIsBottom(false)
		}
	}, [node])

	useEffect(() => {
		const element = node?.current || window

		element.addEventListener('scroll', handleScroll)

		return () => element.removeEventListener('scroll', handleScroll)
	}, [node, handleScroll])

	return { isBottom }
}

export default useDetectScrolledToBottom
