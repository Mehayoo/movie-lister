import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit'
import { AsyncThunkConfig } from '@reduxjs/toolkit/dist/createAsyncThunk'

import AuthService from '../../../../service/AuthService'
import { SLICE_NAME } from '../constants'

const doLogin: AsyncThunk<void, void, AsyncThunkConfig> = createAsyncThunk(
	`${SLICE_NAME}/doLogin`,
	async (_, { rejectWithValue }) => {
		try {
			return await AuthService.doLogin()
		} catch (error: unknown) {
			return rejectWithValue((error as Error).message)
		}
	}
)

export { doLogin }
