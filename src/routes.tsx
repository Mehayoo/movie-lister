import { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'
import {
	AboutPage,
	CategoryPage,
	FavoritesPage,
	MovieDetails,
	MoviesPage,
	SearchResults,
	TmdbAuthHandler,
} from './components'

export interface RouteType {
	element: () => ReactElement
	name: string
	path: string
}

export const routes: RouteType[] = [
	{
		element: () => <TmdbAuthHandler />,
		name: 'tmdb-auth-handler',
		path: '/approved',
	},
	{
		element: () => <Navigate to="/movies" replace />,
		name: 'home-redirect',
		path: '/',
	},
	{
		element: () => <MoviesPage />,
		name: 'home-page',
		path: '/movies',
	},
	{
		element: () => <CategoryPage />,
		name: 'movies-by-category-page',
		path: '/category/:categoryName',
	},
	{
		element: () => <MovieDetails />,
		name: 'movie-details',
		path: '/movies/:movieId',
	},
	{
		element: () => <FavoritesPage />,
		name: 'favorites-page',
		path: '/favorites',
	},
	{
		element: () => <AboutPage />,
		name: 'about-page',
		path: '/about',
	},
	{
		element: () => <SearchResults />,
		name: 'search-results-page',
		path: '/search-results',
	},
]
