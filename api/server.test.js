// Write your tests here
const request = require('supertest')
const server = require('./server')

test('sanity', () => {
  expect(true).toBe(true)
})

describe(' /api/jokes', () => {
     it('should return 401', async () => {
      const res = await request(server).get('/api/jokes')
      expect(res.status).toBe(401);
      });
      it(' api/joekes should return json', async() => {
          const res = await request(server).get('/api/jokes');
          expect(res.type).toBe('application/json')
      });
      it('returns 500 status', async () => {
        const res = await request(server)
        .post('/api/auth/register')
        .send({username: "aman", password: "ftrft" });
        expect(res.status).toBe(500);
      });
      it('invalid payload: /login', async () => {
        const res = await request(server)
        .post('/api/auth/login')
        .send({ username: 'aman', password: '' })
        expect(res.status).toBe(422)
    })
  });
