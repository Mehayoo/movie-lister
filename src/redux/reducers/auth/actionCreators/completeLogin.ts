import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit'
import { AsyncThunkConfig } from '@reduxjs/toolkit/dist/createAsyncThunk'

import AuthService from '../../../../service/AuthService'
import { SLICE_NAME } from '../constants'

const completeLogin: AsyncThunk<string, string, AsyncThunkConfig> =
	createAsyncThunk(
		`${SLICE_NAME}/completeLogin`,
		async (approvedToken: string, { rejectWithValue }) => {
			try {
				return await AuthService.createSessionId(approvedToken)
			} catch (error: unknown) {
				return rejectWithValue((error as Error).message)
			}
		}
	)

export { completeLogin }
