import { z } from 'zod'

export const sessionSchema = z.object({
	email: z.email(),
	password: z.string().min(6)
})

export type SessionDTO = z.infer<typeof sessionSchema>
