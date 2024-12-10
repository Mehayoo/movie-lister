import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit'
import { AsyncThunkConfig } from '@reduxjs/toolkit/dist/createAsyncThunk'

import MoviesService from '../../../../service/MoviesService'
import { GetMoviesParams, RequestMoviesResponse } from '../../../../constants'
import { SLICE_NAME } from '../constants'

const getFavorites: AsyncThunk<
	RequestMoviesResponse,
	GetMoviesParams,
	AsyncThunkConfig
> = createAsyncThunk(
	`${SLICE_NAME}/getFavorites`,
	async (params: GetMoviesParams = { page: 1 }, { rejectWithValue }) => {
		try {
			return await MoviesService.getFavorites(params)
		} catch (error: unknown) {
			return rejectWithValue((error as Error).message)
		}
	}
)

export { getFavorites }
