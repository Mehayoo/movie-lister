import { AsyncThunkAction } from '@reduxjs/toolkit'
import { AsyncThunkConfig } from '@reduxjs/toolkit/dist/createAsyncThunk'
import { searchMovies } from '../redux/reducers/movies/actionCreators'
import {
	ContextEnum,
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
		case ContextEnum.ALL:
			return searchMovies({ query })
		case ContextEnum.CATEGORY:
			if (categoryId) {
				return searchMovies({ query, categoryId })
			}

			// Treat error case
			break
		case ContextEnum.FAVORITES:
			break
		case ContextEnum.SEARCH:
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
