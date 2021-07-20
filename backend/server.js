import express from 'express'
import * as ApiRouter from './routes/api.js'
const app = express()

app.get('/', (req, res) => {
    res.redirect('/static/index.html')
})

app.use('/app', express.static('static'))
app.use('/api', ApiRouter.router)

app.listen(8080)