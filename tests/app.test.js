/* eslint-disable no-undef */
import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database/connection.js';

afterAll(async () => {
  connection.end();
});

describe('GET /', () => {
  test('returns 200 for server ok!!', async () => {
    const result = await supertest(app).get('/');

    expect(result.status).toEqual(200);
  });
});
