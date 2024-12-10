import { AsyncThunkAction } from '@reduxjs/toolkit'
import { AsyncThunkConfig } from '@reduxjs/toolkit/dist/createAsyncThunk'
import { searchMovies } from '../redux/reducers/movies/actionCreators'
import {
	ContextSearchEnum,
	GetMoviesParams,
	RequestMoviesResponse,
} from '../constants'

export const pathContextActionMapping = (
	context: string,
	options: GetMoviesParams
):
	| AsyncThunkAction<RequestMoviesResponse, GetMoviesParams, AsyncThunkConfig>
	| undefined => {
	const { query, categoryId } = options

	switch (context) {
		case ContextSearchEnum.ALL:
			return searchMovies({ query })
		case ContextSearchEnum.CATEGORY:
			if (categoryId) {
				return searchMovies({ query, categoryId })
			}

			// TO-DO: Treat error case
			break
		case ContextSearchEnum.FAVORITES:
			break
		case ContextSearchEnum.SEARCH:
			// return pathContextActionMapping(context, {})
			break
		default:
			console.error(
				'Treat error - no action defined for context:',
				context
			)
			break
	}
}
