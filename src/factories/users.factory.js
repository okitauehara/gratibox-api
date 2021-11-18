// eslint-disable-next-line import/no-extraneous-dependencies
import faker from 'faker';
import connection from '../database/connection.js';

const fakeUserSignUp = {
  id: faker.datatype.number(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
};

const invalidFakeUserSignUp = {
  name: faker.name.findName(),
  email: faker.internet.email(),
};

const fakeUserSignIn = {
  email: fakeUserSignUp.email,
  password: fakeUserSignUp.password,
};

const fakeUserNotRegistered = {
  email: faker.internet.email(),
  password: faker.internet.password(),
};

const wrongFakeUserSignIn = {
  email: fakeUserSignUp.email,
};

const deleteUsers = async () => connection.query('DELETE FROM users;');

const deleteSessions = async () => connection.query('DELETE FROM sessions;');

export {
  fakeUserSignUp,
  invalidFakeUserSignUp,
  fakeUserSignIn,
  fakeUserNotRegistered,
  wrongFakeUserSignIn,
  deleteUsers,
  deleteSessions,
};
