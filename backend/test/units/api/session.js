import {app} from '../../../server.js'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import {assert} from 'chai'

describe('Session Testing', function () {
    it('should log in successfully', function (done) {
        request(app)
            .post('/api/session')
            .send({username: process.env.USERNAME, password: process.env.PASSWORD})
            .expect(res => {
                let token = res.headers['x-new-bearer-token']
                console.log("Token", token)
                assert.isNotNull(token) // TODO does not trigger
                let decodedToken = jwt.decode(token)
                console.log("Token", token)
                assert.isNotNull(decodedToken)
                assert.isTrue(decodedToken['iat'] < Math.ceil(new Date().getTime() / 1000))
                assert.isTrue(decodedToken['exp'] > Math.floor(new Date().getTime() / 1000))
            })
            .end(done)
    });
});
