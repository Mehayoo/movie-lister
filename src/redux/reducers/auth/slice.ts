import {
	ActionReducerMapBuilder,
	createSlice,
	Draft,
	PayloadAction,
} from '@reduxjs/toolkit'
import { completeLogin, doLogin } from './actionCreators'
import { RequestStatus } from '../../../constants'

export interface AuthState {
	sessionToken: string
	isLoggedIn: boolean
	doLoginRequestStatus: RequestStatus
	completeLoginRequestStatus: RequestStatus
}

const initialState: AuthState = {
	sessionToken: '',
	isLoggedIn: false,
	doLoginRequestStatus: RequestStatus.PENDING,
	completeLoginRequestStatus: RequestStatus.PENDING,
}

const slice = createSlice({
	name: 'auth',
	initialState,
	reducers: {},
	extraReducers: (builder: ActionReducerMapBuilder<AuthState>): void => {
		builder
			.addCase(doLogin.pending, (state: Draft<AuthState>): void => {
				state.doLoginRequestStatus = RequestStatus.LOADING
			})
			.addCase(doLogin.rejected, (state: Draft<AuthState>): void => {
				state.doLoginRequestStatus = RequestStatus.ERROR
			})
			.addCase(doLogin.fulfilled, (state: Draft<AuthState>): void => {
				state.doLoginRequestStatus = RequestStatus.SUCCESS
			})
			.addCase(completeLogin.pending, (state: Draft<AuthState>): void => {
				state.completeLoginRequestStatus = RequestStatus.LOADING
			})
			.addCase(
				completeLogin.rejected,
				(state: Draft<AuthState>): void => {
					state.completeLoginRequestStatus = RequestStatus.ERROR
				}
			)
			.addCase(
				completeLogin.fulfilled,
				(
					state: Draft<AuthState>,
					action: PayloadAction<string>
				): void => {
					state.completeLoginRequestStatus = RequestStatus.SUCCESS
					state.isLoggedIn = true
					state.sessionToken = action.payload
				}
			)
	},
})

export default slice.reducer
