import { env } from '@/envs/env'
import { app } from './app'

app.listen({ port: env.PORT, host: env.HOST }, () => {
	app.log.info({ host: env.HOST, port: env.PORT }, 'Server listening')
	app.log.info(
		{ url: `http://${env.HOST}:${env.PORT}/docs` },
		'Swagger docs available'
	)
})
