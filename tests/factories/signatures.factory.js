import faker from 'faker';
import connection from '../../src/database/connection';

const fakeSignature = {
  delivery_date: faker.random.arrayElement(['monday', 'wednesday', 'friday', 'day 01', 'day 10', 'day 20']),
  products: faker.random.arrayElements(['1', '2', '3']),
  cep: String(faker.datatype.number({ min: 0, max: 9, precision: 0.0000001 })).replace(/[^0-9]/g, ''),
  number: faker.datatype.number(),
  full_name: faker.name.findName(),
};

const invalidFakeSignature = {
  delivery_date: faker.random.arrayElement(['monday', 'wednesday', 'friday', 'day 01', 'day 10', 'day 20']),
  products: faker.random.arrayElements(['1', '2', '3']),
  cep: String(faker.datatype.number({ min: 0, max: 9, precision: 0.0000001 })).replace(/[^0-9]/g, ''),
  number: faker.datatype.number(),
};

const deleteSignatures = async () => connection.query('DELETE FROM signatures;');

const deleteUsersProducts = async () => connection.query('DELETE FROM users_products;');

const deleteDeliveryInfos = async () => connection.query('DELETE FROM delivery_infos;');

export {
  fakeSignature,
  invalidFakeSignature,
  deleteSignatures,
  deleteUsersProducts,
  deleteDeliveryInfos,
};
