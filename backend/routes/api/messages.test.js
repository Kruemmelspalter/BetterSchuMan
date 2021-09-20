import request from "supertest"
import agent from "superagent"

import {app} from '../../server.js'

let token = "";

describe('Messages API', function () {
    it('GET messages', done => {
        request(app)
            .get('/api/messages')
            .set({Authorization: token})
            .send()
            .end(done)
    })
})