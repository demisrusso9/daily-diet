import 'dotenv/config'
import { z } from 'zod'

const envsSchema = z.object({
	NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
	PORT: z.number().default(3333),
	DATABASE_URL: z.string(),
	JWT_SECRET: z.string()
})

const parsedEnvs = envsSchema.safeParse(process.env)

if (!parsedEnvs.success) {
	console.error('Invalid environment variables:', parsedEnvs.error.format())
	process.exit(1)
}

export const env = parsedEnvs.data
