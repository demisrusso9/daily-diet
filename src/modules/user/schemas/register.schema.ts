import { z } from 'zod'

export const registerSchema = z.object({
	name: z.string().max(50),
	email: z.email(),
	password: z.string().min(6)
})

export type RegisterDTO = z.infer<typeof registerSchema>
