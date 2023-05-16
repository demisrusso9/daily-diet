import { app } from './app'

app.get('/test', (req, res) => {
  return res.send()
})

app.listen({ port: 3333 }, () => {
  console.log('listening')
})
