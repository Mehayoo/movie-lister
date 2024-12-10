import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit'
import { AsyncThunkConfig } from '@reduxjs/toolkit/dist/createAsyncThunk'

import MoviesService from '../../../../service/MoviesService'
import { ToggleFavorites, TmdbResponse } from '../../../../constants'
import { SLICE_NAME } from '../constants'

const toggleFavorite: AsyncThunk<
	TmdbResponse,
	ToggleFavorites,
	AsyncThunkConfig
> = createAsyncThunk(
	`${SLICE_NAME}/toggleFavorite`,
	async (params: ToggleFavorites, { rejectWithValue }) => {
		try {
			return await MoviesService.toggleFavorite(params)
		} catch (error: unknown) {
			return rejectWithValue((error as Error).message)
		}
	}
)

export { toggleFavorite }
