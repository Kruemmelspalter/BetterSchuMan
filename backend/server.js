import express from 'express'
import * as ApiRouter from './routes/api.js'
import expressWinston from 'express-winston'
import winston from "winston";

const app = express()

app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    meta: false,
    msg: "{{req.method}} {{req.url}}",
}))


app.use(express.static('./static'))

app.use('/api', ApiRouter.router)

app.listen(80, () => console.log(`Listening`))