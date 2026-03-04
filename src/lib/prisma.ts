import { env } from '@/envs/env'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/generated/client'
import 'dotenv/config'

function createPrismaClient(connectionString: string) {
	const url = new URL(connectionString)
	const schema = url.searchParams.get('schema') ?? undefined
	url.searchParams.delete('schema')

	const adapter = new PrismaPg({ connectionString: url.toString() }, { schema })
	return new PrismaClient({ adapter })
}

export const prisma = createPrismaClient(env.DATABASE_URL)
