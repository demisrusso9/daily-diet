import z from 'zod'

export const createMealSchema = z.object({
	name: z.string(),
	description: z.string(),
	date: z.coerce.date(),
	isOnDiet: z.boolean()
})

export type CreateMealDTO = z.infer<typeof createMealSchema>
