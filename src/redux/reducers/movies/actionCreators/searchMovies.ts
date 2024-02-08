import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit'
import { AsyncThunkConfig } from '@reduxjs/toolkit/dist/createAsyncThunk'

import MoviesService from '../../../../service/MoviesService'
import { GetMoviesParams, RequestMoviesResponse } from '../../../../constants/'
import { SLICE_NAME } from '../constants'

const searchMovies: AsyncThunk<
	RequestMoviesResponse,
	GetMoviesParams,
	AsyncThunkConfig
> = createAsyncThunk(
	`${SLICE_NAME}/searchMovies`,
	async (params: GetMoviesParams = { page: 1 }, { rejectWithValue }) => {
		try {
			return await MoviesService.searchMovies(params)
		} catch (error: unknown) {
			return rejectWithValue((error as Error).message)
		}
	}
)

const searchMoviesFulfilledType: string = searchMovies.fulfilled.type

export { searchMovies, searchMoviesFulfilledType }
