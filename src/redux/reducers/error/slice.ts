import {
	createSlice,
	isRejected,
	isRejectedWithValue,
	PayloadAction,
} from '@reduxjs/toolkit'
import { SLICE_NAME } from './constants'

interface State {
	errorVisible: boolean
	errorMessage: string
	successVisible: boolean
	successMessage: string
}

const initialState: State = {
	errorVisible: false,
	errorMessage: '',
	successVisible: false,
	successMessage: '',
}

const handleRejection = (state: State, action: any) => {
	state.errorVisible = true
	state.errorMessage = action.error.message || ''
}

export const slice = createSlice({
	name: SLICE_NAME,
	initialState,
	reducers: {
		setError: (state, action: PayloadAction<string>) => {
			state.errorMessage = action.payload
		},
		setErrorVisible: (state, action: PayloadAction<boolean>) => {
			state.errorVisible = action.payload
		},
		setSuccess: (state, action: PayloadAction<string>) => {
			state.successMessage = action.payload
		},
		setSuccessVisible: (state, action: PayloadAction<boolean>) => {
			state.successVisible = action.payload
		},
		reset: (state) => {
			state.errorVisible = false
			state.errorMessage = ''
			state.successVisible = false
			state.successMessage = ''
		},
	},
	extraReducers: (builder) => {
		builder.addMatcher(isRejectedWithValue, handleRejection)
		builder.addMatcher(isRejected, handleRejection)
	},
})
