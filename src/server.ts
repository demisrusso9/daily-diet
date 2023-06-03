import { app } from './app'

app.get('/', (req, res) => {
  return res.send()
})

app.listen({ port: 3333 }, () => {
  console.log('listening')
})
