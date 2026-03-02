import { FastifyReply, FastifyRequest } from 'fastify'

export async function checkIfUserIsAuthenticated(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const log = request.log.child({ context: 'checkIfUserIsAuthenticated' })

	try {
		await request.jwtVerify()
	} catch (error) {
		log.warn(
			{ url: request.url, method: request.method },
			'Unauthorized request'
		)
		return reply.status(401).send({
			error: 'Unauthorized'
		})
	}
}
