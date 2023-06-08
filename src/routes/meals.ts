import { FastifyInstance } from 'fastify'
import { checkIfTokenExists } from '../middlewares/check-if-token-exists'
import { knex } from '../database'
import { z } from 'zod'
import { OK } from '../utils/statusCode'

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/create', { preHandler: checkIfTokenExists }, async (req, reply) => {
    const schema = z.object({
      name: z.string(),
      description: z.string(),
      healthy_diet: z.boolean()
    })

    const { name, description, healthy_diet } = schema.parse(req.body)

    await knex('meals').insert({
      name,
      description,
      healthy_diet,
      user_id: req.user?.id
    })

    return reply.code(OK).send({ message: 'Meal created' })
  })

  app.get('/', { preHandler: checkIfTokenExists }, async (req, reply) => {
    const meals = await knex('meals').select().where({ user_id: req.user?.id })

    return reply.code(OK).send({ result: meals })
  })
}
