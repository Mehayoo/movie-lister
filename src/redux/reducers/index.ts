import { combineReducers } from 'redux'

import authReducer from './auth/slice'
import { errorReducer } from './error'
import moviesReducer from './movies/slice'

export default combineReducers({
	authReducer,
	errorReducer,
	moviesReducer,
})
