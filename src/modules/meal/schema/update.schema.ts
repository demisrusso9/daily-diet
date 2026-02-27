import z from 'zod'

export const updateMealSchema = z.object({
	name: z.string().optional(),
	description: z.string().optional(),
	date: z.coerce.date().optional(),
	isOnDiet: z.boolean().optional()
})

export type UpdateMealDTO = z.infer<typeof updateMealSchema>
