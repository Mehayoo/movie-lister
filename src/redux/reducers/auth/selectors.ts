import { RootState, useAppSelector } from '../../store'
import { RequestStatus } from '../../../constants'

export const useAuthState = () => {
	const sessionToken: string = useAppSelector(
		(state: RootState) => state.authReducer.sessionToken
	)
	const isLoggedIn: boolean = useAppSelector(
		(state: RootState) => state.authReducer.isLoggedIn
	)
	const doLoginRequestStatus: RequestStatus = useAppSelector(
		(state: RootState) => state.authReducer.doLoginRequestStatus
	)
	const completeLoginRequestStatus: RequestStatus = useAppSelector(
		(state: RootState) => state.authReducer.completeLoginRequestStatus
	)

	return {
		sessionToken,
		isLoggedIn,
		doLoginRequestStatus,
		completeLoginRequestStatus,
	}
}
