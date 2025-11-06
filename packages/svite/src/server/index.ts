import { createServer } from 'node:http'
import connect from 'connect'
import { htmlHandler } from '../middlewares/htmlHandler'


export function createDevServer(config: Object) {
  const app = connect()

  let server = createServer(app)

  app.use((req, res, next) => {
    if (req.url?.includes('.js')) {
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
    }
    next()
  })

  app.use(htmlHandler)

  server.listen(3000, () => {
    console.log('Dev server running on http://localhost:3000')
  })

  console.log('server created', config);
}