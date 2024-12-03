import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppDispatch } from '../redux/store'
import { setPathContext, setSearchQuery } from '../redux/reducers/movies/slice'
import { getContextFromPath } from '../utils/getContextFromPath'
import { ContextEnum } from '../constants'

export const useSearchContext = (): {
	context: string
	dynamicValue: string | undefined
	configureSearchContext: () => void
} => {
	const location = useLocation()
	const dispatch = useAppDispatch()

	const { context, dynamicValue } = useMemo(
		() => getContextFromPath(location.pathname),
		[location.pathname]
	)

	const configureSearchContext = (): void => {
		if (context !== ContextEnum.SEARCH) {
			dispatch(setPathContext({ context, dynamicValue }))
			dispatch(setSearchQuery(''))
		}
	}

	return { context, dynamicValue, configureSearchContext }
}
