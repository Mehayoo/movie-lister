import { RootState, useAppSelector } from '../../store'
import { RequestStatus } from '../../../constants'

export const useAuthState = () => {
	const completeLoginRequestStatus: RequestStatus = useAppSelector(
		(state: RootState) => state.authReducer.completeLoginRequestStatus
	)

	const doLoginRequestStatus: RequestStatus = useAppSelector(
		(state: RootState) => state.authReducer.doLoginRequestStatus
	)

	const isLoggedIn: boolean = useAppSelector(
		(state: RootState) => state.authReducer.isLoggedIn
	)

	const session_id: string = useAppSelector(
		(state: RootState) => state.authReducer.session_id
	)

	return {
		completeLoginRequestStatus,
		doLoginRequestStatus,
		isLoggedIn,
		session_id,
	}
}
