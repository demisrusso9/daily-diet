import z from 'zod'

export const healthCheckDocs = {
	tags: ['Health'],
	summary: 'Verificar se a API está funcionando',
	response: {
		200: z
			.object({ status: z.string(), database: z.string(), uptime: z.number() })
			.describe('API e banco de dados funcionando')
	}
}
