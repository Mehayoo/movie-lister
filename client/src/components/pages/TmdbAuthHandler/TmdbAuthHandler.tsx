import { useEffect } from 'react'
import {
	Location,
	NavigateFunction,
	useLocation,
	useNavigate,
} from 'react-router-dom'

import { Grid, Skeleton } from '../..'

import { useAppDispatch } from '../../../redux/store'
import { completeLogin } from '../../../redux/reducers/auth/actionCreators/completeLogin'

const TmdbAuthHandler = () => {
	const dispatch = useAppDispatch()
	const location: Location<any> = useLocation()
	const navigate: NavigateFunction = useNavigate()

	useEffect(() => {
		const searchParams: URLSearchParams = new URLSearchParams(
			location.search
		)
		const approvedToken: string | null = searchParams.get('request_token')
		const approved: string | null = searchParams.get('approved')

		if (approvedToken && approved === 'true') {
			dispatch(completeLogin(approvedToken))
				.unwrap() // Converts the fulfilled/rejected action’s payload into a resolved/rejected promise
				.then(() => navigate('/movies')) // Navigation happens in here to keep API logic separate from routing logic
				.catch(() => {
					// Handle error
				})
		} else {
			// TO-DO: Handle incomplete authentication or absence of token
			// TO-DO: Show error message or navigate to a specific error handling route
		}
	}, [location, dispatch, navigate])

	return (
		<Grid>
			{Array.from({ length: 8 }).map((_, index) => (
				<Skeleton key={index} />
			))}
		</Grid>
	)
}

export default TmdbAuthHandler
