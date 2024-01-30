import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit'
import { AsyncThunkConfig } from '@reduxjs/toolkit/dist/createAsyncThunk'

import MoviesService from '../../../../service/MoviesService'
import { GetCategoriesResponse } from '../../../../constants/'
import { SLICE_NAME } from '../constants'

const getCategories: AsyncThunk<GetCategoriesResponse, void, AsyncThunkConfig> =
	createAsyncThunk(
		`${SLICE_NAME}/getCategories`,
		async (_, { rejectWithValue }) => {
			try {
				return await MoviesService.getCategories()
			} catch (error: unknown) {
				return rejectWithValue((error as Error).message)
			}
		}
	)

export { getCategories }
