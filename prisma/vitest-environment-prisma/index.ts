import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { Environment } from 'vitest/environments'
import { prisma } from '../../src/lib/prisma'

function generateDatabaseUrl(schema: string) {
	if (!process.env.DATABASE_URL) {
		throw new Error('DATABASE_URL environment variable is not set for testing')
	}

	const url = new URL(process.env.DATABASE_URL)
	url.searchParams.set('schema', schema)

	return url.toString()
}

export default <Environment>{
	name: 'prisma',
	viteEnvironment: 'ssr',
	setup() {
		const schema = randomUUID()
		const databaseUrl = generateDatabaseUrl(schema)
		console.log({ databaseUrl })

		process.env.DATABASE_URL = databaseUrl

		execSync('npx prisma db push')

		return {
			async teardown() {
				await prisma.$executeRawUnsafe(
					`DROP SCHEMA IF EXISTS "${schema}" CASCADE`
				)
				prisma.$disconnect()
			}
		}
	}
}
