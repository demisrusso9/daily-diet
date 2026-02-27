import z from 'zod'

export const paramsSchema = z.object({
	id: z.string()
})

export type ListIdDTO = z.infer<typeof paramsSchema>
