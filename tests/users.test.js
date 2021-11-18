/* eslint-disable no-undef */
import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database/connection.js';
import * as F from '../src/factories/users.factory.js';

afterAll(async () => {
  await F.deleteSessions();
  await F.deleteUsers();
  connection.end();
});

describe('POST /sign-up', () => {
  test('should return status 201 if the user was successfully registered', async () => {
    const result = await supertest(app).post('/sign-up').send(F.fakeUserSignUp);
    expect(result.status).toEqual(201);
  });

  test('should return status 409 if the email was already in use', async () => {
    const result = await supertest(app).post('/sign-up').send(F.fakeUserSignUp);
    expect(result.status).toEqual(409);
  });

  test('should return status 400 if the request did not passed the joi validation', async () => {
    const result = await supertest(app).post('/sign-up').send(F.invalidFakeUserSignUp);
    expect(result.status).toEqual(400);
  });
});

describe('POST /sign-in', () => {
  test('should return status 200 if the user was successfully logged', async () => {
    const result = await supertest(app).post('/sign-in').send(F.fakeUserSignIn);
    expect(result.status).toEqual(200);
    expect(result.body).toHaveProperty('name');
    expect(result.body).toHaveProperty('token');
  });

  test('should return status 401 if the user was not registered or passed the wrong password', async () => {
    const result = await supertest(app).post('/sign-in').send(F.fakeUserNotRegistered);
    expect(result.status).toEqual(401);
  });

  test('should return status 400 if the request did not passed the joi validation', async () => {
    const result = await supertest(app).post('/sign-in').send(F.wrongFakeUserSignIn);
    expect(result.status).toEqual(400);
  });
});
