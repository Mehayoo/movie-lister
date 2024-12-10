import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Footer, Navbar } from './components'

import { useAppDispatch } from './redux/store'
import { useAuthState } from './redux/reducers/auth/selectors'
import { doLogin } from './redux/reducers/auth/actionCreators'

import { routes, RouteType } from './routes'
import './App.scss'

function App() {
	const dispatch = useAppDispatch()
	const { isLoggedIn } = useAuthState()

	useEffect(() => {
		if (!isLoggedIn && !window.location.search.includes('request_token')) {
			dispatch(doLogin())
		}
	}, [isLoggedIn, dispatch])

	return (
		<BrowserRouter>
			<Navbar />
			<div className="content-wrap">
				<Routes>
					{routes.map((route: RouteType) => (
						<Route
							element={route.element()}
							key={route.name}
							path={route.path}
						/>
					))}
				</Routes>
			</div>
			<Footer />
		</BrowserRouter>
	)
}

export default App
