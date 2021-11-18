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

const deleteUsers = async () => connection.query('DELETE FROM users;');

export {
  fakeUserSignUp,
  invalidFakeUserSignUp,
  deleteUsers,
};
