import request from 'supertest';
// Note: You may need to export 'app' from server.js for this to work
import app from './server.js'; 

describe('Hangman API', () => {
  it('should fetch or create a player', async () => {
    const res = await request(app).get('/player/TestUser');
    expect(res.statusCode).toEqual(200);
    expect(res.body.player).toHaveProperty('username', 'TestUser');
  });

  it('should update player stats', async () => {
    const res = await request(app)
      .put('/player/TestUser')
      .send({ result: 'win' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.wins).toBeGreaterThanOrEqual(1);
  });
});