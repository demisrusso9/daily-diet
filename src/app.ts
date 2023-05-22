import fastify from 'fastify'
import { createAccount } from './routes/account'

export const app = fastify()

app.register(createAccount)