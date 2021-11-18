/* eslint-disable no-undef */
import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database/connection.js';
import { deleteUsers, fakeUserSignUp, invalidFakeUserSignUp } from '../src/factories/users.factory.js';

afterAll(async () => {
  await deleteUsers();
  connection.end();
});

describe('POST /sign-up', () => {
  test('should return status 201 if the user was successfully registered', async () => {
    const result = await supertest(app).post('/sign-up').send(fakeUserSignUp);
    expect(result.status).toEqual(201);
  });

  test('should return status 409 if the email was already in use', async () => {
    const result = await supertest(app).post('/sign-up').send(fakeUserSignUp);
    expect(result.status).toEqual(409);
  });

  test('should return status 400 if the request did not passed the joi validation', async () => {
    const result = await supertest(app).post('/sign-up').send(invalidFakeUserSignUp);
    expect(result.status).toEqual(400);
  });
});
