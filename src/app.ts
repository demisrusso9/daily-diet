import fastify from 'fastify'
import { accountRoutes } from './routes/account'
import { mealsRoutes } from './routes/meals'

export const app = fastify()

app.register(accountRoutes, { prefix: 'users' })
app.register(mealsRoutes, { prefix: 'meals' })
