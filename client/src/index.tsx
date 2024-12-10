import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { enableMapSet } from 'immer'
import store from './redux/store'
import App from './App'
import './index.scss'

enableMapSet()

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
	<Provider store={store}>
		<App />
	</Provider>
)
