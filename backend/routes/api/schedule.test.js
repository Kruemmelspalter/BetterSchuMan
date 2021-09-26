import request from "supertest"
import agent from "superagent"

import {app} from '../../server.js'

let token = "";

describe('Schedule API', function () {
    it('GET schedule', done => {
        request(app)
            .get('/api/schedule')
            .set({Authorization: token})
            .send()
            .end(done)
    })
})