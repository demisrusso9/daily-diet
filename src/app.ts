import fastify from 'fastify'
import { env } from './envs/env'
import { userRoutes } from './routes/user'

const app = fastify()

app.register(userRoutes, { prefix: 'users' })

app.listen({ port: env.PORT }, () => {
	console.log(`Server listening at ${env.PORT}`)
})
