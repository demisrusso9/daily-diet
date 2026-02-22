import jwt from '@fastify/jwt'
import fastify from 'fastify'
import { env } from './envs/env'
import { mealRoutes } from './routes/meal'
import { userRoutes } from './routes/user'

const app = fastify()

app.register(jwt, { secret: env.JWT_SECRET })

app.register(userRoutes, { prefix: 'users' })
app.register(mealRoutes, { prefix: 'meals' })

app.listen({ port: env.PORT }, () => {
	console.log(`Server listening at ${env.PORT}`)
})
