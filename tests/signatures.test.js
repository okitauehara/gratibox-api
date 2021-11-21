/* eslint-disable no-undef */
import supertest from 'supertest';
import faker from 'faker';
import app from '../src/app.js';
import connection from '../src/database/connection.js';
import * as U from './factories/users.factory.js';
import * as S from './factories/signatures.factory.js';

beforeAll(async () => {
  await U.createFakeUser();
  await U.createFakeSession();
});

afterAll(async () => {
  await S.deleteSignatures();
  await S.deleteUsersProducts();
  await S.deleteDeliveryInfos();
  await U.deleteSessions();
  await U.deleteUsers();
  connection.end();
});

describe('POST /subscriptions/:planId', () => {
  test('should return status 201 if the signature was successfully implemented', async () => {
    const result = await supertest(app).post(`/subscriptions/${faker.random.arrayElement(['1', '2'])}`).send(S.fakeSignature).set('Authorization', `Bearer ${U.fakeSession.token}`);
    expect(result.status).toEqual(201);
  });

  test('should return status 401 if the request was missing token', async () => {
    const result = await supertest(app).post(`/subscriptions/${faker.random.arrayElement(['1', '2'])}`).send(S.fakeSignature);
    expect(result.status).toEqual(401);
  });

  test('should return status 400 if the request did not passed the joi validation', async () => {
    const result = await supertest(app).post(`/subscriptions/${faker.random.arrayElement(['1', '2'])}`).send(S.invalidFakeSignature).set('Authorization', `Bearer ${U.fakeSession.token}`);
    expect(result.status).toEqual(400);
  });

  test('should return status 404 if the request token does not belong to any user', async () => {
    const result = await supertest(app).post(`/subscriptions/${faker.random.arrayElement(['1', '2'])}`).send(S.fakeSignature).set('Authorization', `Bearer ${U.fakeSession.token}123`);
    expect(result.status).toEqual(404);
  });
});

describe('GET /subscriptions', () => {
  test('should return status 401 if the request was missing token', async () => {
    const result = await supertest(app).get('/subscriptions/');
    expect(result.status).toEqual(401);
  });

  test('should return status 200 if the request was successfull', async () => {
    const result = await supertest(app).get('/subscriptions/').set('Authorization', `Bearer ${U.fakeSession.token}`);
    expect(result.status).toEqual(200);
    expect(result.body).toHaveProperty('signature_date');
    expect(result.body).toHaveProperty('products');
    expect(result.body).toHaveProperty('plan');
    expect(result.body).toHaveProperty('delivery_date');
  });

  test('should return status 404 if the request token does not belong to any user', async () => {
    const result = await supertest(app).get('/subscriptions/').set('Authorization', `Bearer ${U.fakeSession.token}123`);
    expect(result.status).toEqual(404);
  });
});
