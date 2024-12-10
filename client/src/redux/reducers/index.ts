import { combineReducers } from 'redux'
import authReducer from './auth/slice'
import moviesReducer from './movies/slice'
import { errorReducer } from './error'

export default combineReducers({
	authReducer,
	moviesReducer,
	errorReducer,
})
