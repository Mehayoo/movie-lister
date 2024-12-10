import express from 'express'
import * as dotenv from 'dotenv'

import AppDataSource from './data-source'
import authRouter from './routes/authRouter'
import { errorHandlerMiddleware } from './middleware/error/error-handler.middleware'

dotenv.config()

const app = express()
const PORT: string | 3002 = process.env.PORT || 3002

AppDataSource.initialize()
	.then(() => {
		console.log('Data Source has been initialized!')

		app.listen(PORT, () => {
			console.log(`Server is running on http://localhost:${PORT}`)
		})
	})
	.catch((err) => {
		console.error('Error during Data Source initialization', err)
	})

// Middleware to parse json bodies
app.use(express.json())

// Routes
app.use('/auth', authRouter)

// Error handling
app.use(errorHandlerMiddleware)
