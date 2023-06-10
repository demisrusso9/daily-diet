import { FastifyInstance } from 'fastify'
import { checkIfTokenExists } from '../middlewares/check-if-token-exists'
import { knex } from '../database'
import { z } from 'zod'
import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from '../utils/statusCode'

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
    try {
      const meals = await knex('meals').select().where({ user_id: req.user?.id })

      return reply.code(OK).send({ result: meals })
    } catch (error) {
      console.error(error)

      return reply
        .code(INTERNAL_SERVER_ERROR)
        .send({ message: 'An error occurred while processing the request.' })
    }
  })

  app.get('/:id', { preHandler: checkIfTokenExists }, async (req, reply) => {
    const schema = z.object({
      id: z.string()
    })

    const { id } = schema.parse(req.params)

    try {
      const meal = await knex('meals')
        .select()
        .where({
          user_id: req.user?.id,
          id: id
        })
        .first()

      if (!meal) {
        return reply.code(NOT_FOUND).send({ message: 'Meal not found' })
      }

      return reply.code(OK).send({ result: meal })
    } catch (error) {
      console.error(error)

      return reply
        .code(INTERNAL_SERVER_ERROR)
        .send({ message: 'An error occurred while processing the request.' })
    }
  })

  app.delete('/:id', { preHandler: checkIfTokenExists }, async (req, reply) => {
    const schema = z.object({
      id: z.string()
    })

    const { id } = schema.parse(req.params)

    try {
      const meal = await knex('meals')
        .delete()
        .where({
          user_id: req.user?.id,
          id: id
        })
        .returning('*')

      if (!meal) {
        return reply.code(NOT_FOUND).send({ message: 'Meal not found' })
      }

      return reply.code(OK).send({ message: 'Meal deleted' })
    } catch (error) {
      console.error(error)

      return reply
        .code(INTERNAL_SERVER_ERROR)
        .send({ message: 'An error occurred while processing the request.' })
    }
  })

  app.get('/summary', { preHandler: checkIfTokenExists }, async (req, reply) => {
    try {
      const meals = await knex('meals').select().where({ user_id: req.user?.id })

      const { bestSequence, goodDiet, badDiet } = meals.reduce(
        (acc, meal) => {
          if (meal.healthy_diet) {
            acc.sequence += 1
            acc.bestSequence = Math.max(acc.bestSequence, acc.sequence)
            acc.goodDiet += 1
          } else {
            acc.sequence = 0
            acc.badDiet += 1
          }

          return acc
        },
        { goodDiet: 0, badDiet: 0, bestSequence: 0, sequence: 0 }
      )

      return reply.code(OK).send({
        total: meals.length,
        goodDiet,
        badDiet,
        bestSequence
      })
    } catch (error) {
      console.error(error)

      return reply
        .code(INTERNAL_SERVER_ERROR)
        .send({ message: 'An error occurred while processing the request.' })
    }
  })
}
