import request from "supertest"
import agent from "superagent"

import {app} from '../../server.js'

let token = "";

describe('Courses API', function () {
    it('GET courses', done => {
        request(app)
            .get('/api/courses')
            .set({Authorization: token})
            .send()
            .end(done)
    })
})