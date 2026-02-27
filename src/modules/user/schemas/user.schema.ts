import { z } from 'zod'

export const userSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	password: z.string()
})

export type UserDTO = z.infer<typeof userSchema>
