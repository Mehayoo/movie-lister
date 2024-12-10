import 'reflect-metadata'
import { DataSource } from 'typeorm'
import * as dotenv from 'dotenv'

dotenv.config()

const AppDataSource: DataSource = new DataSource({
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB,
	entities: [__dirname + '/../dist/src/entity/**/*.js'],
	migrations: [__dirname + '/../dist/src/migration/**/*.js'],
	synchronize: false,
	migrationsRun: true,
	logging: false,
})

export default AppDataSource
