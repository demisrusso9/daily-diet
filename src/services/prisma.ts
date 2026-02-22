import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'
import { PrismaClient } from '../../prisma/generated/client'
import { env } from '../envs/env'

const connectionString = env.DATABASE_URL

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export { prisma }
