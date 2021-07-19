import express from 'express'
import ApiRoute from './routes/api'
const app = express()

app.get('/', (req, res) => {
    res.redirect('/static/index.html')
})

app.use('/app', express.static('static'))

app.use('/api', ApiRoute)

app.listen(8080)