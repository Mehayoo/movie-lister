import { useEffect, useState, useRef } from 'react'

const useLazyLoad = () => {
	const [loaded, setLoaded] = useState<boolean>(false)
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const observer: IntersectionObserver = new IntersectionObserver(
			(entries: IntersectionObserverEntry[]) => {
				const [entry] = entries
				if (entry.isIntersecting && ref.current) {
					setLoaded(true)
					observer.disconnect()
				}
			}
		)

		if (ref.current) {
			observer.observe(ref.current)
		}

		return () => {
			observer.disconnect()
		}
	}, [ref])

	return { loaded, ref }
}

export default useLazyLoad
