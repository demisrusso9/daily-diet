import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { Environment } from 'vitest/environments'
import { PrismaClient } from '../../src/prisma/generated/client'

export default <Environment>{
	name: 'prisma',
	viteEnvironment: 'ssr',
	setup() {
		if (!process.env.DATABASE_URL) {
			throw new Error(
				'DATABASE_URL environment variable is not set for testing'
			)
		}

		const schema = randomUUID()
		const url = new URL(process.env.DATABASE_URL)
		const connectionString = url.toString()

		process.env.DATABASE_URL = `${connectionString}?schema=${schema}`

		execSync('npx prisma db push')

		const adapter = new PrismaPg({ connectionString }, { schema })
		const prisma = new PrismaClient({ adapter })

		return {
			async teardown() {
				await prisma.$executeRawUnsafe(
					`DROP SCHEMA IF EXISTS "${schema}" CASCADE`
				)
				await prisma.$disconnect()
			}
		}
	}
}
