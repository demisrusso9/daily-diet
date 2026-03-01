import 'dotenv/config'
import { z } from 'zod'

const envsSchema = z.object({
	NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
	PORT: z.coerce.number().default(3333),
	DATABASE_URL: z.string(),
	JWT_SECRET: z.string(),
	HOST: z.string()
})

const { data, error } = envsSchema.safeParse(process.env)

if (error) {
	console.error('Invalid environment variables:', z.prettifyError(error))
	process.exit(1)
}

export const env = data
