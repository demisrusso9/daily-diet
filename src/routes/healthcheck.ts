import { healthCheckDocs } from '@/docs/healthcheck.docs'
import { prisma } from '@/lib/prisma'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function healthCheckRoutes(app: FastifyInstance) {
	const router = app.withTypeProvider<ZodTypeProvider>()

	router.get(
		'/healthcheck',
		{ schema: healthCheckDocs, attachValidation: true },
		async (request, reply) => {
			await prisma.$queryRaw`SELECT 1`

			const log = request.log.child({ context: 'healthcheck' })
			log.info('Healthcheck endpoint accessed')

			return reply.status(200).send({
				status: 'ok',
				database: 'ok',
				uptime: process.uptime()
			})
		}
	)
}
