import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useAppDispatch } from './redux/store'
import { doLogin } from './redux/reducers/auth/actionCreators'
import { useAuthState } from './redux/reducers/auth/selectors'
import { routes, RouteType } from './routes'
import { Footer, Navbar } from './components'
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
