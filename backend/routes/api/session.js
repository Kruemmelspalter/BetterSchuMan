import {Router} from "express";

export const router = Router()

router.post('/', (req, res) => {
    res
        //.header('X-New-Bearer-Token', 'a')
        .sendStatus(200)
        .send()
}) // TODO Only for debug
