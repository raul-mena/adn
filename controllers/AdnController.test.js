const request = require('supertest')
const app = require('../index.js')

describe('Post Endpoints', () => {
    it('should detect no mutation', async() => {
        const res = await request(app)
            .post('/api/mutation')
            .send({
                "adn": ["FTGCGA", "AAGTGC", "CTATGT", "AGAADG", "ACCCTA", "TCACTG"]
            });
        expect(res.statusCode).toEqual(403)
        expect(res.body).toHaveProperty('message')
    })

    it('should detect mutation', async() => {
        const res = await request(app)
            .post('/api/mutation')
            .send({
                "adn": ["FTGCGA", "AAGTGC", "CTATGT", "AGAADG", "CCCCTA", "TCACTG"]
            });
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('message')
    })

    it('should return invalid paylod', async() => {
        const res = await request(app)
            .post('/api/mutation')
            .send({
                "adn": 0
            });
        expect(res.statusCode).toEqual(500)
        expect(res.body).toHaveProperty('error')
    })
})