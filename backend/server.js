import express from 'express'
import * as ApiRouter from './routes/api.js'
const app = express()

app.use(express.static('./static'))

app.use('/api', ApiRouter.router)

app.listen(8080)