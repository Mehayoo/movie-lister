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
			return searchMovies({ query, categoryId })

		// TO-DO: Treat error case if there's any need for this

		case ContextEnum.FAVORITES:
			// TO-DO: Treat error case if there's any need for this
			break
		default:
			console.error(
				'Treat error - no action defined for context:',
				context
			)
			break
	}
}
