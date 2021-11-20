/* eslint-disable no-undef */
import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database/connection.js';
import * as U from './factories/users.factory.js';

afterAll(async () => {
  await U.deleteSessions();
  await U.deleteUsers();
  connection.end();
});

describe('POST /sign-up', () => {
  test('should return status 201 if the user was successfully registered', async () => {
    const result = await supertest(app).post('/sign-up').send(U.fakeUserSignUp);
    expect(result.status).toEqual(201);
  });

  test('should return status 409 if the email was already in use', async () => {
    const result = await supertest(app).post('/sign-up').send(U.fakeUserSignUp);
    expect(result.status).toEqual(409);
  });

  test('should return status 400 if the request did not passed the joi validation', async () => {
    const result = await supertest(app).post('/sign-up').send(U.invalidFakeUserSignUp);
    expect(result.status).toEqual(400);
  });
});

describe('POST /sign-in', () => {
  test('should return status 200 if the user was successfully logged', async () => {
    const result = await supertest(app).post('/sign-in').send(U.fakeUserSignIn);
    expect(result.status).toEqual(200);
    expect(result.body).toHaveProperty('name');
    expect(result.body).toHaveProperty('token');
  });

  test('should return status 401 if the user was not registered or passed the wrong password', async () => {
    const result = await supertest(app).post('/sign-in').send(U.fakeUserNotRegistered);
    expect(result.status).toEqual(401);
  });

  test('should return status 400 if the request did not passed the joi validation', async () => {
    const result = await supertest(app).post('/sign-in').send(U.invalidFakeUserSignIn);
    expect(result.status).toEqual(400);
  });
});
